import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Palette, Image } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'color' | 'texture';
  data?: any;
}

export default function Chat() {
  const { language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      author: 'Admin',
      content: language === 'pt' ? 'Bem-vindo ao chat da comunidade!' : 'Welcome to the community chat!',
      timestamp: new Date(Date.now() - 3600000),
      type: 'text',
    },
  ]);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !isAuthenticated || !user) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: user.name || user.email || 'User',
      content: messageInput,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const handleShareColor = () => {
    if (!isAuthenticated || !user) return;

    const color = prompt(language === 'pt' ? 'Digite a cor (ex: #FF5733):' : 'Enter color (e.g: #FF5733):');
    if (!color) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      author: user.name || user.email || 'User',
      content: `${language === 'pt' ? 'Compartilhou uma cor' : 'Shared a color'}: ${color}`,
      timestamp: new Date(),
      type: 'color',
      data: { color },
    };

    setMessages([...messages, newMessage]);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{t('chatTitle')}</h2>
          <p className="text-muted-foreground mb-6">
            {language === 'pt'
              ? 'Você precisa estar autenticado para usar o chat.'
              : 'You need to be authenticated to use the chat.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{t('chatTitle')}</h1>
        <p className="text-muted-foreground mb-8">
          {language === 'pt'
            ? 'Conecte-se com artistas, compartilhe cores e texturas em tempo real.'
            : 'Connect with artists, share colors and textures in real-time.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-3">
            <Card className="h-96 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    {t('noMessages')}
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-semibold">
                        {msg.author.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">{msg.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {msg.timestamp.toLocaleTimeString(language === 'pt' ? 'pt-BR' : 'en-US')}
                          </span>
                        </div>
                        {msg.type === 'color' ? (
                          <div className="flex items-center gap-2 mt-1">
                            <div
                              className="w-6 h-6 rounded border border-border"
                              style={{ backgroundColor: msg.data?.color }}
                            />
                            <span className="text-sm">{msg.content}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-foreground mt-1">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t border-border p-4 space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('typeMessage')}
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
                    className="bg-primary text-primary-foreground"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={handleShareColor}
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    {t('shareColor')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Image className="w-4 h-4 mr-2" />
                    {t('shareTexture')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Online Users */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">
                {language === 'pt' ? 'Usuários Online' : 'Online Users'}
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">{user?.name || user?.email}</span>
                  <span className="text-xs text-muted-foreground ml-auto">Você</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm">Admin</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400" />
                  <span className="text-sm text-muted-foreground">5 mais offline</span>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-4">
              <h3 className="font-semibold mb-3">
                {language === 'pt' ? 'Estatísticas' : 'Stats'}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'pt' ? 'Mensagens' : 'Messages'}
                  </span>
                  <span className="font-semibold">{messages.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'pt' ? 'Usuários' : 'Users'}
                  </span>
                  <span className="font-semibold">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {language === 'pt' ? 'Cores Compartilhadas' : 'Shared Colors'}
                  </span>
                  <span className="font-semibold">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
