import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const StaffAccess = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Store staff credentials in localStorage
    localStorage.setItem('staffCredentials', JSON.stringify(credentials));
    
    toast({
      title: "Login realizado",
      description: "Bem-vindo à área do colaborador."
    });
    
    navigate('/staff/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-secondary">👨‍🍳 Área do Colaborador</CardTitle>
          <CardDescription>
            Acesso para funcionários da La Fornata
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="colaborador@lafornata.com" 
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
            </div>
            
            <Button 
              variant="fire" 
              size="lg"
              type="submit"
              className="w-full mt-2"
            >
              Acessar Dashboard
            </Button>
          </form>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAccess;