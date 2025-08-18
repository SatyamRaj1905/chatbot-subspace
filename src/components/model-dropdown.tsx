"use client"
import { Button } from "~/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badge"
import { ChevronDown, Eye, FileText, Info, Crown, Sparkles } from "lucide-react"
import { useState } from "react"

// Free models available on OpenRouter
const models = [
  {
    id: "openrouter/auto",
    name: "Auto (Best Free Model)",
    icon: "🎯",
    features: ["eye", "link", "file", "info"],
    available: true,
    premium: false,
    description: "Automatically selects the best free model",
  },
  {
    id: "mistralai/mixtral-8x7b-instruct",
    name: "Mixtral 8x7B Instruct",
    icon: "🔥",
    features: ["eye", "info"],
    available: true,
    premium: false,
    description: "Smart and fast open model by Mistral",
  },
  {
    id: "meta-llama/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
    icon: "🦙",
    features: ["eye", "file"],
    available: true,
    premium: false,
    description: "Meta's small and powerful model",
  },
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    icon: "⚡",
    features: ["eye"],
    available: true,
    premium: false,
    description: "Lighter, faster version of Mixtral",
  },
  {
    id: "openchat/openchat-3.5-0106",
    name: "OpenChat 3.5",
    icon: "💬",
    features: ["eye", "info"],
    available: true,
    premium: false,
    description: "Fine-tuned chat model, helpful and fast",
  },
  {
    id: "nousresearch/nous-capybara-7b",
    name: "Nous Capybara 7B",
    icon: "🦫",
    features: ["eye", "file"],
    available: true,
    premium: false,
    description: "Conversational model with good memory",
  },
  {
    id: "gryphe/mythomax-l2-13b",
    name: "MythoMax L2 13B",
    icon: "🐉",
    features: ["eye", "info"],
    available: true,
    premium: false,
    description: "Balanced between creativity and logic",
  },
]

interface ModelDropdownProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
}

export function ModelDropdown({ selectedModel, onModelChange }: ModelDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const currentModel = models.find((m) => m.id === selectedModel) ?? models[0]!

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-10 px-4 text-sm font-semibold text-foreground hover:text-foreground 
                   hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 transition-all duration-200 group rounded-full"
        >
          <span className="mr-2 text-base">{currentModel.icon}</span>
          {currentModel.name}
          <ChevronDown className={`ml-2 h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-[380px] p-0 animate-scale-in border-border/50 shadow-2xl card-superpost rounded-3xl"
      >
        {/* Free Models Header */}
        <div className="p-4 bg-gradient-to-r from-green-500/5 via-green-500/10 to-green-500/5 border-b border-border/30 rounded-t-3xl">
          <div className="flex items-center gap-2">
            <span className="text-green-500 text-xl">🆓</span>
            <h4 className="font-bold text-base tracking-tight">Free OpenRouter Models</h4>
          </div>
          <p className="text-xs text-muted-foreground mt-1">All models below are completely free to use</p>
        </div>

        {/* Model List */}
        <div className="p-3 max-h-80 overflow-y-auto custom-scrollbar">
          {models.map((model, index) => (
            <DropdownMenuItem
              key={model.id}
              className={`flex items-center justify-between p-4 cursor-pointer rounded-2xl m-1
                       transition-all duration-200 animate-slide-in hover:bg-gradient-to-r hover:from-muted/40 hover:to-muted/20 ${
                         selectedModel === model.id
                           ? "bg-gradient-to-r from-muted/60 to-muted/40 shadow-sm border border-border/50"
                           : ""
                       }`}
              onClick={() => onModelChange(model.id)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="text-xl">{model.icon}</span>
                <div className="flex flex-col items-start min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm tracking-tight truncate">{model.name}</span>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-1 bg-gradient-to-r from-green-500/20 to-green-500/10 text-green-600 border-green-500/20 rounded-full font-bold"
                    >
                      FREE
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">{model.description}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {model.features.includes("eye") && (
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-muted/40 to-muted/20">
                    <Eye className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                {model.features.includes("link") && (
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-muted/40 to-muted/20">
                    <div className="h-3 w-3 rounded-full border border-muted-foreground" />
                  </div>
                )}
                {model.features.includes("file") && (
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-muted/40 to-muted/20">
                    <FileText className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
                {model.features.includes("info") && (
                  <div className="p-1.5 rounded-full bg-gradient-to-br from-muted/40 to-muted/20">
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border/30 bg-gradient-to-r from-green-500/5 to-transparent rounded-b-3xl">
          <p className="text-center text-xs text-muted-foreground">
            Powered by <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 hover:underline">OpenRouter</a> • All models are free
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
