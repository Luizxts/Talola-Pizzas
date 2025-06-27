
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const FuncionarioLogin = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Senha única para funcionários acessarem
      if (password === 'talola2024') {
        localStorage.setItem('funcionario_authenticated', 'true');
        toast.success('Acesso liberado!');
        navigate('/funcionario-dashboard');
      } else {
        toast.error('Senha incorreta!');
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-600 to-pink-700 flex items-center justify-center p-4">
      <Card className="max-w-md mx-auto bg-black/60 backdrop-blur-sm border-white/20">
        <CardHeader className="text-center">
          <div className="bg-red-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-3xl font-bold mx-auto mb-4">
            T
          </div>
          <CardTitle className="text-3xl text-white">
            ÁREA FUNCIONÁRIOS
          </CardTitle>
          <p className="text-orange-200">Acesso restrito</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-white">Senha de Acesso</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite a senha"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-3"
              disabled={loading}
            >
              {loading ? 'Verificando...' : 'Acessar'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-orange-300 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Site
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-orange-200 bg-white/10 rounded-lg p-3">
            <p><strong>Senha:</strong> talola2024</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FuncionarioLogin;
