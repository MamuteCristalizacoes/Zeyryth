import React, { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { Link } from 'wouter';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationLinks = [
    { href: '/', label: t('home') },
    { href: '/textures', label: t('textures') },
    { href: '/color-collector', label: t('colorCollector') },
    { href: '/palettes', label: t('palettes') },
    { href: '/chat', label: t('chat') },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center gap-2 font-bold text-2xl text-primary hover:text-primary/80 transition-colors cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Z</span>
                </div>
                <span className="hidden sm:inline">Zeyryth'Studio</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span className="text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer">
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="flex gap-1 bg-muted rounded-lg p-1">
                <button
                  onClick={() => setLanguage('pt')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    language === 'pt'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted-foreground/20'
                  }`}
                >
                  PT
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted-foreground/20'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="w-10 h-10"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>

              {/* User Menu */}
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2">
                  <Link href="/profile">
                    <span className="text-sm font-medium text-foreground hover:text-primary transition-colors hidden sm:block cursor-pointer">
                      {user.name || user.email}
                    </span>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => logout()}
                  >
                    {t('logout')}
                  </Button>
                </div>
              ) : (
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {t('login')}
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pt-4 border-t border-border flex flex-col gap-3">
              {navigationLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <span
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors block py-2 cursor-pointer"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </span>
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg text-primary mb-4">Zeyryth'Studio</h3>
              <p className="text-sm text-muted-foreground">
                {language === "pt"
                  ? "Dicas e tutoriais para esculpir e desenhar"
                  : "Tips and tutorials for sculpting and drawing"}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">{t('textures')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/textures"><span className="hover:text-primary transition-colors cursor-pointer">{t('marble')}</span></Link></li>
                <li><Link href="/textures"><span className="hover:text-primary transition-colors cursor-pointer">{t('wood')}</span></Link></li>
                <li><Link href="/textures"><span className="hover:text-primary transition-colors cursor-pointer">{t('skin')}</span></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4">{t('community')}</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/chat"><span className="hover:text-primary transition-colors cursor-pointer">{t('chat')}</span></Link></li>
                <li><Link href="/palettes"><span className="hover:text-primary transition-colors cursor-pointer">{t('palettes')}</span></Link></li>
                {user?.role === 'admin' && (
                  <li><Link href="/admin"><span className="hover:text-primary transition-colors cursor-pointer">{language === 'pt' ? 'Painel Admin' : 'Admin Panel'}</span></Link></li>
                )}
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Zeyryth'Studio. {language === 'pt' ? 'Todos os direitos reservados.' : 'All rights reserved.'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
