import { gql } from '@apollo/client'

// Chat queries and mutations
export const GET_CHATS = gql`
  query GetChats($userId: uuid!) {
    chats(where: { user_id: { _eq: $userId } }, order_by: { created_at: desc }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`

export const GET_CHAT_MESSAGES = gql`
  query GetChatMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
      chat_id
    }
  }
`

export const CREATE_CHAT = gql`
  mutation CreateChat($title: String = "New Chat") {
    insert_chats_one(object: { title: $title }) {
      id
      title
      created_at  
      user_id
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation CreateMessage($chatId: uuid!, $content: String!, $role: String!) {
    insert_messages_one(object: { 
      chat_id: $chatId, 
      content: $content, 
      role: $role 
    }) {
      id
      content
      role
      created_at
      chat_id
    }
  }
`

// Subscriptions for real-time updates
export const SUBSCRIBE_TO_MESSAGES = gql`
  subscription SubscribeToMessages($chatId: uuid!) {
    messages(where: { chat_id: { _eq: $chatId } }, order_by: { created_at: asc }) {
      id
      content
      role
      created_at
      chat_id
    }
  }
`

export const SUBSCRIBE_TO_CHATS = gql`
  subscription SubscribeToChats($userId: uuid!) {
    chats(where: { user_id: { _eq: $userId } }, order_by: { updated_at: desc }) {
      id
      title
      created_at
      updated_at
      user_id
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation SendMessage($chatId: String!, $content: String!) {
    sendMessage(chatId: $chatId, content: $content) {
      message
      messageId
    }
  }
`;

// Test query to check if the action exists
export const TEST_INTROSPECTION = gql`
  query IntrospectionQuery {
    __schema {
      mutationType {
        fields {
          name
          type {
            name
          }
        }
      }
    }
  }
`;


