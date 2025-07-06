import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ChefHat, Truck, Package, MapPin } from 'lucide-react';

// Mock data structure (empty by default)
const mockOrders: {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; quantity: number; notes?: string }[];
  total: number;
  status: string;
  address: string;
  orderTime: string;
  estimatedTime: string;
}[] = [];

const StaffDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [staffRole] = useState('cook'); // This would come from authentication
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Função para limpar dados de pedidos
  const clearOrders = () => {
    // Limpa os pedidos do estado
    setOrders([]);
    
    // Limpa os dados de pedidos e valores do localStorage
    localStorage.removeItem('currentOrder');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    
    // Exibe mensagem de sucesso
    toast({
      title: "Dados limpos",
      description: "Informações de pedidos foram removidas."
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      received: { label: 'Recebido', variant: 'secondary' as const },
      production: { label: 'Produção', variant: 'default' as const },
      ready: { label: 'Pronto', variant: 'outline' as const },
      delivery: { label: 'Saiu p/ Entrega', variant: 'destructive' as const },
      delivered: { label: 'Entregue', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const cookOrders = orders.filter(order => 
    order.status === 'received' || order.status === 'production'
  );

  const deliveryOrders = orders.filter(order => 
    order.status === 'ready' || order.status === 'delivery'
  );

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary">Área do Colaborador</h1>
            <p className="text-muted-foreground">La Fornata Delivery</p>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={clearOrders}>
              Limpar Pedidos
            </Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Sair
            </Button>
          </div>
        </div>

        <Tabs defaultValue="kitchen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="kitchen" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Cozinha
            </TabsTrigger>
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Entregas
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Todos os Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Kitchen Tab */}
          <TabsContent value="kitchen">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Pedidos para Produção
                </CardTitle>
                <CardDescription>
                  Gerencie os pedidos em produção na cozinha
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cookOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum pedido para produção no momento
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cookOrders.map((order) => (
                      <Card key={order.id} className="border border-primary/20">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                              <CardDescription>
                                {order.customer} • {order.phone} • {order.orderTime}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold text-primary mt-1">
                                R$ {order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Itens do Pedido:</h4>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center p-2 bg-muted/50 rounded">
                                <div>
                                  <span className="font-medium">{item.quantity}x {item.name}</span>
                                  {item.notes && (
                                    <p className="text-sm text-muted-foreground">Obs: {item.notes}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-2">
                            {order.status === 'received' && (
                              <Button 
                                onClick={() => updateOrderStatus(order.id, 'production')}
                                className="flex-1"
                              >
                                Iniciar Produção
                              </Button>
                            )}
                            {order.status === 'production' && (
                              <Button 
                                variant="fire"
                                onClick={() => updateOrderStatus(order.id, 'ready')}
                                className="flex-1"
                              >
                                Marcar como Pronto
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Delivery Tab */}
          <TabsContent value="delivery">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Controle de Entregas
                </CardTitle>
                <CardDescription>
                  Pedidos prontos e em rota de entrega
                </CardDescription>
              </CardHeader>
              <CardContent>
                {deliveryOrders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum pedido para entrega no momento
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliveryOrders.map((order) => (
                      <Card key={order.id} className="border border-secondary/20">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                              <CardDescription>
                                {order.customer} • {order.phone} • {order.orderTime}
                              </CardDescription>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <p className="text-lg font-bold text-primary mt-1">
                                R$ {order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                            <div>
                              <p className="font-medium">Endereço de Entrega:</p>
                              <p className="text-muted-foreground">{order.address}</p>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-2">Itens:</h4>
                            {order.items.map((item, idx) => (
                              <div key={idx} className="text-sm">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2 pt-2">
                            {order.status === 'ready' && (
                              <Button 
                                variant="secondary"
                                onClick={() => updateOrderStatus(order.id, 'delivery')}
                                className="flex-1"
                              >
                                Pegar para Entrega
                              </Button>
                            )}
                            {order.status === 'delivery' && (
                              <Button 
                                variant="fire"
                                onClick={() => updateOrderStatus(order.id, 'delivered')}
                                className="flex-1"
                              >
                                Marcar como Entregue
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* All Orders Tab */}
          <TabsContent value="all">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Todos os Pedidos</CardTitle>
                <CardDescription>Visão geral de todos os pedidos</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pedido</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Horário</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Endereço</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.customer}</p>
                            <p className="text-sm text-muted-foreground">{order.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>{order.orderTime}</TableCell>
                        <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell className="max-w-xs truncate">{order.address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StaffDashboard;