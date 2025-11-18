import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { trpc } from '@/lib/trpc';
import { Plus, Trash2, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AdminPanel() {
  const { language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [newTagName, setNewTagName] = useState('');
  const [newTagDescription, setNewTagDescription] = useState('');
  const [newTagColor, setNewTagColor] = useState('#8B5CF6');

  const tagsQuery = trpc.tags.list.useQuery();
  const createTagMutation = trpc.tags.create.useMutation({
    onSuccess: () => {
      tagsQuery.refetch();
      setNewTagName('');
      setNewTagDescription('');
      setNewTagColor('#8B5CF6');
      toast.success(language === 'pt' ? 'Tag criada com sucesso!' : 'Tag created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const deleteTagMutation = trpc.tags.delete.useMutation({
    onSuccess: () => {
      tagsQuery.refetch();
      toast.success(language === 'pt' ? 'Tag deletada com sucesso!' : 'Tag deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{language === 'pt' ? 'Painel de Admin' : 'Admin Panel'}</h2>
          <p className="text-muted-foreground">
            {language === 'pt'
              ? 'Você precisa estar autenticado para acessar o painel de admin.'
              : 'You need to be authenticated to access the admin panel.'}
          </p>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{language === 'pt' ? 'Acesso Negado' : 'Access Denied'}</h2>
          <p className="text-muted-foreground">
            {language === 'pt'
              ? 'Apenas administradores podem acessar o painel de admin.'
              : 'Only administrators can access the admin panel.'}
          </p>
        </Card>
      </div>
    );
  }

  const handleCreateTag = () => {
    if (!newTagName.trim()) {
      toast.error(language === 'pt' ? 'Nome da tag é obrigatório' : 'Tag name is required');
      return;
    }

    createTagMutation.mutate({
      name: newTagName,
      description: newTagDescription || undefined,
      color: newTagColor,
    });
  };

  const handleDeleteTag = (tagId: number) => {
    if (confirm(language === 'pt' ? 'Tem certeza que deseja deletar esta tag?' : 'Are you sure you want to delete this tag?')) {
      deleteTagMutation.mutate({ id: tagId });
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{language === 'pt' ? 'Painel de Admin' : 'Admin Panel'}</h1>
        <p className="text-muted-foreground mb-8">
          {language === 'pt'
            ? 'Gerencie as tags artísticas e permissões dos usuários.'
            : 'Manage artist tags and user permissions.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Tag Form */}
          <Card className="p-6 lg:col-span-1">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {language === 'pt' ? 'Criar Nova Tag' : 'Create New Tag'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'pt' ? 'Nome da Tag' : 'Tag Name'}
                </label>
                <Input
                  placeholder={language === 'pt' ? 'Ex: Artista' : 'Ex: Artist'}
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'pt' ? 'Descrição' : 'Description'}
                </label>
                <Input
                  placeholder={language === 'pt' ? 'Descrição opcional' : 'Optional description'}
                  value={newTagDescription}
                  onChange={(e) => setNewTagDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  {language === 'pt' ? 'Cor' : 'Color'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="w-12 h-10 rounded border border-border cursor-pointer"
                  />
                  <Input
                    value={newTagColor}
                    onChange={(e) => setNewTagColor(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <Button
                onClick={handleCreateTag}
                disabled={createTagMutation.isPending}
                className="w-full"
              >
                {createTagMutation.isPending
                  ? language === 'pt' ? 'Criando...' : 'Creating...'
                  : language === 'pt' ? 'Criar Tag' : 'Create Tag'}
              </Button>
            </div>
          </Card>

          {/* Tags List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5" />
                {language === 'pt' ? 'Tags Artísticas' : 'Artist Tags'}
              </h2>

              {tagsQuery.isLoading ? (
                <p className="text-muted-foreground">
                  {language === 'pt' ? 'Carregando...' : 'Loading...'}
                </p>
              ) : tagsQuery.data && tagsQuery.data.length > 0 ? (
                <div className="space-y-3">
                  {tagsQuery.data.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="w-6 h-6 rounded-full border border-border"
                          style={{ backgroundColor: tag.color || '#8B5CF6' }}
                        />
                        <div className="flex-1">
                          <p className="font-semibold">{tag.name}</p>
                          {tag.description && (
                            <p className="text-sm text-muted-foreground">{tag.description}</p>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTag(tag.id)}
                        disabled={deleteTagMutation.isPending}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'pt'
                    ? 'Nenhuma tag criada ainda. Crie a primeira!'
                    : 'No tags created yet. Create the first one!'}
                </p>
              )}
            </Card>
          </div>
        </div>

        {/* Default Tags Info */}
        <Card className="p-6 mt-6 bg-muted/50">
          <h3 className="font-semibold mb-3">
            {language === 'pt' ? 'Tags Artísticas Sugeridas' : 'Suggested Artist Tags'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
            <div>
              <p className="font-medium">🎨 {language === 'pt' ? 'Artista' : 'Artist'}</p>
              <p className="text-muted-foreground">{language === 'pt' ? 'Criador de arte geral' : 'General art creator'}</p>
            </div>
            <div>
              <p className="font-medium">🗿 {language === 'pt' ? 'Escultor' : 'Sculptor'}</p>
              <p className="text-muted-foreground">{language === 'pt' ? 'Especialista em escultura' : 'Sculpture specialist'}</p>
            </div>
            <div>
              <p className="font-medium">✏️ {language === 'pt' ? 'Ilustrador' : 'Illustrator'}</p>
              <p className="text-muted-foreground">{language === 'pt' ? 'Especialista em desenho' : 'Drawing specialist'}</p>
            </div>
            <div>
              <p className="font-medium">🎭 {language === 'pt' ? 'Pintor' : 'Painter'}</p>
              <p className="text-muted-foreground">{language === 'pt' ? 'Especialista em pintura' : 'Painting specialist'}</p>
            </div>
            <div>
              <p className="font-medium">💎 {language === 'pt' ? 'Artista Profissional' : 'Professional Artist'}</p>
              <p className="text-muted-foreground">{language === 'pt' ? 'Artista de nível profissional' : 'Professional level artist'}</p>
            </div>
            <div>
              <p className="font-medium">🌟 {language === 'pt' ? 'Escultor Digital' : 'Digital Sculptor'}</p>
              <p className="text-muted-foreground">{language === 'pt' ? 'Especialista em escultura digital' : 'Digital sculpture specialist'}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
