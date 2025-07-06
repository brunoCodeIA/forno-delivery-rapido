import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CustomerAccess = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.whatsapp) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive"
      });
      return;
    }

    // Store customer data in localStorage for now
    localStorage.setItem('customerData', JSON.stringify(formData));
    
    toast({
      title: "Dados salvos!",
      description: "Agora vamos cadastrar seu endereço.",
    });
    
    // Navigate to address page
    navigate('/customer/address');
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Acesso do Cliente</CardTitle>
          <CardDescription>
            Informe seus dados para fazer seu pedido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome completo</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Digite seu nome completo"
                value={formData.fullName}
                onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                className="border-primary/30 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <Button type="submit" variant="fire" size="lg" className="w-full">
              Continuar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAccess;