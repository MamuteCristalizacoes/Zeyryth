import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { User, Edit2, Save, X, Copy, Trash2 } from 'lucide-react';
import { useState, useRef } from 'react';
import { toast } from 'sonner';

export default function UserProfile() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editBio, setEditBio] = useState(user?.bio || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tagsQuery = trpc.tags.list.useQuery();
  const userTagsQuery = trpc.tags.getUserTags.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const palettesQuery = trpc.palettes.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    // TODO: Implementar API para salvar perfil
    toast.success(language === 'pt' ? 'Perfil atualizado!' : 'Profile updated!');
    setIsEditing(false);
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(language === 'pt' ? 'Cor copiada!' : 'Color copied!');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{language === 'pt' ? 'Meu Perfil' : 'My Profile'}</h2>
          <p className="text-muted-foreground">
            {language === 'pt'
              ? 'Você precisa estar autenticado para acessar seu perfil.'
              : 'You need to be authenticated to access your profile.'}
          </p>
        </Card>
      </div>
    );
  }

  const userTags = userTagsQuery.data || [];
  const allTags = tagsQuery.data || [];
  const palettes = palettesQuery.data || [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">{language === 'pt' ? 'Meu Perfil' : 'My Profile'}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <img
                        src={avatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                        alt="Avatar"
                        className="w-32 h-32 rounded-full border-4 border-primary"
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'pt' ? 'Nome' : 'Name'}</label>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder={language === 'pt' ? 'Seu nome' : 'Your name'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">{language === 'pt' ? 'Bio' : 'Bio'}</label>
                    <Input
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder={language === 'pt' ? 'Sua bio' : 'Your bio'}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} className="flex-1 gap-2">
                      <Save className="w-4 h-4" />
                      {language === 'pt' ? 'Salvar' : 'Save'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 gap-2"
                    >
                      <X className="w-4 h-4" />
                      {language === 'pt' ? 'Cancelar' : 'Cancel'}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border-4 border-primary mx-auto"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{user?.name || 'Artista'}</h2>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                    {editBio && <p className="text-sm mt-2">{editBio}</p>}
                  </div>

                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    {language === 'pt' ? 'Editar Perfil' : 'Edit Profile'}
                  </Button>
                </div>
              )}
            </Card>
          </div>

          {/* Tags and Palettes */}
          <div className="lg:col-span-2 space-y-8">
            {/* User Tags */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {language === 'pt' ? 'Minhas Tags' : 'My Tags'}
              </h3>

              {userTags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userTags.map((userTag) => {
                    const tag = allTags.find(t => t.id === parseInt(userTag.tag));
                    return tag ? (
                      <div
                        key={userTag.id}
                        className="px-4 py-2 rounded-full border-2 flex items-center gap-2"
                        style={{ borderColor: tag.color || '#8B5CF6' }}
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color || '#8B5CF6' }}
                        />
                        <span className="font-semibold text-sm">{tag.name}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'pt'
                    ? 'Você ainda não possui tags. Aguarde o admin atribuir tags a você!'
                    : 'You don\'t have any tags yet. Wait for the admin to assign tags to you!'}
                </p>
              )}
            </Card>

            {/* Saved Palettes */}
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {language === 'pt' ? 'Minhas Paletas' : 'My Palettes'}
              </h3>

              {palettes.length > 0 ? (
                <div className="space-y-4">
                  {palettes.map((palette) => {
                    const colors = JSON.parse(palette.colors);
                    return (
                      <div
                        key={palette.id}
                        className="p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold">{palette.name}</h4>
                            {palette.description && (
                              <p className="text-sm text-muted-foreground">{palette.description}</p>
                            )}
                          </div>
                          {palette.isPublic && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {language === 'pt' ? 'Público' : 'Public'}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          {colors.map((color: string, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 p-2 bg-muted rounded cursor-pointer hover:bg-muted/80"
                              onClick={() => handleCopyColor(color)}
                              title={language === 'pt' ? 'Clique para copiar' : 'Click to copy'}
                            >
                              <div
                                className="w-6 h-6 rounded border border-border"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs font-mono">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'pt'
                    ? 'Você ainda não criou nenhuma paleta'
                    : 'You haven\'t created any palettes yet'}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
