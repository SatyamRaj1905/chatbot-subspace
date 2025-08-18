# SuperPost Chatbot Setup Guide

This guide will help you set up the complete SuperPost chatbot application with Nhost authentication, Hasura GraphQL backend, and n8n workflow integration.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Nhost account
- n8n account or instance
- OpenRouter API account

## 1. Nhost Setup

### Create Nhost Project

1. Go to [Nhost Console](https://app.nhost.io) and create a new project
2. Note down your:
   - Subdomain (e.g., `your-project-name`)
   - Region (e.g., `us-east-1`)
   - Backend URL
   - Hasura GraphQL endpoint

### Configure Environment Variables

Update `.env.local` with your Nhost credentials:

```bash
# Nhost Configuration
NEXT_PUBLIC_NHOST_SUBDOMAIN=your-nhost-subdomain
NEXT_PUBLIC_NHOST_REGION=us-east-1
```

## 2. Hasura Database Schema Setup

### Create Tables

In your Nhost project's Hasura console, create the following tables:

#### `chats` table

```sql
CREATE TABLE chats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

#### `messages` table

```sql
CREATE TABLE messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  content text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at timestamptz DEFAULT now()
);
```

### Set up Row Level Security (RLS)

#### Enable RLS on both tables:

```sql
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
```

#### Create RLS Policies:

**For `chats` table:**

```sql
-- Users can view their own chats
CREATE POLICY "Users can view own chats" ON chats
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own chats
CREATE POLICY "Users can insert own chats" ON chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own chats
CREATE POLICY "Users can update own chats" ON chats
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own chats
CREATE POLICY "Users can delete own chats" ON chats
  FOR DELETE USING (auth.uid() = user_id);
```

**For `messages` table:**

```sql
-- Users can view messages from their own chats
CREATE POLICY "Users can view messages from own chats" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );

-- Users can insert messages to their own chats
CREATE POLICY "Users can insert messages to own chats" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chats 
      WHERE chats.id = messages.chat_id 
      AND chats.user_id = auth.uid()
    )
  );
```

### Configure User Role Permissions

In Hasura console, set up permissions for the `user` role:

#### `chats` table permissions:
- **Select**: `{"user_id": {"_eq": "X-Hasura-User-Id"}}`
- **Insert**: `{"user_id": {"_eq": "X-Hasura-User-Id"}}`
- **Update**: `{"user_id": {"_eq": "X-Hasura-User-Id"}}`
- **Delete**: `{"user_id": {"_eq": "X-Hasura-User-Id"}}`

#### `messages` table permissions:
- **Select**: Custom check:
  ```json
  {
    "chat": {
      "user_id": {
        "_eq": "X-Hasura-User-Id"
      }
    }
  }
  ```
- **Insert**: Same as select
- **Update**: Same as select
- **Delete**: Same as select

## 3. Hasura Action Setup

### Create `sendMessage` Action

1. Go to Hasura Console > Actions
2. Create a new action with the following definition:

**Type Definition:**
```graphql
type Mutation {
  sendMessage(chatId: uuid!, content: String!): SendMessageResponse
}

type SendMessageResponse {
  success: Boolean!
  message: String
  messageId: uuid
}
```

**Handler:** `https://your-n8n-instance.com/webhook/send-message`

**Headers:**
```json
{
  "Authorization": "{{HASURA_GRAPHQL_ADMIN_SECRET}}"
}
```

**Permissions:** Allow `user` role

## 4. n8n Workflow Setup

### Create n8n Workflow

1. Import the following workflow into your n8n instance:

```json
{
  "name": "SuperPost Chat Handler",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "send-message",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-node",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [240, 300]
    },
    {
      "parameters": {
        "url": "https://openrouter.ai/api/v1/chat/completions",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "Authorization",
              "value": "Bearer YOUR_OPENROUTER_API_KEY"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "model",
              "value": "openai/gpt-3.5-turbo"
            },
            {
              "name": "messages",
              "value": "={{[{role: 'user', content: $json.input.content}]}}"
            }
          ]
        }
      },
      "id": "openrouter-node",
      "name": "OpenRouter API",
      "type": "n8n-nodes-base.httpRequest",
      "position": [460, 300]
    },
    {
      "parameters": {
        "url": "=https://YOUR_HASURA_ENDPOINT/v1/graphql",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            {
              "name": "x-hasura-admin-secret",
              "value": "YOUR_HASURA_ADMIN_SECRET"
            }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {
              "name": "query",
              "value": "mutation InsertMessage($chatId: uuid!, $content: String!, $role: String!) { insert_messages_one(object: {chat_id: $chatId, content: $content, role: $role}) { id } }"
            },
            {
              "name": "variables",
              "value": "={{chatId: $json.input.chatId, content: $('OpenRouter API').json.choices[0].message.content, role: 'assistant'}}"
            }
          ]
        }
      },
      "id": "save-response-node",
      "name": "Save Response",
      "type": "n8n-nodes-base.httpRequest",
      "position": [680, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "OpenRouter API",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "OpenRouter API": {
      "main": [
        [
          {
            "node": "Save Response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  }
}
```

### Configure Workflow

1. Replace `YOUR_OPENROUTER_API_KEY` with your OpenRouter API key
2. Replace `YOUR_HASURA_ENDPOINT` with your Hasura GraphQL endpoint
3. Replace `YOUR_HASURA_ADMIN_SECRET` with your Hasura admin secret
4. Activate the workflow

## 5. Install Dependencies & Run

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev
```

## 6. Testing

1. Open `http://localhost:3000`
2. Sign up with email/password
3. Create a new chat
4. Send a message
5. Verify the AI response is saved and displayed

## 7. Deployment on Netlify

### Build Configuration

Create `netlify.toml`:

```toml
[build]
  command = "pnpm build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Environment Variables

In Netlify dashboard, add:
- `NEXT_PUBLIC_NHOST_SUBDOMAIN`
- `NEXT_PUBLIC_NHOST_REGION`

### Deploy

1. Connect your GitHub repo to Netlify
2. Configure build settings
3. Deploy

## Features Implemented

✅ **Authentication**: Email sign-up/sign-in using Nhost Auth  
✅ **Database**: `chats` and `messages` tables with RLS  
✅ **Frontend**: React app with real-time GraphQL subscriptions  
✅ **Hasura Action**: `sendMessage` with authentication  
✅ **n8n Workflow**: OpenRouter integration  
✅ **Message Flow**: Complete user → AI → response flow  
✅ **Deployment**: Netlify-ready configuration  

## Support

For issues or questions:
1. Check Nhost documentation: https://docs.nhost.io
2. Check Hasura documentation: https://hasura.io/docs
3. Check n8n documentation: https://docs.n8n.io
