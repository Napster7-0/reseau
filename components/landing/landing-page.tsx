"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  BarChart3, 
  Package, 
  Users, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';
import { LoginModal } from './login-modal';

export function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Package,
      title: "Gestion de Stock",
      description: "Suivi en temps réel de vos inventaires avec alertes automatiques et optimisation des stocks."
    },
    {
      icon: BarChart3,
      title: "Rapports Analytiques",
      description: "Tableaux de bord intuitifs avec métriques avancées pour prendre des décisions éclairées."
    },
    {
      icon: Users,
      title: "Gestion Clients",
      description: "CRM intégré pour gérer vos relations clients et optimiser vos ventes."
    },
    {
      icon: TrendingUp,
      title: "Croissance Business",
      description: "Outils d'analyse pour identifier les opportunités de croissance et optimiser vos performances."
    },
    {
      icon: Shield,
      title: "Sécurité Avancée",
      description: "Protection des données avec cryptage et contrôles d'accès multi-niveaux."
    },
    {
      icon: Zap,
      title: "Performance Optimale",
      description: "Interface rapide et réactive pour une productivité maximale de vos équipes."
    }
  ];

  const stats = [
    { number: "99.9%", label: "Disponibilité" },
    { number: "500+", label: "Entreprises" },
    { number: "2M+", label: "Transactions" },
    { number: "24/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              {/* <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-white" />
              </div> */}
              <div>
                <h1 className="text-xl font-bold text-gray-900">KSM</h1>
                <p className="text-xs text-gray-500">Commercial Operations</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Fonctionnalités
              </a>
              <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition-colors">
                Solutions
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors">
                Tarifs
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
              <Button 
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Se connecter
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  Fonctionnalités
                </a>
                <a href="#solutions" className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  Solutions
                </a>
                <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  Tarifs
                </a>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2">
                  Contact
                </a>
                <Button 
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white mx-3"
                >
                  Se connecter
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              Optimisez vos
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {" "}Opérations Commerciales
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              KSM vous offre une suite complète d'outils pour gérer efficacement vos stocks, 
              clients, ventes et analyses. Transformez votre entreprise avec notre solution tout-en-un.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setIsLoginOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
              >
                Commencer gratuitement
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
              >
                Voir la démo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-3xl sm:text-4xl font-bold text-blue-600">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Avancées
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les outils puissants qui vous aideront à développer votre business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Prêt à révolutionner votre entreprise ?
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Rejoignez des centaines d'entreprises qui font déjà confiance à KSM 
            pour optimiser leurs opérations commerciales.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => setIsLoginOpen(true)}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg font-semibold"
            >
              Démarrer maintenant
            </Button>
            <Button 
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg"
            >
              Contacter l'équipe
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">KSM</span>
              </div>
              <p className="text-gray-400 text-sm">
                Solution complète pour optimiser vos opérations commerciales.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Entreprise</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">À propos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carrières</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Presse</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 KSM. Tous droits réservés.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
}
