"use client"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { UserDropdown } from "./user-dropdown"
import { Search, Menu, Plus, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { useState } from "react"
import { useUserData } from '@nhost/nextjs'

interface Chat {
  id: string
  title: string
  created_at: string
  updated_at: string
  user_id: string
}

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  chats: Chat[]
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
  onNewChat: () => void
}

export function Sidebar({ 
  isOpen, 
  onToggle, 
  isCollapsed, 
  onToggleCollapse, 
  chats, 
  currentChatId, 
  onChatSelect, 
  onNewChat 
}: SidebarProps) {
  const user = useUserData()
  const [searchValue, setSearchValue] = useState("")
  
  // Filter chats based on search
  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed left-0 top-0 h-full bg-background/95 backdrop-blur-xl border-r border-border/50 z-50 
        transform transition-all duration-300 ease-out
        ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto lg:shadow-none lg:bg-background lg:backdrop-blur-none
        ${isCollapsed ? "lg:w-20" : "lg:w-72"}
      `}
        style={{ width: isOpen ? "288px" : isCollapsed ? "80px" : "288px" }}
      >
        <div className="flex flex-col h-full p-4">
          {/* Header */}
          <div className={`flex items-center mb-6 ${isCollapsed ? "justify-center" : "justify-between"}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 transition-all rounded-full"
                  onClick={onToggle}
                >
                  <Menu className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-black tracking-tight gradient-text-superpost">SuperPost</h1>
              </div>
            )}

            {isCollapsed && <h1 className="text-lg font-black tracking-tight gradient-text-superpost">SP</h1>}

            {/* Collapse Toggle - Desktop Only */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 transition-all rounded-full"
              onClick={onToggleCollapse}
            >
              {isCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>

          {/* New Chat Button */}
          <div className="mb-6">
            <Button
              onClick={onNewChat}
              className={`bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary/90 hover:to-primary/70
                       text-white font-semibold rounded-full py-3 group transition-all duration-200 shadow-lg hover:shadow-xl
                       hover:scale-[1.02] active:scale-[0.98] ${isCollapsed ? "w-12 h-12 p-0" : "w-full"}`}
              title={isCollapsed ? "New Chat" : undefined}
            >
              <Plus className={`h-4 w-4 transition-transform group-hover:rotate-90 ${isCollapsed ? "" : "mr-2"}`} />
              {!isCollapsed && "New Chat"}
            </Button>
          </div>

          {/* Search */}
          {!isCollapsed && (
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search your threads..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-12 input-superpost rounded-full py-3 font-medium focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}

          {/* Search Icon for Collapsed */}
          {isCollapsed && (
            <div className="mb-6 flex justify-center">
              <Button
                variant="ghost"
                size="icon"
                className="w-12 h-12 hover:bg-gradient-to-r hover:from-muted/50 hover:to-muted/30 transition-all rounded-full"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Chat History */}
          <div className="flex-1 mb-6 overflow-hidden">
            <div className="space-y-2 h-full overflow-y-auto custom-scrollbar">
              {filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    onClick={() => onChatSelect(chat.id)}
                    className={`
                      transition-all duration-200 group
                      ${isCollapsed 
                        ? "w-12 h-12 p-0 rounded-full mx-auto" 
                        : "w-full justify-start p-4 rounded-2xl text-left"
                      }
                      ${currentChatId === chat.id 
                        ? "bg-primary/10 text-primary border-primary/20" 
                        : "hover:bg-muted/30"
                      }
                    `}
                    title={isCollapsed ? chat.title : undefined}
                  >
                    {isCollapsed ? (
                      <div className="text-xs font-bold">
                        {chat.title.substring(0, 2).toUpperCase()}
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate mb-1">
                          {chat.title}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(chat.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </Button>
                ))
              ) : (
                <div className={`text-center ${isCollapsed ? "px-2" : "px-4"} py-8`}>
                  <div className="text-muted-foreground text-sm">
                    {isCollapsed ? "No chats" : "No conversations yet"}
                  </div>
                  {!isCollapsed && (
                    <div className="text-xs text-muted-foreground/70 mt-1">
                      Start a new chat to begin
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          {user && (
            <div className="border-t border-border/50 pt-4">
              {isCollapsed ? (
                <div className="flex justify-center">
                  <UserDropdown />
                </div>
              ) : (
                <UserDropdown />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
