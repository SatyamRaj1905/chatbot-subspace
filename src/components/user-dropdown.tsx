"use client"

import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Settings, CreditCard, LogOut, Crown, Zap } from "lucide-react"
import { useUserData, useSignOut } from '@nhost/nextjs'

interface UserDropdownProps {}

export function UserDropdown({}: UserDropdownProps) {
  const user = useUserData()
  const { signOut } = useSignOut()
  
  if (!user) return null
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start p-3 h-auto hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 
                   transition-all duration-200 rounded-2xl group border border-transparent hover:border-border/50"
        >
          <div className="flex items-center gap-3 w-full">
            <Avatar className="h-10 w-10 border-2 border-border/50 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.displayName || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold">
                {user.displayName
                  ? user.displayName.split(" ").map((n) => n[0]).join("")
                  : user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-sm truncate">{user.displayName || 'User'}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge
                variant="secondary"
                className="text-xs px-2 py-0.5 rounded-full font-bold transition-all bg-muted text-muted-foreground"
              >
                Free
              </Badge>
              <div className="text-xs text-muted-foreground font-medium">∞ messages</div>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0 animate-scale-in border-border/50 shadow-2xl card-superpost rounded-2xl"
      >
        {/* User Info Header */}
        <div className="p-4 border-b border-border/30 bg-gradient-to-r from-muted/20 to-transparent">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-border/50">
              <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.displayName || 'User'} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-lg">
                {user.displayName
                  ? user.displayName.split(" ").map((n) => n[0]).join("")
                  : user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-bold text-base">{user.displayName || 'User'}</div>
              <div className="text-sm text-muted-foreground">{user.email}</div>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="text-xs px-2 py-1 rounded-full font-bold bg-muted text-muted-foreground"
                >
                  Free Plan
                </Badge>
                <div className="text-xs text-muted-foreground font-semibold">
                  <Zap className="inline h-3 w-3 mr-1" />
                  ∞ messages
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 transition-all">
            <Settings className="mr-3 h-4 w-4" />
            <span className="font-semibold">Profile Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 transition-all">
            <Settings className="mr-3 h-4 w-4" />
            <span className="font-semibold">Preferences</span>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 transition-all">
            <CreditCard className="mr-3 h-4 w-4" />
            <span className="font-semibold">Billing & Usage</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-2 bg-border/30" />
          <DropdownMenuItem className="p-3 rounded-xl cursor-pointer bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/15 transition-all border border-primary/20">
            <Crown className="mr-3 h-4 w-4 text-primary" />
            <div className="flex-1">
              <div className="font-bold text-primary">Upgrade to Pro</div>
              <div className="text-xs text-primary/70">Unlock premium features</div>
            </div>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="bg-border/30" />

        <div className="p-2">
          <DropdownMenuItem
            className="p-3 rounded-xl cursor-pointer hover:bg-gradient-to-r hover:from-destructive/10 hover:to-destructive/5 
                     text-destructive hover:text-destructive transition-all"
            onClick={() => signOut()}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-semibold">Sign out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
