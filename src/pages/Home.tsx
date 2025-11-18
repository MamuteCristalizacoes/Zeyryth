import { useAuth } from "@/_core/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Palette, Image, MessageSquare, Sparkles, Users, Zap } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const { t, language } = useLanguage();

  const features = [
    {
      icon: Palette,
      title: t("colorCollector"),
      description: language === "pt"
        ? "Arraste imagens e extraia cores com nossa lupa interativa. Salve e compartilhe suas cores favoritas."
        : "Drag images and extract colors with our interactive color picker. Save and share your favorite colors.",
      href: "/color-collector",
    },
    {
      icon: Image,
      title: t("textureGallery"),
      description: language === "pt"
        ? "Explore texturas de mármore, madeira, pele e muito mais. Aprenda com tutoriais passo a passo."
        : "Explore marble, wood, skin textures and more. Learn with step-by-step tutorials.",
      href: "/textures",
    },
    {
      icon: Sparkles,
      title: t("paletteTitle"),
      description: language === "pt"
        ? "Crie, salve e compartilhe paletas de cores com a comunidade de artistas."
        : "Create, save and share color palettes with the artist community.",
      href: "/palettes",
    },
    {
      icon: MessageSquare,
      title: t("chatTitle"),
      description: language === "pt"
        ? "Conecte-se com outros artistas, compartilhe cores e texturas em tempo real."
        : "Connect with other artists, share colors and textures in real-time.",
      href: "/chat",
    },
  ];

  const stats = [
    { label: language === "pt" ? "Artistas Ativos" : "Active Artists", value: "1.2K+" },
    { label: language === "pt" ? "Cores Salvas" : "Saved Colors", value: "5.8K+" },
    { label: language === "pt" ? "Paletas Compartilhadas" : "Shared Palettes", value: "892" },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-sm font-semibold text-primary">
                {language === "pt" ? "Bem-vindo à comunidade de artistas" : "Welcome to the artist community"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              {t("welcome")}
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              {t("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link href="/color-collector">
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      <Palette className="w-5 h-5 mr-2" />
                      {t("colorCollector")}
                    </Button>
                  </Link>
                  <Link href="/textures">
                    <Button size="lg" variant="outline">
                      <Image className="w-5 h-5 mr-2" />
                      {t("textureGallery")}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => window.location.href = getLoginUrl()}
                  >
                    <Zap className="w-5 h-5 mr-2" />
                    {t("login")}
                  </Button>
                  <Button size="lg" variant="outline">
                    {language === "pt" ? "Saiba Mais" : "Learn More"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {language === "pt" ? "Recursos Principais" : "Main Features"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {language === "pt"
                ? "Tudo que você precisa para melhorar suas habilidades de escultura e desenho"
                : "Everything you need to improve your sculpting and drawing skills"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Link key={feature.href} href={feature.href}>
                  <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer border border-border hover:border-primary/50">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {language === "pt"
                ? "Pronto para começar?"
                : "Ready to get started?"}
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              {language === "pt"
                ? "Junte-se à comunidade de artistas e comece a explorar texturas e cores incríveis."
                : "Join the artist community and start exploring amazing textures and colors."}
            </p>
            {!isAuthenticated && (
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => window.location.href = getLoginUrl()}
              >
                <Users className="w-5 h-5 mr-2" />
                {language === "pt" ? "Criar Conta Grátis" : "Create Free Account"}
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
