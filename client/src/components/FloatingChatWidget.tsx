import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, X, Send, Loader2, Minus, Maximize2 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function FloatingChatWidget() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const utils = trpc.useUtils();

  // Don't show the widget on the full chat page
  if (location === "/chat") {
    return null;
  }

  const { data: conversations } = trpc.ai.listConversations.useQuery(undefined, {
    enabled: isOpen,
  });
  
  const { data: messages } = trpc.ai.getMessages.useQuery(
    { conversationId: selectedConversationId! },
    { enabled: !!selectedConversationId && isOpen }
  );

  const createConversationMutation = trpc.ai.createConversation.useMutation({
    onSuccess: (data) => {
      setSelectedConversationId(data.id);
      utils.ai.listConversations.invalidate();
    },
  });

  const sendMessageMutation = trpc.ai.sendMessage.useMutation({
    onSuccess: () => {
      utils.ai.getMessages.invalidate();
      utils.ai.listConversations.invalidate();
      setInput("");
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-select first conversation or create new one when opening
  useEffect(() => {
    if (isOpen && conversations && conversations.length > 0 && !selectedConversationId) {
      setSelectedConversationId(conversations[0].id);
    }
  }, [isOpen, conversations, selectedConversationId]);

  const handleSend = () => {
    if (!input.trim()) return;

    if (!selectedConversationId) {
      // Create new conversation first
      createConversationMutation.mutate(
        { title: input.slice(0, 50) },
        {
          onSuccess: (data) => {
            sendMessageMutation.mutate({
              conversationId: data.id,
              content: input,
            });
          },
        }
      );
    } else {
      sendMessageMutation.mutate({
        conversationId: selectedConversationId,
        content: input,
      });
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 hover:scale-110 transition-transform"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl h-[600px] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">
                  R
                </div>
                <div>
                  <div className="font-semibold">Ready2Spray AI Assistant</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    Ask me anything about your operations
                  </div>
                </div>
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Messages */}
          <ScrollArea className="flex-1 px-6" ref={scrollRef}>
            {!selectedConversationId || !messages || messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 py-8">
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-semibold">
                    Hello! I'm your AI assistant
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    I can help you with job scheduling, weather conditions, EPA compliance, and agricultural operations. What would you like assistance with today?
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4 py-4">
                {messages?.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <Streamdown>{message.content}</Streamdown>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <div className="px-6 py-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={sendMessageMutation.isPending}
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || sendMessageMutation.isPending}
                size="icon"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
