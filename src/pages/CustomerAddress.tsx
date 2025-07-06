import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const CustomerAddress = () => {
  const [addressData, setAddressData] = useState({
    neighborhood: '',
    street: '',
    number: '',
    complement: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if customer data exists
    const customerData = localStorage.getItem('customerData');
    if (!customerData) {
      toast({
        title: "Dados não encontrados",
        description: "Por favor, informe seus dados primeiro.",
        variant: "destructive"
      });
      navigate('/customer');
      return;
    }
  }, [navigate, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressData.neighborhood || !addressData.street || !addressData.number) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha bairro, rua e número.",
        variant: "destructive"
      });
      return;
    }

    // Store address data
    localStorage.setItem('customerAddress', JSON.stringify(addressData));
    
    toast({
      title: "Endereço salvo!",
      description: "Agora você pode fazer seu pedido.",
    });
    
    // Navigate to catalog
    navigate('/customer/catalog');
  };

  return (
    <div className="min-h-screen bg-gradient-warm flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-warm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Seu Endereço</CardTitle>
          <CardDescription>
            Informe o endereço completo para entrega
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                type="text"
                placeholder="Digite o bairro"
                value={addressData.neighborhood}
                onChange={(e) => setAddressData(prev => ({ ...prev, neighborhood: e.target.value }))}
                className="border-primary/30 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                type="text"
                placeholder="Digite o nome da rua"
                value={addressData.street}
                onChange={(e) => setAddressData(prev => ({ ...prev, street: e.target.value }))}
                className="border-primary/30 focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  type="text"
                  placeholder="123"
                  value={addressData.number}
                  onChange={(e) => setAddressData(prev => ({ ...prev, number: e.target.value }))}
                  className="border-primary/30 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  type="text"
                  placeholder="Apto, casa..."
                  value={addressData.complement}
                  onChange={(e) => setAddressData(prev => ({ ...prev, complement: e.target.value }))}
                  className="border-primary/30 focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/customer')}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button type="submit" variant="fire" className="flex-1">
                Continuar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerAddress;