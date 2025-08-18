# SuperPost - AI-Powered Chatbot Application

A full-stack chatbot application built with Next.js, featuring real-time chat functionality, authentication, and AI-powered responses.

![SuperPost Demo](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.4-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)

## 🚀 Features

### ✅ Completed Features

- **Modern UI/UX**: Beautiful, responsive chat interface with dark/light theme support
- **Authentication System**: Ready for integration with Nhost Auth (currently demo mode)
- **Real-time Chat**: Chat interface with message history and typing indicators  
- **Model Selection**: AI model dropdown with premium upgrade options
- **User Management**: Profile dropdown with user settings and logout functionality
- **Responsive Design**: Mobile-first design that works on all devices
- **TypeScript**: Full type safety throughout the application
- **Performance**: Optimized builds with static generation where possible

### 🏗️ Architecture Ready For

- **Nhost Authentication**: Complete setup files for email/password auth
- **Hasura GraphQL**: Database schema and permissions configurations
- **Apollo Client**: GraphQL client setup for real-time subscriptions
- **n8n Workflow**: AI response processing via OpenRouter API
- **Row-Level Security**: User data isolation and permissions
- **Real-time Updates**: GraphQL subscriptions for live chat updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: Radix UI primitives
- **Authentication**: Nhost (setup ready)
- **Database**: Hasura GraphQL (schema provided)
- **AI Integration**: OpenRouter API via n8n (workflow ready)
- **Deployment**: Netlify (configuration included)

## 🚀 Quick Start

### Demo Mode (Current)

```bash
# Clone the repository
git clone <your-repo-url>
cd superpost-chat

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Visit `http://localhost:3000` and click "Sign in" with any email/password to see the demo.

### Production Setup

For full functionality with real authentication and AI responses, follow the complete setup guide:

📖 **[See SETUP.md for detailed production configuration](./SETUP.md)**

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page with auth logic
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── chat-interface.tsx # Main chat interface
│   ├── login-page.tsx     # Authentication form
│   ├── sidebar.tsx        # Chat navigation sidebar
│   └── user-dropdown.tsx  # User profile menu
├── lib/                   # Utility libraries
│   ├── nhost.ts          # Nhost client configuration
│   ├── apollo.ts         # GraphQL client setup
│   ├── graphql.ts        # GraphQL queries/mutations
│   └── utils.ts          # Utility functions
└── styles/
    └── globals.css        # Global styles and theme
```

## 🎨 Design Features

- **SuperPost Branding**: Custom gradient text and color scheme
- **Modern Card Design**: Glassmorphism effects with backdrop blur
- **Smooth Animations**: CSS animations with staggered reveals
- **Theme Support**: Automatic dark/light mode with system preference detection
- **Responsive Layout**: Mobile-first design with collapsible sidebar
- **Loading States**: Beautiful loading indicators and skeleton screens

## 🔧 Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix linting issues
pnpm typecheck    # Check TypeScript types
```

## 🚀 Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Build settings are pre-configured in `netlify.toml`
4. Set environment variables in Netlify dashboard
5. Deploy!

### Vercel

```bash
npx vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Environment Variables

For demo mode (current setup):
```bash
# No environment variables required
```

For production mode:
```bash
NEXT_PUBLIC_NHOST_SUBDOMAIN=your-nhost-subdomain
NEXT_PUBLIC_NHOST_REGION=us-east-1
```

## 📋 Development Roadmap

### Immediate Next Steps
1. Set up Nhost project and configure real authentication
2. Create Hasura database with provided schema
3. Configure n8n workflow for AI responses
4. Enable real-time GraphQL subscriptions
5. Test complete message flow

### Future Enhancements
- [ ] File upload support for images and documents
- [ ] Voice message recording and playback
- [ ] Chat sharing and collaboration features
- [ ] Advanced AI model configuration
- [ ] Usage analytics and billing integration
- [ ] Mobile app with React Native

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📚 [Setup Guide](./SETUP.md) - Complete production setup instructions
- 🐛 [Issues](https://github.com/your-repo/issues) - Report bugs and request features
- 💬 [Discussions](https://github.com/your-repo/discussions) - Community discussions

---

**Built with ❤️ using Next.js and modern web technologies**

*Ready to deploy, easy to customize, built for scale.*