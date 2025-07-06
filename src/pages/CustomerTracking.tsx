import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, ChefHat, Truck, Home } from 'lucide-react';

const orderStatuses = [
  { key: 'received', label: 'Pedido recebido', icon: CheckCircle2 },
  { key: 'production', label: 'Em produção', icon: ChefHat },
  { key: 'ready', label: 'Pronto para entrega', icon: Clock },
  { key: 'delivery', label: 'Saiu para entrega', icon: Truck },
  { key: 'delivered', label: 'Pedido entregue', icon: Home }
];

const CustomerTracking = () => {
  const [orderData, setOrderData] = useState<any>(null);
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = localStorage.getItem('currentOrder');
    
    if (!storedOrder) {
      navigate('/customer');
      return;
    }

    const parsedOrder = JSON.parse(storedOrder);
    setOrderData(parsedOrder);

    // Set the status based on the stored order data
    const orderStatus = parsedOrder.status || 'received';
    const statusIndex = orderStatuses.findIndex(status => status.key === orderStatus);
    setCurrentStatusIndex(statusIndex >= 0 ? statusIndex : 0);
  }, [navigate]);

  if (!orderData) {
    return <div>Carregando...</div>;
  }

  const progress = ((currentStatusIndex + 1) / orderStatuses.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Acompanhar Pedido</h1>
          <p className="text-muted-foreground">Pedido #{orderData.number}</p>
        </div>

        {/* Progress */}
        <Card className="shadow-warm mb-6">
          <CardHeader>
            <CardTitle>Status do Pedido</CardTitle>
            <CardDescription>
              {orderStatuses[currentStatusIndex].label}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Progress value={progress} className="w-full" />
            
            <div className="space-y-4">
              {orderStatuses.map((status, index) => {
                const IconComponent = status.icon;
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                
                return (
                  <div 
                    key={status.key}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      isCompleted ? 'bg-primary/10' : 'bg-muted/50'
                    }`}
                  >
                    <IconComponent 
                      className={`h-6 w-6 ${
                        isCompleted ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${
                        isCompleted ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {status.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-muted-foreground">
                          Status atual
                        </p>
                      )}
                    </div>
                    {isCompleted && (
                      <Badge variant="secondary">✓</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card className="shadow-warm mb-6">
          <CardHeader>
            <CardTitle>Detalhes do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderData.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.image}</span>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantidade: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium">R$ {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center font-bold text-lg">
                <p>Total:</p>
                <p className="text-primary">R$ {orderData.total.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Info */}
        <Card className="shadow-warm mb-6">
          <CardHeader>
            <CardTitle>Endereço de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nome:</strong> {orderData.customer.fullName}</p>
            <p><strong>Telefone:</strong> {orderData.customer.phone}</p>
            <p><strong>Endereço:</strong> {orderData.customer.address.street}, {orderData.customer.address.number}</p>
            {orderData.customer.address.complement && <p><strong>Complemento:</strong> {orderData.customer.address.complement}</p>}
            <p><strong>Bairro:</strong> {orderData.customer.address.neighborhood}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/customer/catalog')}
            className="w-full"
          >
            Fazer Novo Pedido
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="w-full"
          >
            Voltar ao Início
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTracking;