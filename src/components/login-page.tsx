"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { useSignInEmailPassword, useSignUpEmailPassword } from '@nhost/nextjs'
import { toast } from 'sonner'

interface LoginPageProps {
  // No props needed
}

export function LoginPage({}: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(false)
  
  const { signInEmailPassword, isLoading: isSigningIn, error: signInError } = useSignInEmailPassword()
  const { signUpEmailPassword, isLoading: isSigningUp, error: signUpError } = useSignUpEmailPassword()

  const error = signInError ?? signUpError

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (isSignUp) {
        console.log('Attempting sign up with:', { email, hasPassword: !!password, passwordLength: password.length })
        const result = await signUpEmailPassword(email, password, {
          displayName: email.split('@')[0],
        })
        console.log('Sign up result:', result)
        if (result.error) {
          console.error('Sign up error:', result.error)
          console.error('Error details:', JSON.stringify(result.error, null, 2))
          // Check for specific error types
          if (result.error.message?.includes('email')) {
            console.error('Email-related error - check if email is already registered or domain is allowed')
          }
          if (result.error.message?.includes('password')) {
            console.error('Password-related error - check password requirements in Nhost dashboard')
          }
        } else {
          console.log('Sign up successful!')
          if (result.needsEmailVerification) {
            console.log('Email verification required - check your inbox')
            toast.success('Account created! 🎉', {
              description: 'Please verify using the link in your email and our team will verify you shortly.',
              duration: 8000,
            })
          } else {
            toast.success('Account created successfully! Welcome to SuperPost! 🎉')
          }
        }
      } else {
        console.log('Attempting sign in with:', { email, hasPassword: !!password })
        const result = await signInEmailPassword(email, password)
        console.log('Sign in result:', result)
        if (result.error) {
          console.error('Sign in error:', result.error)
          console.error('Error details:', JSON.stringify(result.error, null, 2))
        } else {
          console.log('Sign in successful!')
        }
      }
    } catch (err) {
      console.error('Authentication error:', err)
      console.error('Caught error details:', JSON.stringify(err, null, 2))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4 gradient-text-superpost">SuperPost</h1>
          <h2 className="text-3xl font-bold mb-4 text-balance tracking-tight">Welcome back</h2>
          <p className="text-muted-foreground text-lg font-medium text-balance leading-relaxed">
            Sign in to continue your AI conversations and unlock powerful features
          </p>
        </div>

        {/* Email Sign In Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-2xl bg-background 
                         focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all
                         placeholder:text-muted-foreground"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-2xl bg-background 
                         focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all
                         placeholder:text-muted-foreground"
                placeholder="Enter your password"
                minLength={3}
              />
            </div>
          </div>



          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-2xl">
              <p className="text-sm text-destructive font-medium">{error.message}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || isSigningIn || isSigningUp}
            className="w-full btn-superpost-primary text-white py-4 rounded-2xl font-bold tracking-wide 
                     text-lg shadow-xl hover:shadow-2xl disabled:opacity-70 group transition-all duration-300
                     hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading || isSigningIn || isSigningUp ? (
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                <span>{isSignUp ? 'Creating account...' : 'Signing in...'}</span>
              </div>
            ) : (
              <span>{isSignUp ? 'Create account' : 'Sign in'}</span>
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-muted-foreground hover:text-foreground font-semibold"
            >
              {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </Button>
          </div>
        </form>

        {/* Features */}
        <div className="mt-12 space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-6 text-muted-foreground">Why sign in?</h3>
            <div className="grid gap-4">
              {[
                { icon: "🚀", title: "Higher message limits", desc: "Get more conversations per day" },
                { icon: "💾", title: "Save your chats", desc: "Access your conversation history" },
                { icon: "⚡", title: "Premium models", desc: "Unlock advanced AI capabilities" },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-muted/20 border border-border/50 
                           hover:bg-muted/30 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 0.2}s` }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="text-center mt-10">
          <p className="text-xs text-muted-foreground font-medium">
            By continuing, you agree to our{" "}
            <Button variant="link" className="p-0 h-auto text-xs font-semibold underline underline-offset-4">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="p-0 h-auto text-xs font-semibold underline underline-offset-4">
              Privacy Policy
            </Button>
          </p>
          <p className="text-xs text-muted-foreground/70 font-medium mt-2">
            🔒 Secure authentication powered by Google OAuth 2.0
          </p>
        </div>
      </div>
    </div>
  )
}
