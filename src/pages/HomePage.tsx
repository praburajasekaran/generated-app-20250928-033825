import { useState, useEffect, useRef, FormEvent, KeyboardEvent } from 'react';
import { Send, Bot, Settings, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Toaster, toast } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';
import { chatService } from '@/lib/chat';
import type { Message } from '../../worker/types';
import { ThemeToggle } from '@/components/ThemeToggle';
type ChatMessage = Message;
const welcomeMessage: ChatMessage = {
  id: 'zenith-welcome',
  role: 'assistant',
  content: "Hello! I'm Zenith, your personal knowledge assistant. How can I help you manage your notes today? You can ask me to create, find, or link notes.",
  timestamp: Date.now(),
};
export function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const [isVaultConnected, setIsVaultConnected] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);
  const fetchHistory = async () => {
    setIsLoading(true);
    const res = await chatService.getMessages();
    if (res.success && res.data && res.data.messages.length > 0) {
      setMessages(res.data.messages);
    } else {
      setMessages([welcomeMessage]);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchHistory();
  }, []);
  const adjustTextAreaHeight = () => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  };
  useEffect(() => {
    adjustTextAreaHeight();
  }, [input]);
  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userInput = input;
    setInput('');
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: userInput,
      timestamp: Date.now(),
    };
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === 'zenith-welcome'
        ? [userMessage]
        : [...prev, userMessage]
    );
    setIsLoading(true);
    setStreamingMessage('');
    try {
      await chatService.sendMessage(userInput, undefined, (chunk) => {
        setStreamingMessage((prev) => prev + chunk);
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "Sorry, I couldn't connect to the assistant. Please try again later.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        setMessages(res.data.messages);
      }
      setIsLoading(false);
      setStreamingMessage('');
      textAreaRef.current?.focus();
    }
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  const handleNewChat = () => {
    chatService.newSession();
    setMessages([welcomeMessage]);
    setStreamingMessage('');
    toast.success("New chat started.");
  };
  const handleConnectVault = () => {
    setIsVaultConnected(true);
    setIsSettingsOpen(false);
    toast.success("Vault Connected", {
      description: "Zenith is now connected to your knowledge base.",
    });
  };
  const handleDisconnectVault = () => {
    setIsVaultConnected(false);
    toast.info("Vault Disconnected", {
      description: "Zenith is no longer connected to your knowledge base.",
    });
  };
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-50 font-sans">
      <Toaster richColors position="top-center" />
      <header className="h-16 px-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={handleNewChat}>
            <Plus className="w-5 h-5" />
          </Button>
        </div>
        <h1 className="text-xl font-semibold tracking-tight absolute left-1/2 -translate-x-1/2">Zenith Note</h1>
        <div className="flex items-center gap-2">
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Data Sources</DialogTitle>
                <DialogDescription>Connect Zenith to your knowledge base to enable intelligent, context-aware answers.</DialogDescription>
              </DialogHeader>
              {isVaultConnected ? (
                <div className="py-4">
                  <p className="font-medium">Google Drive Vault</p>
                  <p className="text-sm text-muted-foreground">Connected and synchronized.</p>
                </div>
              ) : (
                <div className="py-4">
                  <p className="text-sm text-muted-foreground">No vault connected.</p>
                </div>
              )}
              <DialogFooter>
                {isVaultConnected ? (
                  <Button variant="destructive" onClick={handleDisconnectVault}>Disconnect</Button>
                ) : (
                  <Button onClick={handleConnectVault}>Connect Google Drive</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <ThemeToggle className="relative top-0 right-0" />
        </div>
      </header>
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto">
        <ScrollArea className="flex-1 p-4 md:p-6" ref={scrollAreaRef}>
          <div className="space-y-6">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  layout
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className={cn('flex flex-col gap-1', msg.role === 'user' ? 'items-end' : 'items-start')}
                >
                  <div className={cn('flex items-end gap-3', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                    {msg.role === 'assistant' && (
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                          <Bot className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl prose prose-sm dark:prose-invert prose-p:my-0',
                        msg.role === 'user'
                          ? 'bg-slate-900 text-slate-50 dark:bg-slate-50 dark:text-slate-900 rounded-br-lg'
                          : 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-lg'
                      )}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                  {msg.role === 'user' && isLoading && isVaultConnected && (
                    <p className="text-xs text-muted-foreground animate-pulse mr-2 mt-1">Searching knowledge base...</p>
                  )}
                </motion.div>
              ))}
              {streamingMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex items-end gap-3 justify-start"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-slate-200 dark:bg-slate-700">
                      <Bot className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-lg prose prose-sm dark:prose-invert prose-p:my-0">
                    <p className="whitespace-pre-wrap leading-relaxed">{streamingMessage}<span className="animate-pulse">▍</span></p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>
        <footer className="sticky bottom-0 bg-slate-50 dark:bg-slate-900 p-4 border-t border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <Textarea
              ref={textAreaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isVaultConnected ? "Ask about your notes..." : "Create a new note about..."}
              className="flex-1 min-h-[44px] max-h-48 resize-none rounded-2xl bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-slate-900 dark:focus-visible:ring-slate-50 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:focus-visible:ring-offset-slate-900 transition-all"
              rows={1}
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="w-11 h-11 rounded-full bg-slate-900 hover:bg-slate-700 dark:bg-slate-50 dark:hover:bg-slate-200 text-slate-50 dark:text-slate-900 transition-all duration-200 disabled:opacity-50 disabled:scale-100 active:scale-95"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </footer>
      </main>
    </div>
  );
}