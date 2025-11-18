import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/_core/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Share2, Download, Lock, Unlock } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

export default function Palettes() {
  const { language, t } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [paletteName, setPaletteName] = useState('');
  const [paletteDescription, setPaletteDescription] = useState('');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Fetch palettes
  const { data: palettes = [] } = trpc.palettes.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const createPaletteMutation = trpc.palettes.create.useMutation();
  const deletePaletteMutation = trpc.palettes.delete.useMutation();

  const handleCreatePalette = async () => {
    if (!paletteName || selectedColors.length === 0) {
      alert(language === 'pt' ? 'Preencha todos os campos' : 'Fill all fields');
      return;
    }

    try {
      await createPaletteMutation.mutateAsync({
        name: paletteName,
        colors: selectedColors,
        description: paletteDescription || undefined,
        isPublic: false,
      });

      setPaletteName('');
      setPaletteDescription('');
      setSelectedColors([]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create palette:', error);
    }
  };

  const handleDeletePalette = async (id: number) => {
    if (confirm(language === 'pt' ? 'Tem certeza?' : 'Are you sure?')) {
      try {
        await deletePaletteMutation.mutateAsync({ id });
      } catch (error) {
        console.error('Failed to delete palette:', error);
      }
    }
  };

  const handleDownloadPalette = (palette: any) => {
    const json = JSON.stringify({
      name: palette.name,
      colors: palette.colors,
      description: palette.description,
    }, null, 2);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${palette.name}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{t('paletteTitle')}</h2>
          <p className="text-muted-foreground">
            {language === 'pt'
              ? 'Você precisa estar autenticado para criar e gerenciar paletas.'
              : 'You need to be authenticated to create and manage palettes.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">{t('paletteTitle')}</h1>
            <p className="text-muted-foreground">
              {language === 'pt'
                ? 'Crie, salve e compartilhe suas paletas de cores favoritas.'
                : 'Create, save and share your favorite color palettes.'}
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('createPalette')}
          </Button>
        </div>

        {/* Palettes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {palettes.length === 0 ? (
            <Card className="col-span-full p-12 text-center">
              <p className="text-muted-foreground mb-4">
                {language === 'pt'
                  ? 'Nenhuma paleta criada ainda.'
                  : 'No palettes created yet.'}
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                {t('createPalette')}
              </Button>
            </Card>
          ) : (
            palettes.map((palette: any) => (
              <Card key={palette.id} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{palette.name}</h3>
                {palette.description && (
                  <p className="text-sm text-muted-foreground mb-4">{palette.description}</p>
                )}

                {/* Color Grid */}
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {palette.colors.map((color: string, idx: number) => (
                    <div
                      key={idx}
                      className="aspect-square rounded border border-border hover:border-primary transition-colors"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleDownloadPalette(palette)}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    {language === 'pt' ? 'Baixar' : 'Download'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeletePalette(palette.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Create Palette Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-md w-full">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{t('createPalette')}</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('paletteName')}
                    </label>
                    <Input
                      placeholder={language === 'pt' ? 'Ex: Pôr do Sol' : 'E.g: Sunset'}
                      value={paletteName}
                      onChange={(e) => setPaletteName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {t('paletteDescription')}
                    </label>
                    <Input
                      placeholder={language === 'pt' ? 'Descrição (opcional)' : 'Description (optional)'}
                      value={paletteDescription}
                      onChange={(e) => setPaletteDescription(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      {language === 'pt' ? 'Cores' : 'Colors'}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        type="color"
                        id="colorPicker"
                        className="w-12 h-10 cursor-pointer"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const input = document.getElementById('colorPicker') as HTMLInputElement;
                          if (input && !selectedColors.includes(input.value)) {
                            setSelectedColors([...selectedColors, input.value]);
                          }
                        }}
                      >
                        {t('save')}
                      </Button>
                    </div>

                    <div className="grid grid-cols-6 gap-2">
                      {selectedColors.map((color, idx) => (
                        <div
                          key={idx}
                          className="aspect-square rounded border-2 border-border cursor-pointer hover:border-primary transition-colors"
                          style={{ backgroundColor: color }}
                          onClick={() => setSelectedColors(selectedColors.filter((_, i) => i !== idx))}
                          title={language === 'pt' ? 'Clique para remover' : 'Click to remove'}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary text-primary-foreground"
                    onClick={handleCreatePalette}
                  >
                    {t('savePalette')}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                  >
                    {t('cancel')}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
