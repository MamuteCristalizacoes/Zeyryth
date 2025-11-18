import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Trash2, Plus, Eye } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface ColorPickerState {
  x: number;
  y: number;
  color: string;
  visible: boolean;
}

export default function ColorCollector() {
  const { t, language } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [colorPicker, setColorPicker] = useState<ColorPickerState>({
    x: 0,
    y: 0,
    color: '#000000',
    visible: false,
  });
  const [colorName, setColorName] = useState('');
  const [savedColors, setSavedColors] = useState<Array<{ id: number; htmlColor: string; name?: string }>>([]);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch saved colors
  const { data: colors } = trpc.colors.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const saveColorMutation = trpc.colors.create.useMutation();
  const deleteColorMutation = trpc.colors.delete.useMutation();

  useEffect(() => {
    if (colors) {
      setSavedColors(colors);
    }
  }, [colors]);

  // Update canvas when image loads
  useEffect(() => {
    if (!imageUrl || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleMouseLeave = () => {
    setColorPicker(prev => ({ ...prev, visible: false }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      loadImage(files[0]);
    }
  };

  const loadImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      setImageUrl(src);
    };
    reader.readAsDataURL(file);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      loadImage(e.target.files[0]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Calcular posição relativa ao canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Verificar se está dentro dos limites do canvas
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
      setColorPicker(prev => ({ ...prev, visible: false }));
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Calcular coordenadas no canvas original (não escalado)
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = x * scaleX;
    const canvasY = y * scaleY;

    // Extrair dados de pixel do canvas
    const imageData = ctx.getImageData(Math.floor(canvasX), Math.floor(canvasY), 1, 1);
    const data = imageData.data;
    
    // Converter para hex color
    const color = `#${[data[0], data[1], data[2]]
      .map((val) => val.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()}`;

    setColorPicker({
      x,
      y,
      color,
      visible: true,
    });
  };

  const handleCanvasClick = () => {
    // Salva a cor quando clica
    handleSaveColor();
  };

  const handleSaveColor = async () => {
    if (!isAuthenticated || !user) {
      toast.error(language === 'pt' ? 'Faça login para salvar cores' : 'Please login to save colors');
      return;
    }

    try {
      await saveColorMutation.mutateAsync({
        htmlColor: colorPicker.color,
        name: colorName || undefined,
      });
      setSavedColors([...savedColors, {
        id: Math.random(),
        htmlColor: colorPicker.color,
        name: colorName || undefined,
      }]);
      setColorName('');
      toast.success(language === 'pt' ? 'Cor salva com sucesso!' : 'Color saved successfully!');
    } catch (error) {
      console.error('Failed to save color:', error);
      toast.error(language === 'pt' ? 'Erro ao salvar cor' : 'Error saving color');
    }
  };

  const handleCopyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
    toast.success(language === 'pt' ? 'Cor copiada!' : 'Color copied!');
  };

  const handleDeleteColor = async (id: number) => {
    try {
      await deleteColorMutation.mutateAsync({ id });
      setSavedColors(savedColors.filter((c) => c.id !== id));
      toast.success(language === 'pt' ? 'Cor deletada!' : 'Color deleted!');
    } catch (error) {
      console.error('Failed to delete color:', error);
      toast.error(language === 'pt' ? 'Erro ao deletar cor' : 'Error deleting color');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">{t('colorCollectorTitle')}</h2>
          <p className="text-muted-foreground mb-6">
            {language === 'pt'
              ? 'Você precisa estar autenticado para usar o coletor de cores.'
              : 'You need to be authenticated to use the color collector.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{t('colorCollectorTitle')}</h1>
        <p className="text-muted-foreground mb-12">
          {language === 'pt'
            ? 'Arraste uma imagem ou clique para selecionar. Use a lupa para extrair cores. Clique na cor para salvar.'
            : 'Drag an image or click to select. Use the magnifier to extract colors. Click to save.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Upload and Color Picker */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              {!imageUrl ? (
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => imageInputRef.current?.click()}
                >
                  <Eye className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-semibold mb-2">{t('dragImageHere')}</p>
                  <p className="text-sm text-muted-foreground">
                    {language === 'pt'
                      ? 'ou clique para selecionar uma imagem'
                      : 'or click to select an image'}
                  </p>
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
              ) : (
                <div ref={containerRef} className="relative inline-block w-full">
                  <canvas
                    ref={canvasRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleCanvasClick}
                    className="w-full border border-border rounded-lg cursor-crosshair max-h-96"
                  />

                  {/* Color Picker Magnifier */}
                  {colorPicker.visible && canvasRef.current && (
                    <div
                      className="absolute w-20 h-20 border-4 border-primary rounded-full pointer-events-none bg-white/10 backdrop-blur shadow-lg"
                      style={{
                        left: `${colorPicker.x}px`,
                        top: `${colorPicker.y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  )}

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setImageUrl(null);
                      setColorPicker({ ...colorPicker, visible: false });
                    }}
                    className="mt-4"
                  >
                    {language === 'pt' ? 'Trocar Imagem' : 'Change Image'}
                  </Button>
                </div>
              )}
            </Card>

            {/* Color Display and Save */}
            {imageUrl && colorPicker.visible && (
              <Card className="p-6 mt-6">
                <div className="flex items-center gap-4">
                  <div
                    className="w-24 h-24 rounded-lg border-2 border-border"
                    style={{ backgroundColor: colorPicker.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">{t('colorCode')}</p>
                    <p className="text-2xl font-mono font-bold mb-4">{colorPicker.color}</p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleCopyColor(colorPicker.color)}
                        variant={copiedColor === colorPicker.color ? 'default' : 'outline'}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        {copiedColor === colorPicker.color ? (language === 'pt' ? 'Copiado' : 'Copied') : 'Copy'}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <label className="block text-sm font-medium mb-2">{t('colorName')}</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder={language === 'pt' ? 'Ex: Azul Céu' : 'E.g: Sky Blue'}
                      value={colorName}
                      onChange={(e) => setColorName(e.target.value)}
                    />
                    <Button onClick={handleSaveColor} className="bg-primary text-primary-foreground">
                      <Plus className="w-4 h-4 mr-2" />
                      {t('saveColor')}
                    </Button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Saved Colors List */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {language === 'pt' ? 'Cores Salvas' : 'Saved Colors'}
              </h2>

              {savedColors.length > 0 ? (
                <div className="space-y-3">
                  {savedColors.map((color) => (
                    <div
                      key={color.id}
                      className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                    >
                      <div
                        className="w-12 h-12 rounded border border-border flex-shrink-0"
                        style={{ backgroundColor: color.htmlColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-mono text-sm font-bold">{color.htmlColor}</p>
                        {color.name && <p className="text-xs text-muted-foreground truncate">{color.name}</p>}
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyColor(color.htmlColor)}
                          title={language === 'pt' ? 'Copiar' : 'Copy'}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteColor(color.id)}
                          className="text-destructive hover:text-destructive"
                          title={language === 'pt' ? 'Deletar' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  {language === 'pt'
                    ? 'Nenhuma cor salva ainda'
                    : 'No colors saved yet'}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
