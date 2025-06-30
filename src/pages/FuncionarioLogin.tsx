
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft, Pizza } from 'lucide-react';
import { toast } from 'sonner';

const FuncionarioLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Nova senha para funcionários
      if (password === 'Talola3421') {
        localStorage.setItem('funcionario_authenticated', 'true');
        toast.success('Acesso liberado!', {
          description: 'Bem-vindo ao painel de funcionário'
        });
        navigate('/funcionario-dashboard');
      } else {
        toast.error('Senha incorreta!', {
          description: 'Verifique a senha e tente novamente'
        });
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto bg-black/80 backdrop-blur-xl border-white/20 shadow-2xl">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold shadow-lg">
              T
            </div>
            <Pizza className="h-8 w-8 text-orange-400" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl text-white font-bold">
            TALOLA PIZZA
          </CardTitle>
          <p className="text-lg text-orange-300 font-semibold">Painel de Funcionário</p>
          <p className="text-sm text-orange-200/80">Acesso restrito</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white font-medium">
                Senha de Acesso
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  className="pl-11 h-12 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-orange-400 focus:ring-orange-400/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Lock className="h-5 w-5" />
                  Acessar Painel
                </div>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-orange-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Site
            </Button>
          </div>

          {/* Informação da senha para desenvolvimento */}
          <div className="text-center text-xs text-orange-200/60 bg-white/5 rounded-lg p-3 border border-white/10">
            <p className="mb-1"><strong>Desenvolvimento:</strong></p>
            <p className="font-mono">Talola3421</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuncionarioLogin;
