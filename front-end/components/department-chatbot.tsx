"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DepartmentChatbotProps {
  department: string;
  onCloseAction: () => void;
  specialization: string;
}

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export function DepartmentChatbot({
  department,
  onCloseAction,
  specialization,
}: DepartmentChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: `Hello! I'm your specialized AI assistant for ${department}. I can help you with ${specialization}. What would you like to work on today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { toast } = useToast();
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    setUniqueId(`user-${messages.length}-${Date.now()}`);
  }, [messages.length]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uniqueId,
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response based on department
    setTimeout(() => {
      let aiResponse = "";

      switch (department.toLowerCase()) {
        case "marketing":
          aiResponse = `Great question about "${input}"! For marketing, I recommend focusing on data-driven strategies. Would you like me to help you create a campaign plan or analyze your current metrics?`;
          break;
        case "support":
          aiResponse = `I understand you need help with "${input}". For customer support, I can help you draft responses, categorize tickets, or suggest resolution strategies. What specific aspect would you like to focus on?`;
          break;
        case "hr":
          aiResponse = `Regarding "${input}" in HR management, I can assist with employee onboarding processes, performance evaluation frameworks, or recruitment strategies. Which area interests you most?`;
          break;
        case "finance":
          aiResponse = `For your finance query about "${input}", I can help with budget analysis, expense categorization, or financial reporting. Would you like me to create a financial template or analyze spending patterns?`;
          break;
        case "operations":
          aiResponse = `Your operations question about "${input}" is interesting! I can help optimize workflows, create process documentation, or suggest automation opportunities. What's your priority?`;
          break;
        default:
          aiResponse = `I can help you with "${input}". Let me provide some specialized insights for your ${department} department.`;
      }

      const aiMessage: Message = {
        id: `ai-${messages.length}-${Date.now()}`,
        type: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between flex-shrink-0 border-b">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span>{department} AI Assistant</span>
            </CardTitle>
            <CardDescription>
              Specialized AI for {specialization}
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onCloseAction}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.type === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[80%] ${
                    message.type === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-full ${
                      message.type === "user"
                        ? "bg-blue-600"
                        : "bg-gradient-to-r from-purple-500 to-pink-500"
                    }`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 text-slate-900 border"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.type === "user"
                          ? "text-blue-100"
                          : "text-slate-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="p-3 rounded-lg bg-slate-100 border">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask your ${department} AI assistant...`}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-center mt-2">
              <Badge variant="outline" className="text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by Advanced AI
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
