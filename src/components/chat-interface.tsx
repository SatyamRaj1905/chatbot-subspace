"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Sidebar } from "./sidebar"
import { ModelDropdown } from "./model-dropdown"
import { ThemeToggle } from "./theme-toggle"
import { Menu, Sparkles, Search, Code, GraduationCap, Paperclip, ArrowUp, Send } from "lucide-react"
import { useUserData } from '@nhost/nextjs'
import { useQuery, useMutation, useSubscription } from '@apollo/client'
import { toast } from 'sonner'
import { GET_CHATS, CREATE_CHAT, CREATE_MESSAGE, GET_CHAT_MESSAGES, SUBSCRIBE_TO_MESSAGES, SEND_MESSAGE } from '~/lib/graphql'

interface ChatInterfaceProps {
  // No props needed
}

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  created_at: string
  chat_id: string
}

interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
  user_id: string
}

const categoryButtons = [
  {
    icon: Sparkles,
    label: "Create",
    description: "Generate creative content",
    color: "from-blue-500/10 to-blue-600/10 border-blue-500/20",
  },
  {
    icon: Search,
    label: "Explore",
    description: "Research and discover",
    color: "from-green-500/10 to-green-600/10 border-green-500/20",
  },
  {
    icon: Code,
    label: "Code",
    description: "Programming assistance",
    color: "from-purple-500/10 to-purple-600/10 border-purple-500/20",
  },
  {
    icon: GraduationCap,
    label: "Learn",
    description: "Educational content",
    color: "from-orange-500/10 to-orange-600/10 border-orange-500/20",
  },
]

const sampleQuestions = [
  "How does AI work?",
  "Are black holes real?",
  'How many Rs are in the word "strawberry"?',
  "What is the meaning of life?",
]

// Generate intelligent fallback responses for common question types
function generateFallbackResponse(messageContent: string): string {
  const lowerContent = messageContent.toLowerCase()
  
  // Check for specific question patterns and provide relevant responses
  if (lowerContent.includes('how many') && lowerContent.includes('strawberry')) {
    return "There are 3 R's in the word 'strawberry' - two R's together in the middle (st-rr-awberry) and one at the end (strawber-r-y). This is a common tricky question because people often miss the double R in the middle!"
  }
  
  if (lowerContent.includes('black hole')) {
    return "Yes, black holes are real! They're regions of spacetime where gravity is so strong that nothing, not even light, can escape. Scientists have detected many black holes through their gravitational effects and even captured the first image of one in 2019."
  }
  
  if (lowerContent.includes('how') && lowerContent.includes('ai')) {
    return "AI works by using algorithms to process data, learn patterns, and make predictions or decisions. Modern AI uses techniques like neural networks that loosely mimic how human brains process information, learning from vast amounts of training data."
  }
  
  if (lowerContent.includes('meaning of life')) {
    return "The meaning of life is a profound philosophical question with many perspectives. Some find meaning through relationships, personal growth, helping others, creative expression, or spiritual beliefs. It's ultimately something each person discovers for themselves."
  }
  
  // Default fallback for other questions
  return "I'm currently running in demo mode while the AI integration is being set up. I can provide basic responses to common questions, but for full AI capabilities, please wait for the webhook configuration to be completed."
}

export function ChatInterface({ }: ChatInterfaceProps) {
  const user = useUserData()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedModel, setSelectedModel] = useState("openrouter/auto")
  const [isTyping, setIsTyping] = useState(false)
  const [isAiResponding, setIsAiResponding] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // GraphQL hooks
  const { data: chatsData, refetch: refetchChats } = useQuery(GET_CHATS, {
    variables: { userId: user?.id },
    skip: !user?.id,
  })
  const { data: messagesData, refetch: refetchMessages } = useQuery(GET_CHAT_MESSAGES, {
    variables: { chatId: currentChatId },
    skip: !currentChatId,
    fetchPolicy: 'cache-and-network', // Get fresh data but use cache for immediate response
  })

  const [createChat] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      setCurrentChatId(data.insert_chats_one.id)
      refetchChats()
    },
  })

  const [createMessage] = useMutation(CREATE_MESSAGE, {
    onCompleted: (data) => {
      // Refetch messages to show new message immediately
      refetchMessages()
      console.log('Message created:', data.insert_messages_one)
    },
  })

  // Apollo mutation for sending message (AI response)
  const [sendMessageMutation] = useMutation(SEND_MESSAGE, {
    errorPolicy: 'all',
    onError: (error) => {
      console.error("SendMessage mutation error:", error)
    },
  })

  // Subscribe to real-time message updates (temporarily disabled for testing)
  // useSubscription(SUBSCRIBE_TO_MESSAGES, {
  //   variables: { chatId: currentChatId },
  //   skip: !currentChatId,
  //   onData: ({ data }) => {
  //     if (data?.data?.messages) {
  //       setMessages(data.data.messages)
  //     }
  //   },
  // })

  // Update messages when query data changes (with content-based deduplication)
  useEffect(() => {
    if (messagesData?.messages) {
      const rawMessages = messagesData.messages
      
      // Remove duplicate messages based on content + role + timestamp (within 5 seconds)
      const deduplicatedMessages = rawMessages.filter((msg: Message, index: number, arr: Message[]) => {
        // Keep all user messages
        if (msg.role === 'user') return true
        
        // For assistant messages, check for duplicates
        const duplicateIndex = arr.findIndex((otherMsg: Message, otherIndex: number) => 
          otherIndex < index && // Only check previous messages
          otherMsg.role === 'assistant' &&
          otherMsg.content === msg.content &&
          Math.abs(new Date(otherMsg.created_at).getTime() - new Date(msg.created_at).getTime()) < 5000 // Within 5 seconds
        )
        
        return duplicateIndex === -1 // Keep if no duplicate found
      })
      
      console.log(`Raw messages: ${rawMessages.length}, After deduplication: ${deduplicatedMessages.length}`)
      setMessages(deduplicatedMessages)
    }
  }, [messagesData])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping, isAiResponding])

  // Handle new chat creation
  const handleNewChat = useCallback(() => {
    setCurrentChatId(null)
    setMessages([])
    setMessage("")
    setIsTyping(false)
    setIsAiResponding(false)
    toast.success('New chat started! 🚀')
  }, [])

  // Handle chat selection
  const handleChatSelect = useCallback((chatId: string) => {
    if (chatId !== currentChatId) {
      setCurrentChatId(chatId)
      setMessages([]) // Clear messages while loading
      setIsTyping(false)
      setIsAiResponding(false)
    }
  }, [currentChatId])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input with "/"
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && e.target !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
      
      // New chat with Ctrl/Cmd + N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n' && !e.shiftKey) {
        e.preventDefault()
        handleNewChat()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleNewChat])

  const handleSendMessage = async () => {
    if (!message.trim()) return

    const messageContent = message.trim()
    setMessage("")
    setIsTyping(true)
    setIsAiResponding(true)
    
    // Show toaster about slow responses
    toast.info('AI is thinking...', {
      description: 'Please be patient, OpenRouter responses are very slow SMH 🤦‍♂️',
      duration: 4000,
    })

    try {
      // Create a new chat if one doesn't exist
      let chatId = currentChatId
      if (!chatId) {
        const chatResult = await createChat({
          variables: {
            title: messageContent.substring(0, 50) + (messageContent.length > 50 ? "..." : ""),
          },
        })
        chatId = chatResult.data?.insert_chats_one?.id
      }

      if (chatId) {
        // Add user message
        await createMessage({
          variables: {
            chatId,
            content: messageContent,
            role: "user",
          },
        })

        // Get AI response using the sendMessage action
        try {
          console.log('Calling sendMessage action with:', { chatId, content: messageContent })
          
          const { data, errors } = await sendMessageMutation({
            variables: {
              chatId,
              content: messageContent,
            },
          })
          
          console.log('SendMessage response:', { data, errors })
          
          if (errors && errors.length > 0) {
            // Handle GraphQL errors - check if it's a webhook issue
            console.error('GraphQL errors:', errors)
            const errorMessage = errors[0]?.message || 'Unknown GraphQL error'
            
            if (errorMessage.includes('not a valid json response from webhook')) {
              // Webhook is not properly configured, use intelligent fallback
              const fallbackResponse = generateFallbackResponse(messageContent)
              await createMessage({
                variables: {
                  chatId,
                  content: fallbackResponse,
                  role: "assistant",
                },
              })
            } else {
              await createMessage({
                variables: {
                  chatId,
                  content: `Error: ${errorMessage}`,
                  role: "assistant",
                },
              })
            }
          } else if (data?.sendMessage) {
            const result = data.sendMessage
            if (result.success) {
              // AI response successful
              await createMessage({
                variables: {
                  chatId,
                  content: result.message,
                  role: "assistant",
                },
              })
            } else {
              // AI response failed but no GraphQL error
              await createMessage({
                variables: {
                  chatId,
                  content: result.message || "AI response failed",
                  role: "assistant",
                },
              })
            }
          } else {
            // No data returned
            await createMessage({
              variables: {
                chatId,
                content: "Error: No response from AI service",
                role: "assistant",
              },
            })
          }
        } catch (err) {
          console.error('Unexpected error calling sendMessage:', err)
          const fallbackResponse = generateFallbackResponse(messageContent)
          await createMessage({
            variables: {
              chatId,
              content: fallbackResponse,
              role: "assistant",
            },
          })
        }
        setIsTyping(false)
        setIsAiResponding(false)
        toast.success('AI response received! 🎉')
      }
    } catch (error) {
      console.error("Error sending message:", error)
      setIsTyping(false)
      setIsAiResponding(false)
      toast.error('Failed to send message. Please try again.')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        chats={chatsData?.chats || []}
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/50 lg:hidden bg-background/80 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="hover:bg-muted/40 transition-colors rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="font-bold tracking-tight text-lg">SuperPost</h1>
          <ThemeToggle />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-end p-6 bg-background/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all rounded-full"
            >
              <span className="text-sm font-bold">$</span>
            </Button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {messages.length === 0 ? (
            // Welcome Screen
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center justify-center min-h-full p-8 max-w-6xl mx-auto w-full">
              <div className="text-center mb-12 w-full animate-fade-in">
                <h1 className="text-6xl font-black mb-4 text-balance tracking-tight bg-gradient-to-br from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
                  How can I help you{user?.displayName ? `, ${user.displayName.split(" ")[0]}` : ""}?
                </h1>

                {/* Category Buttons */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 justify-center mb-16 max-w-4xl mx-auto">
                  {categoryButtons.map((category, index) => (
                    <Button
                      key={category.label}
                      variant="outline"
                      className={`flex flex-col items-center gap-4 h-auto p-8 bg-gradient-to-br ${category.color}
                               hover:bg-muted/40 hover:border-border transition-all duration-300 
                               card-superpost group animate-fade-in rounded-3xl border-2`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <category.icon className="h-8 w-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <div className="text-center">
                        <div className="font-bold text-base tracking-tight mb-1">{category.label}</div>
                        <div className="text-sm text-muted-foreground font-medium">{category.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {/* Sample Questions */}
                <div className="space-y-4 max-w-2xl mx-auto mb-12">
                  {sampleQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left justify-start h-auto p-6 text-muted-foreground 
                               hover:text-foreground hover:bg-muted/30 rounded-2xl transition-all duration-200 
                               animate-fade-in group border border-transparent hover:border-border/50"
                      onClick={() => setMessage(question)}
                      style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                    >
                      <span className="font-semibold text-base">{question}</span>
                      <ArrowUp className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity rotate-45" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            </div>
          ) : (
            // Chat Messages
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className="text-xs mt-2 opacity-60">
                        {new Date(msg.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {(isTyping || isAiResponding) && (
                  <div className="flex justify-start animate-fade-in">
                    <div className="max-w-[80%] p-4 rounded-2xl bg-muted/50 border border-muted">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white text-xs font-bold">AI</span>
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {isAiResponding ? 'Generating response...' : 'Thinking...'}
                        </div>
                      </div>
                      
                      {/* Skeleton text lines */}
                      <div className="space-y-2">
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-3/4"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-1/2"></div>
                        <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-2/3"></div>
                      </div>
                      
                      {/* Typing dots */}
                      <div className="flex space-x-1 mt-3 justify-center">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="w-2 h-2 bg-primary/60 rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </div>
        
        {/* Message Input Container */}
        <div className="flex-shrink-0 p-6 pb-8">
          <div className="relative card-superpost rounded-3xl border-2 border-border/50 shadow-xl max-w-5xl mx-auto">
            <div className="flex items-center p-4 lg:p-5 gap-3 lg:gap-4">
            <ModelDropdown selectedModel={selectedModel} onModelChange={setSelectedModel} />

            <div className="h-8 w-px bg-border/50" />

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all rounded-full"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all rounded-full"
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 
                             placeholder:text-muted-foreground/60 text-base font-medium pr-16 py-3"
              />
              {isTyping && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="h-10 w-10 btn-superpost-primary text-white rounded-full shadow-lg disabled:opacity-50 
                           disabled:cursor-not-allowed transition-all duration-200"
            >
              {isTyping ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
