"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building2,
  Chrome,
  Facebook,
  Github
} from 'lucide-react';
import { useForm } from 'react-hook-form';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
  confirmPassword: string;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  const loginForm = useForm<LoginFormData>();
  const registerForm = useForm<RegisterFormData>();

  const handleLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulation d'une connexion
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici vous pourriez ajouter votre logique d'authentification
      console.log('Login:', data);
      
      // Redirection vers le dashboard
      router.push('/dashboard');
      onClose();
    } catch (error) {
      console.error('Erreur de connexion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Simulation d'une inscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ici vous pourriez ajouter votre logique d'inscription
      console.log('Register:', data);
      
      // Basculer vers l'onglet connexion après inscription
      setActiveTab('login');
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Connexion avec ${provider}`);
    // Ici vous pourriez implémenter la connexion sociale
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              KSM
            </DialogTitle>
          </div>
          <p className="text-sm text-gray-600 text-center">
            Accédez à votre espace de gestion commerciale
          </p>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>

          {/* Onglet Connexion */}
          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    {...loginForm.register('email', { 
                      required: 'Email requis',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email invalide'
                      }
                    })}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Votre mot de passe"
                    className="pl-10 pr-10"
                    {...loginForm.register('password', { 
                      required: 'Mot de passe requis',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 caractères'
                      }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  <span>Se souvenir de moi</span>
                </label>
                <Button variant="link" className="text-sm p-0 h-auto">
                  Mot de passe oublié ?
                </Button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialLogin('Google')}
                className="w-full"
              >
                <Chrome className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialLogin('Facebook')}
                className="w-full"
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSocialLogin('GitHub')}
                className="w-full"
              >
                <Github className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          {/* Onglet Inscription */}
          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      placeholder="Jean"
                      className="pl-10"
                      {...registerForm.register('firstName', { required: 'Prénom requis' })}
                    />
                  </div>
                  {registerForm.formState.errors.firstName && (
                    <p className="text-sm text-red-600">{registerForm.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      placeholder="Dupont"
                      className="pl-10"
                      {...registerForm.register('lastName', { required: 'Nom requis' })}
                    />
                  </div>
                  {registerForm.formState.errors.lastName && (
                    <p className="text-sm text-red-600">{registerForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="registerEmail"
                    type="email"
                    placeholder="votre@email.com"
                    className="pl-10"
                    {...registerForm.register('email', { 
                      required: 'Email requis',
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: 'Email invalide'
                      }
                    })}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    placeholder="Nom de votre entreprise"
                    className="pl-10"
                    {...registerForm.register('company', { required: 'Entreprise requise' })}
                  />
                </div>
                {registerForm.formState.errors.company && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.company.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="registerPassword">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="registerPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 6 caractères"
                    className="pl-10 pr-10"
                    {...registerForm.register('password', { 
                      required: 'Mot de passe requis',
                      minLength: {
                        value: 6,
                        message: 'Minimum 6 caractères'
                      }
                    })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Répétez votre mot de passe"
                    className="pl-10"
                    {...registerForm.register('confirmPassword', { 
                      required: 'Confirmation requise',
                      validate: value => 
                        value === registerForm.watch('password') || 'Les mots de passe ne correspondent pas'
                    })}
                  />
                </div>
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start space-x-2">
                <input type="checkbox" className="mt-1 rounded" required />
                <label className="text-sm text-gray-600">
                  J&apos;accepte les{" "}
                  <Button variant="link" className="text-sm p-0 h-auto">
                    conditions d&apos;utilisation
                  </Button>
                  {" "}et la{" "}
                  <Button variant="link" className="text-sm p-0 h-auto">
                    politique de confidentialité
                  </Button>
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm text-gray-500 mt-6">
          <p>
            Vous avez des questions ?{" "}
            <Button variant="link" className="text-sm p-0 h-auto">
              Contactez notre support
            </Button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
