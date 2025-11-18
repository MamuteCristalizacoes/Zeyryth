import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Send, Palette, Share2, Users } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface ChatMessage {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  message: string;
  colorShared?: string | null;
  textureShared?: string | null;
  createdAt: Date;
}

export default function CommunityChat() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const messagesQuery = trpc.chat.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const sendMessageMutation = trpc.chat.send.useMutation();

  useEffect(() => {
    if (messagesQuery.data) {
      setMessages(messagesQuery.data);
    }
  }, [messagesQuery.data]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() && !selectedColor) return;

    try {
      await sendMessageMutation.mutateAsync({
        content: messageInput,
        sharedColor: selectedColor || undefined,
      });

      setMessageInput('');
      setSelectedColor(null);

      // Refetch messages
      messagesQuery.refetch();
      toast.success(language === 'pt' ? 'Mensagem enviada!' : 'Message sent!');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error(language === 'pt' ? 'Erro ao enviar mensagem' : 'Error sending message');
    }
  };

  const handleShareColor = (color: string) => {
    setSelectedColor(color);
    toast.success(language === 'pt' ? 'Cor selecionada para compartilhar!' : 'Color selected to share!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{t('chatTitle')}</h2>
          <p className="text-muted-foreground mb-6">
            {language === 'pt'
              ? 'Você precisa estar autenticado para acessar o chat.'
              : 'You need to be authenticated to access the chat.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{t('chatTitle')}</h1>
          <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{onlineUsers} {language === 'pt' ? 'Online' : 'Online'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Messages */}
          <div className="lg:col-span-3">
            <Card className="p-6 h-96 flex flex-col">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={msg.userAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.userName}`}
                          alt={msg.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{msg.userName}</span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(msg.createdAt).toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US')}
                            </span>
                          </div>
                          <p className="text-sm mt-1 break-words">{msg.message}</p>

                          {msg.colorShared && (
                            <div className="mt-2 flex items-center gap-2 p-2 bg-background rounded border border-border">
                              <div
                                className="w-6 h-6 rounded border border-border"
                                style={{ backgroundColor: msg.colorShared }}
                              />
                              <span className="text-xs font-mono">{msg.colorShared}</span>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.colorShared || '');
                                  toast.success(language === 'pt' ? 'Cor copiada!' : 'Color copied!');
                                }}
                                className="ml-auto text-xs text-primary hover:underline"
                              >
                                {language === 'pt' ? 'Copiar' : 'Copy'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>{language === 'pt' ? 'Nenhuma mensagem ainda. Seja o primeiro a falar!' : 'No messages yet. Be the first to speak!'}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="border-t border-border pt-4 space-y-3">
                {selectedColor && (
                  <div className="flex items-center gap-2 p-2 bg-primary/10 rounded border border-primary/20">
                    <Palette className="w-4 h-4 text-primary" />
                    <div
                      className="w-4 h-4 rounded border border-border"
                      style={{ backgroundColor: selectedColor }}
                    />
                    <span className="text-xs font-mono flex-1">{selectedColor}</span>
                    <button
                      onClick={() => setSelectedColor(null)}
                      className="text-xs text-primary hover:underline"
                    >
                      {language === 'pt' ? 'Remover' : 'Remove'}
                    </button>
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder={language === 'pt' ? 'Digite sua mensagem...' : 'Type your message...'}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() && !selectedColor}
                    className="gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {language === 'pt' ? 'Enviar' : 'Send'}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar - Quick Colors & Palettes */}
          <div className="space-y-6">
            {/* Recent Colors */}
            <Card className="p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                {language === 'pt' ? 'Cores Rápidas' : 'Quick Colors'}
              </h3>

              <div className="space-y-2">
                {['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleShareColor(color)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div
                      className="w-8 h-8 rounded border border-border"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-mono flex-1">{color}</span>
                    <Share2 className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </Card>

            {/* Chat Tips */}
            <Card className="p-6 bg-primary/5 border border-primary/20">
              <h4 className="font-semibold mb-3 text-sm">
                {language === 'pt' ? 'Dicas' : 'Tips'}
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>✨ {language === 'pt' ? 'Compartilhe cores clicando nos botões' : 'Share colors by clicking the buttons'}</li>
                <li>🎨 {language === 'pt' ? 'Discuta técnicas de escultura' : 'Discuss sculpting techniques'}</li>
                <li>👥 {language === 'pt' ? 'Conheça outros artistas' : 'Meet other artists'}</li>
                <li>💡 {language === 'pt' ? 'Peça feedback sobre suas criações' : 'Ask for feedback on your creations'}</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
