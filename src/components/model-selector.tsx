"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Badge } from "~/components/ui/badge"
import { Dialog, DialogTrigger } from "~/components/ui/dialog"
import { Search, Eye, FileText, Info, Filter, ChevronDown } from "lucide-react"

// Free models available on OpenRouter
const models = [
  {
    id: "openrouter/auto",
    name: "Auto (Best Free Model)",
    icon: "🎯",
    features: ["eye", "link", "file", "info"],
    available: true,
    premium: false,
  },
  {
    id: "mistralai/mixtral-8x7b-instruct",
    name: "Mixtral 8x7B Instruct",
    icon: "🔥",
    features: ["eye", "info"],
    available: true,
    premium: false,
  },
  {
    id: "meta-llama/llama-3-8b-instruct",
    name: "Llama 3 8B Instruct",
    icon: "🦙",
    features: ["eye", "file"],
    available: true,
    premium: false,
  },
  {
    id: "mistralai/mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    icon: "⚡",
    features: ["eye"],
    available: true,
    premium: false,
  },
  {
    id: "openchat/openchat-3.5-0106",
    name: "OpenChat 3.5",
    icon: "💬",
    features: ["eye", "info"],
    available: true,
    premium: false,
  },
  {
    id: "nousresearch/nous-capybara-7b",
    name: "Nous Capybara 7B",
    icon: "🦫",
    features: ["eye", "file"],
    available: true,
    premium: false,
  },
  {
    id: "gryphe/mythomax-l2-13b",
    name: "MythoMax L2 13B",
    icon: "🐉",
    features: ["eye", "info"],
    available: true,
    premium: false,
  },
]

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState("openrouter/auto")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  const filteredModels = models.filter((model) => model.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const displayedModels = showAll ? filteredModels : filteredModels.slice(0, 4)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="w-full max-w-md mx-auto bg-card border border-border rounded-lg p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search models..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Premium Banner */}
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-600/10 border border-pink-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Unlock all models + higher limits</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-2xl font-bold text-pink-500">$8</span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                Upgrade now
              </Button>
            </div>
          </div>

          {/* Model List */}
          <div className="space-y-2">
            {displayedModels.map((model) => (
              <div
                key={model.id}
                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedModel === model.id ? "border-pink-500 bg-pink-500/5" : "border-border hover:bg-muted/50"
                } ${!model.available ? "opacity-50" : ""}`}
                onClick={() => model.available && setSelectedModel(model.id)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{model.icon}</span>
                  <span className="font-medium">{model.name}</span>
                  {!model.available && (
                    <Badge variant="secondary" className="text-xs">
                      Pro
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {model.features.includes("eye") && <Eye className="h-4 w-4 text-muted-foreground" />}
                  {model.features.includes("link") && (
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  {model.features.includes("file") && <FileText className="h-4 w-4 text-muted-foreground" />}
                  {model.features.includes("info") && <Info className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>
            ))}
          </div>

          {/* Show All Button */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
            <Button variant="ghost" onClick={() => setShowAll(!showAll)} className="flex items-center gap-2">
              {showAll ? "Show less" : "Show all"}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogTrigger>
    </Dialog>
  )
}
