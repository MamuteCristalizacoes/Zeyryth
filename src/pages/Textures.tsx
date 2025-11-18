import { useLanguage } from '@/contexts/LanguageContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen } from 'lucide-react';
import { useState } from 'react';

interface Texture {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  image: string;
  tutorial: string;
  tutorialEn: string;
}

const textures: Texture[] = [
  {
    id: 'marble-white',
    name: 'Mármore Branco',
    nameEn: 'White Marble',
    category: 'marble',
    image: '/textures/marble-white.jpg',
    tutorial: 'Para criar um mármore branco realista: 1) Comece com uma base branca pura. 2) Adicione veios cinzas e pretos usando traços irregulares. 3) Aplique sombreado suave nas bordas dos veios. 4) Use degradês para criar profundidade. 5) Finalize com highlights brilhantes.',
    tutorialEn: 'To create realistic white marble: 1) Start with a pure white base. 2) Add gray and black veins using irregular strokes. 3) Apply soft shading on vein edges. 4) Use gradients to create depth. 5) Finish with bright highlights.',
  },
  {
    id: 'marble-black',
    name: 'Mármore Preto',
    nameEn: 'Black Marble',
    category: 'marble',
    image: '/textures/marble-black.jpg',
    tutorial: 'Para criar mármore preto: 1) Base preta profunda. 2) Adicione veios brancos e cinzas brilhantes. 3) Use contrastes altos para destaque. 4) Aplique reflexos sutis. 5) Crie profundidade com múltiplas camadas de sombreado.',
    tutorialEn: 'To create black marble: 1) Deep black base. 2) Add bright white and gray veins. 3) Use high contrast for emphasis. 4) Apply subtle reflections. 5) Create depth with multiple shading layers.',
  },
  {
    id: 'marble-pink',
    name: 'Mármore Rosa',
    nameEn: 'Pink Marble',
    category: 'marble',
    image: '/textures/marble-pink.jpg',
    tutorial: 'Para mármore rosa elegante: 1) Base rosa suave. 2) Adicione veios em tons mais escuros. 3) Use tons de ouro para realce. 4) Crie profundidade com sombreado. 5) Perfeito para designs sofisticados.',
    tutorialEn: 'For elegant pink marble: 1) Soft pink base. 2) Add veins in darker tones. 3) Use gold tones for highlights. 4) Create depth with shading. 5) Perfect for sophisticated designs.',
  },
  {
    id: 'marble-green',
    name: 'Mármore Verde',
    nameEn: 'Green Marble',
    category: 'marble',
    image: '/textures/marble-green.jpg',
    tutorial: 'Para mármore verde luxuoso: 1) Base verde profunda. 2) Adicione veios brancos e dourados. 3) Use contrastes para destaque. 4) Aplique reflexos brilhantes. 5) Crie atmosfera premium.',
    tutorialEn: 'For luxurious green marble: 1) Deep green base. 2) Add white and gold veins. 3) Use contrast for emphasis. 4) Apply bright reflections. 5) Create premium atmosphere.',
  },
  {
    id: 'marble-blue',
    name: 'Mármore Azul',
    nameEn: 'Blue Marble',
    category: 'marble',
    image: '/textures/marble-blue.jpg',
    tutorial: 'Para mármore azul sofisticado: 1) Base azul profundo. 2) Adicione veios brancos brilhantes. 3) Use tons de prata. 4) Crie profundidade com múltiplas camadas. 5) Ideal para designs modernos.',
    tutorialEn: 'For sophisticated blue marble: 1) Deep blue base. 2) Add bright white veins. 3) Use silver tones. 4) Create depth with multiple layers. 5) Ideal for modern designs.',
  },
  {
    id: 'wood-oak',
    name: 'Madeira de Carvalho',
    nameEn: 'Oak Wood',
    category: 'wood',
    image: '/textures/wood-oak.jpg',
    tutorial: 'Para desenhar madeira de carvalho: 1) Use tons de marrom e bege. 2) Crie padrões de anéis concêntricos. 3) Adicione grãos verticais irregulares. 4) Aplique sombreado para textura. 5) Use highlights para mostrar brilho natural.',
    tutorialEn: 'To draw oak wood: 1) Use brown and beige tones. 2) Create concentric ring patterns. 3) Add irregular vertical grains. 4) Apply shading for texture. 5) Use highlights to show natural shine.',
  },
  {
    id: 'wood-dark',
    name: 'Madeira Escura',
    nameEn: 'Dark Wood',
    category: 'wood',
    image: '/textures/wood-dark.jpg',
    tutorial: 'Para madeira escura: 1) Base marrom escuro. 2) Adicione grãos em tons mais claros. 3) Use contrastes para profundidade. 4) Aplique reflexos brilhantes. 5) Crie textura com pequenos detalhes.',
    tutorialEn: 'For dark wood: 1) Dark brown base. 2) Add grains in lighter tones. 3) Use contrast for depth. 4) Apply bright reflections. 5) Create texture with small details.',
  },
  {
    id: 'wood-walnut',
    name: 'Madeira de Nogueira',
    nameEn: 'Walnut Wood',
    category: 'wood',
    image: '/textures/wood-walnut.jpg',
    tutorial: 'Para madeira de nogueira rica: 1) Base marrom escuro. 2) Adicione grãos em tons variados. 3) Use contrastes profundos. 4) Aplique reflexos sutis. 5) Crie textura realista com detalhes.',
    tutorialEn: 'For rich walnut wood: 1) Dark brown base. 2) Add grains in varied tones. 3) Use deep contrast. 4) Apply subtle reflections. 5) Create realistic texture with details.',
  },
  {
    id: 'wood-birch',
    name: 'Madeira de Bétula',
    nameEn: 'Birch Wood',
    category: 'wood',
    image: '/textures/wood-birch.jpg',
    tutorial: 'Para madeira de bétula clara: 1) Base bege claro. 2) Adicione grãos sutis. 3) Use tons naturais. 4) Crie suavidade nas transições. 5) Perfeita para designs minimalistas.',
    tutorialEn: 'For light birch wood: 1) Light beige base. 2) Add subtle grains. 3) Use natural tones. 4) Create smooth transitions. 5) Perfect for minimalist designs.',
  },
  {
    id: 'skin-tone',
    name: 'Textura de Pele',
    nameEn: 'Skin Texture',
    category: 'skin',
    image: '/textures/skin-tone.jpg',
    tutorial: 'Para desenhar pele realista: 1) Comece com base de cor de pele. 2) Adicione variações de tons. 3) Use sombreado para contornos. 4) Aplique highlights nos pontos altos. 5) Adicione pequenos detalhes como poros e sardas.',
    tutorialEn: 'To draw realistic skin: 1) Start with skin tone base. 2) Add tone variations. 3) Use shading for contours. 4) Apply highlights on high points. 5) Add small details like pores and freckles.',
  },
  {
    id: 'gradient-sunset',
    name: 'Degradê Pôr do Sol',
    nameEn: 'Sunset Gradient',
    category: 'gradient',
    image: '/textures/gradient-sunset.jpg',
    tutorial: 'Para criar um degradê de pôr do sol: 1) Comece com laranja no topo. 2) Transição para rosa no meio. 3) Termine com roxo na base. 4) Suavize as transições. 5) Adicione toques de vermelho para dramaticidade.',
    tutorialEn: 'To create a sunset gradient: 1) Start with orange at top. 2) Transition to pink in middle. 3) End with purple at base. 4) Smooth the transitions. 5) Add touches of red for drama.',
  },
  {
    id: 'gradient-cool',
    name: 'Degradê Frio',
    nameEn: 'Cool Gradient',
    category: 'gradient',
    image: '/textures/gradient-cool.jpg',
    tutorial: 'Para degradê frio: 1) Comece com azul claro. 2) Transição para azul escuro. 3) Termine com roxo profundo. 4) Mantenha transições suaves. 5) Use para criar atmosfera tranquila.',
    tutorialEn: 'For cool gradient: 1) Start with light blue. 2) Transition to dark blue. 3) End with deep purple. 4) Keep smooth transitions. 5) Use to create calm atmosphere.',
  },
  {
    id: 'shading-soft',
    name: 'Sombreado Suave',
    nameEn: 'Soft Shading',
    category: 'shading',
    image: '/textures/shading-soft.jpg',
    tutorial: 'Para sombreado suave: 1) Use cores próximas. 2) Crie transições graduais. 3) Evite linhas duras. 4) Aplique múltiplas camadas. 5) Perfeito para retratos e superfícies lisas.',
    tutorialEn: 'For soft shading: 1) Use close colors. 2) Create gradual transitions. 3) Avoid hard lines. 4) Apply multiple layers. 5) Perfect for portraits and smooth surfaces.',
  },
  {
    id: 'shading-hard',
    name: 'Sombreado Duro',
    nameEn: 'Hard Shading',
    category: 'shading',
    image: '/textures/shading-hard.jpg',
    tutorial: 'Para sombreado duro: 1) Use contrastes altos. 2) Crie transições abruptas. 3) Defina sombras claramente. 4) Aumente o drama. 5) Ideal para estilos cartoon ou ilustração.',
    tutorialEn: 'For hard shading: 1) Use high contrast. 2) Create abrupt transitions. 3) Define shadows clearly. 4) Increase drama. 5) Ideal for cartoon or illustration styles.',
  },
  {
    id: 'leaves-green',
    name: 'Textura de Folhas',
    nameEn: 'Leaves Texture',
    category: 'leaves',
    image: '/textures/leaves-green.jpg',
    tutorial: 'Para textura de folhas realista: 1) Comece com tons de verde variados. 2) Desenhe formas de folhas individuais. 3) Adicione veios nas folhas. 4) Use sombreado para profundidade. 5) Crie sobreposição natural.',
    tutorialEn: 'For realistic leaves texture: 1) Start with varied green tones. 2) Draw individual leaf shapes. 3) Add veins to leaves. 4) Use shading for depth. 5) Create natural overlap.',
  },
];

export default function Textures() {
  const { language, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedTexture, setSelectedTexture] = useState<Texture | null>(null);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });

  const categories = ['all', 'marble', 'wood', 'skin', 'gradient', 'shading', 'leaves'];

  const filteredTextures = activeCategory === 'all'
    ? textures
    : textures.filter(t => t.category === activeCategory);

  const handleMouseMove = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!selectedTexture) return;
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMagnifierPos({ x, y });
    setShowMagnifier(true);
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
  };

  const categoryLabels: Record<string, string> = {
    all: language === 'pt' ? 'Todos' : 'All',
    marble: language === 'pt' ? 'Mármore' : 'Marble',
    wood: language === 'pt' ? 'Madeira' : 'Wood',
    skin: language === 'pt' ? 'Pele' : 'Skin',
    gradient: language === 'pt' ? 'Degradê' : 'Gradient',
    shading: language === 'pt' ? 'Sombreado' : 'Shading',
    leaves: language === 'pt' ? 'Folhas' : 'Leaves',
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-2">{t('textureGallery')}</h1>
        <p className="text-muted-foreground mb-8">
          {language === 'pt'
            ? 'Explore nossas texturas geradas por IA e aprenda com tutoriais passo a passo.'
            : 'Explore our AI-generated textures and learn with step-by-step tutorials.'}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Texture List */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={activeCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                >
                  {categoryLabels[cat]}
                </Button>
              ))}
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredTextures.map((texture) => (
                <Card
                  key={texture.id}
                  className={`p-3 cursor-pointer transition-all ${
                    selectedTexture?.id === texture.id
                      ? 'ring-2 ring-primary bg-primary/10'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedTexture(texture)}
                >
                  <img
                    src={texture.image}
                    alt={texture.name}
                    className="w-full h-20 object-cover rounded mb-2"
                  />
                  <p className="font-semibold text-sm">{language === 'pt' ? texture.name : texture.nameEn}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Texture Preview and Tutorial */}
          <div className="lg:col-span-3">
            {selectedTexture && (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={selectedTexture.image}
                    alt={selectedTexture.name}
                    className="w-full h-96 object-cover rounded-lg border border-border cursor-crosshair"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  />
                  {showMagnifier && (
                    <div
                      className="absolute w-16 h-16 border-2 border-primary rounded-full pointer-events-none bg-white/10 backdrop-blur"
                      style={{
                        left: `${magnifierPos.x - 32}px`,
                        top: `${magnifierPos.y - 32}px`,
                      }}
                    />
                  )}
                </div>

                <Card className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {language === 'pt' ? selectedTexture.name : selectedTexture.nameEn}
                  </h2>

                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {language === 'pt' ? 'Tutorial Passo a Passo' : 'Step by Step Tutorial'}
                    </h4>
                    <p className="text-sm text-foreground leading-relaxed">
                      {language === 'pt' ? selectedTexture.tutorial : selectedTexture.tutorialEn}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 gap-2">
                      <Download className="w-4 h-4" />
                      {language === 'pt' ? 'Baixar' : 'Download'}
                    </Button>
                  </div>
                </Card>
              </div>
            )}

            {!selectedTexture && (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">
                  {language === 'pt'
                    ? 'Selecione uma textura para ver o tutorial completo'
                    : 'Select a texture to see the complete tutorial'}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
