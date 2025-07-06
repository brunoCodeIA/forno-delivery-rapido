import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, Package, BarChart3, Clock, MapPin, CheckCircle2, Edit, Eye, Trash2, Plus, ShoppingBag, Image, Upload } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data structure (empty by default)
const mockOrders: {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; quantity: number }[];
  total: number;
  status: string;
  address: string;
  orderTime: string;
}[] = [];

const mockProducts: {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
  stock: boolean;
  category: string;
  image?: string;
}[] = [];

const mockCategories: {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}[] = [];

const mockClients: {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
}[] = [];

const emojiList = ['🍕', '🍝', '🥐', '🥪', '🦐', '🥤', '🍔', '🌮', '🥗', '🍰', '🧊', '🥟', '🍖', '🍗', '🥩', '🌭', '🥓', '🍳', '🧀', '🥬'];

const mockStaff: {
  id: number;
  name: string;
  role: string;
  email: string;
  active: boolean;
}[] = [];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [storeOpen, setStoreOpen] = useState(true);
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(mockProducts);
  const [staff, setStaff] = useState(mockStaff);
  const [categories, setCategories] = useState(mockCategories);
  const [clients, setClients] = useState(mockClients);
  const [operatingHours, setOperatingHours] = useState({
    open: '18:00',
    close: '23:00'
  });
  
  // Função para limpar dados de pedidos e valores
  const clearOrdersAndValues = () => {
    // Limpa os pedidos do estado
    setOrders([]);
    
    // Limpa os dados de pedidos e valores do localStorage
    localStorage.removeItem('currentOrder');
    localStorage.removeItem('cart');
    localStorage.removeItem('favorites');
    
    // Exibe mensagem de sucesso
    toast({
      title: "Dados limpos",
      description: "Informações de pedidos e valores foram removidas."
    });
  };
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingStaff, setEditingStaff] = useState<any>(null);
  const [newCategory, setNewCategory] = useState({ name: '', icon: '🍕' });
  const [accompaniments, setAccompaniments] = useState<{
  id: number;
  name: string;
  price: number;
  category: string;
  active: boolean;
  image?: string;
}[]>([]);
  const [newAccompaniment, setNewAccompaniment] = useState({ name: '', price: 0, category: '', active: true, image: '', description: '' });
  const [editingAccompaniment, setEditingAccompaniment] = useState<any>(null);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: '', active: true, stock: true, image: '' });
  const [newStaff, setNewStaff] = useState({ name: '', email: '', role: 'assistant' });
  const [viewingClient, setViewingClient] = useState<any>(null);

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const toggleProductActive = (productId: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, active: !product.active } : product
    ));
  };

  const toggleProductStock = (productId: number) => {
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, stock: !product.stock } : product
    ));
  };

  const toggleStaffActive = (staffId: number) => {
    setStaff(prev => prev.map(member =>
      member.id === staffId ? { ...member, active: !member.active } : member
    ));
  };

  const removeDelivery = (orderId: string) => {
    setOrders(prev => prev.filter(order => order.id !== orderId));
  };

  const addCategory = () => {
    if (newCategory.name.trim()) {
      const newId = Math.max(...categories.map(c => c.id)) + 1;
      setCategories(prev => [...prev, { ...newCategory, id: newId, active: true }]);
      setNewCategory({ name: '', icon: '🍕' });
    }
  };

  const removeCategory = (categoryId: number) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const addAccompaniment = () => {
    if (newAccompaniment.name.trim() && newAccompaniment.category) {
      const newId = Math.max(...accompaniments.map(a => a.id), 0) + 1;
      setAccompaniments(prev => [...prev, { ...newAccompaniment, id: newId }]);
      setNewAccompaniment({ name: '', price: 0, category: '', active: true, image: '', description: '' });
    }
  };

  const editAccompaniment = (accompaniment: any) => {
    if (accompaniment.name.trim() && accompaniment.category) {
      setAccompaniments(prev => prev.map(a => a.id === accompaniment.id ? accompaniment : a));
      setEditingAccompaniment(null);
    }
  };

  const removeAccompaniment = (accompanimentId: number) => {
    setAccompaniments(prev => prev.filter(a => a.id !== accompanimentId));
  };

  const toggleAccompanimentActive = (accompanimentId: number) => {
    setAccompaniments(prev => prev.map(accompaniment =>
      accompaniment.id === accompanimentId ? { ...accompaniment, active: !accompaniment.active } : accompaniment
    ));
  };

  // Função para converter imagem para base64
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Função para lidar com o upload de imagem do produto
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertToBase64(file);
        setNewProduct(prev => ({ ...prev, image: base64 }));
      } catch (error) {
        console.error('Erro ao converter imagem:', error);
        toast({
          title: "Erro",
          description: "Não foi possível processar a imagem.",
          variant: "destructive"
        });
      }
    }
  };

  // Função para lidar com o upload de imagem do acompanhamento
  const handleAccompanimentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await convertToBase64(file);
        setNewAccompaniment(prev => ({ ...prev, image: base64 }));
      } catch (error) {
        console.error('Erro ao converter imagem:', error);
        toast({
          title: "Erro",
          description: "Não foi possível processar a imagem.",
          variant: "destructive"
        });
      }
    }
  };

  const addProduct = () => {
    if (newProduct.name.trim()) {
      const newId = Math.max(...products.map(p => p.id), 0) + 1;
      setProducts(prev => [...prev, { ...newProduct, id: newId }]);
      setNewProduct({ name: '', description: '', price: 0, category: '', active: true, stock: true, image: '' });
    }
  };

  const editProduct = (product: any) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    setEditingProduct(null);
  };

  const addStaff = () => {
    if (newStaff.name.trim() && newStaff.email.trim()) {
      const newId = Math.max(...staff.map(s => s.id)) + 1;
      setStaff(prev => [...prev, { ...newStaff, id: newId, active: true }]);
      setNewStaff({ name: '', email: '', role: 'assistant' });
    }
  };

  const editStaff = (member: any) => {
    setStaff(prev => prev.map(s => s.id === member.id ? member : s));
    setEditingStaff(null);
  };

  const removeStaff = (staffId: number) => {
    setStaff(prev => prev.filter(s => s.id !== staffId));
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      received: { label: 'Recebido', variant: 'secondary' as const },
      production: { label: 'Produção', variant: 'default' as const },
      ready: { label: 'Pronto', variant: 'outline' as const },
      delivery: { label: 'Entrega', variant: 'destructive' as const },
      delivered: { label: 'Entregue', variant: 'outline' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Painel Administrativo</h1>
            <p className="text-muted-foreground">La Fornata Delivery</p>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center space-x-2">
              <Switch
                id="store-status"
                checked={storeOpen}
                onCheckedChange={setStoreOpen}
              />
              <Label htmlFor="store-status">
                Loja {storeOpen ? 'Aberta' : 'Fechada'}
              </Label>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="destructive" onClick={clearOrdersAndValues} className="flex-1 md:flex-none">
                Limpar Pedidos
              </Button>
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1 md:flex-none">
                Voltar ao Início
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          {isMobile ? (
            <div className="overflow-x-auto pb-2">
              <TabsList className="flex w-max space-x-2">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="orders" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Pedidos
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Produtos
                </TabsTrigger>
                <TabsTrigger value="categories" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Categorias
                </TabsTrigger>
                <TabsTrigger value="accompaniments" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Acompanhamentos
                </TabsTrigger>
                <TabsTrigger value="clients" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="delivery" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Entregas
                </TabsTrigger>
                <TabsTrigger value="staff" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Colaboradores
                </TabsTrigger>
              </TabsList>
            </div>
          ) : (
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Produtos
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Categorias
              </TabsTrigger>
              <TabsTrigger value="accompaniments" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Acompanhamentos
              </TabsTrigger>
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="delivery" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Entregas
              </TabsTrigger>
              <TabsTrigger value="staff" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Colaboradores
              </TabsTrigger>
            </TabsList>
          )}

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">0</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">R$ 0,00</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">0</div>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Para Entrega</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-earth">0</div>
                </CardContent>
              </Card>
            </div>

            {/* Store Settings */}
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Configurações da Loja</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="open-time">Abertura</Label>
                    <Input
                      id="open-time"
                      type="time"
                      value={operatingHours.open}
                      onChange={(e) => setOperatingHours(prev => ({ ...prev, open: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="close-time">Fechamento</Label>
                    <Input
                      id="close-time"
                      type="time"
                      value={operatingHours.close}
                      onChange={(e) => setOperatingHours(prev => ({ ...prev, close: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

       {/* Orders Tab */}
<TabsContent value="orders">
  <Card className="shadow-warm">
    <CardHeader>
      <CardTitle>Pedidos em Produção</CardTitle>
      <CardDescription>Gerencie o status dos pedidos</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead className="hidden md:table-cell">Itens</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                  Nenhum pedido encontrado
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {order.items.map((item, idx) => (
                      <div key={idx}>
                        {item.quantity}x {item.name}
                      </div>
                    ))}
                  </TableCell>
                  <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {order.status === 'received' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'production')}
                        >
                          Iniciar Produção
                        </Button>
                      )}
                      {order.status === 'production' && (
                        <Button 
                          size="sm" 
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                        >
                          Pronto
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Gerenciar Produtos</CardTitle>
                <CardDescription>Controle disponibilidade e estoque</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="fire" className="w-full sm:w-auto">
                        <Plus className="h-4 w-4 mr-2" />
                        Adicionar Produto
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[95vw] sm:max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Produto</DialogTitle>
                        <DialogDescription>Preencha os dados do novo produto</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="product-name">Nome</Label>
                          <Input
                            id="product-name"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-description">Descrição</Label>
                          <Textarea
                            id="product-description"
                            value={newProduct.description}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-price">Preço</Label>
                          <Input
                            id="product-price"
                            type="number"
                            step="0.01"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="product-category">Categoria</Label>
                          <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.icon} {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="product-image">Imagem do Produto</Label>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="flex-1 w-full">
                              <Input
                                id="product-image"
                                type="file"
                                accept="image/*"
                                onChange={handleProductImageUpload}
                                className="cursor-pointer"
                              />
                            </div>
                            {newProduct.image && (
                              <div className="w-16 h-16 rounded-md overflow-hidden border border-input">
                                <img 
                                  src={newProduct.image} 
                                  alt="Preview" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Adicione uma imagem para identificação do produto</p>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={addProduct}>Adicionar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

               <div className="overflow-x-auto">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Produto</TableHead>
        <TableHead className="hidden md:table-cell">Categoria</TableHead>
        <TableHead>Preço</TableHead>
        <TableHead>Ativo</TableHead>
        <TableHead className="hidden md:table-cell">Em Estoque</TableHead>
        <TableHead>Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {products.length > 0 ? (
        products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground truncate max-w-[150px]">{product.description}</p>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">{product.category}</TableCell>
            <TableCell>R$ {product.price.toFixed(2)}</TableCell>
            <TableCell>
              <Switch
                checked={product.active}
                onCheckedChange={() => toggleProductActive(product.id)}
              />
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Switch
                checked={product.stock}
                onCheckedChange={() => toggleProductStock(product.id)}
              />
            </TableCell>
            <TableCell>
              <div className="flex flex-col sm:flex-row gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Produto</DialogTitle>
                    </DialogHeader>
                    {editingProduct && (
                      <div className="space-y-4">
                        <div>
                          <Label>Nome</Label>
                          <Input
                            value={editingProduct.name}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Descrição</Label>
                          <Textarea
                            value={editingProduct.description}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                          />
                        </div>
                        <div>
                          <Label>Preço</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          />
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button onClick={() => editProduct(editingProduct)}>Salvar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
            Nenhum produto encontrado
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="shadow-warm">
              <CardHeader>
                <CardTitle>Gerenciar Categorias</CardTitle>
                <CardDescription>Adicione ou remova categorias de produtos</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Categories content here */}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accompaniments Tab */}
          <TabsContent value="accompaniments">
  <Card className="shadow-warm">
    <CardHeader>
      <CardTitle>Gerenciar Acompanhamentos</CardTitle>
      <CardDescription>Adicione, edite ou remova acompanhamentos do menu</CardDescription>
    </CardHeader>
    <CardContent>
    <div className="space-y-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="fire">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Acompanhamento
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Adicionar Acompanhamento</DialogTitle>
                      <DialogDescription>Preencha os dados do novo acompanhamento</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="accompaniment-name">Nome</Label>
                        <Input
                          id="accompaniment-name"
                          value={newAccompaniment.name}
                          onChange={(e) => setNewAccompaniment(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accompaniment-price">Preço</Label>
                        <Input
                          id="accompaniment-price"
                          type="number"
                          step="0.01"
                          value={newAccompaniment.price}
                          onChange={(e) => setNewAccompaniment(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="accompaniment-category">Categoria</Label>
                        <Select value={newAccompaniment.category} onValueChange={(value) => setNewAccompaniment(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="bebidas">Bebidas</SelectItem>
                            <SelectItem value="molhos">Molhos</SelectItem>
                            <SelectItem value="extras">Extras</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={addAccompaniment}>Adicionar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Ativo</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accompaniments.length > 0 ? (
                        accompaniments.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.name}</TableCell>
                            <TableCell>{item.category}</TableCell>
                            <TableCell>R$ {item.price.toFixed(2)}</TableCell>
                            <TableCell>
                              <Switch
                                checked={item.active}
                                onCheckedChange={() => toggleAccompanimentActive(item.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingAccompaniment(item)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Editar Acompanhamento</DialogTitle>
                                    </DialogHeader>
                                    {editingAccompaniment && (
                                      <div className="space-y-4">
                                        <div>
                                          <Label>Nome</Label>
                                          <Input
                                            value={editingAccompaniment.name}
                                            onChange={(e) =>
                                              setEditingAccompaniment(prev => ({ ...prev, name: e.target.value }))
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Label>Preço</Label>
                                          <Input
                                            type="number"
                                            step="0.01"
                                            value={editingAccompaniment.price}
                                            onChange={(e) =>
                                              setEditingAccompaniment(prev => ({ ...prev, price: parseFloat(e.target.value) }))
                                            }
                                          />
                                        </div>
                                        <div>
                                          <Label>Categoria</Label>
                                          <Select
                                            value={editingAccompaniment.category}
                                            onValueChange={(value) =>
                                              setEditingAccompaniment(prev => ({ ...prev, category: value }))
                                            }
                                          >
                                            <SelectTrigger>
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="bebidas">Bebidas</SelectItem>
                                              <SelectItem value="molhos">Molhos</SelectItem>
                                              <SelectItem value="extras">Extras</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button onClick={() => editAccompaniment(editingAccompaniment)}>Salvar</Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Remover Acompanhamento</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Tem certeza que deseja remover este acompanhamento? Esta ação não pode ser desfeita.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => removeAccompaniment(item.id)}>
                                        Remover
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6">
                            Nenhum acompanhamento encontrado
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
      </CardContent>
    </Card>
  </TabsContent>

  {/* Clients Tab */}
  <TabsContent value="clients" className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Clientes</CardTitle>
        <CardDescription>Gerencie os clientes cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="hidden md:table-cell">Telefone</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                    <TableCell className="hidden md:table-cell truncate max-w-[200px]">{client.address}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Detalhes do Cliente</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-medium">Informações Pessoais</h3>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Nome</p>
                                  <p>{client.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Email</p>
                                  <p>{client.email}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Telefone</p>
                                  <p>{client.phone}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Endereço</p>
                                  <p>{client.address}</p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-medium">Histórico</h3>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                  <p className="text-sm text-muted-foreground">Total de Pedidos</p>
                                  <p>{client.orders}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Total Gasto</p>
                                  <p>R$ {client.totalSpent.toFixed(2)}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Último Pedido</p>
                                  <p>{client.lastOrder}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Nenhum cliente encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  {/* Delivery Tab */}
  <TabsContent value="delivery" className="space-y-4">
    <Card>
      <CardHeader>
        <CardTitle>Entregas</CardTitle>
        <CardDescription>Gerencie as entregas em andamento</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead className="hidden md:table-cell">Endereço</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.filter(order => ['ready', 'delivery', 'delivered'].includes(order.status)).length > 0 ? (
                orders
                  .filter(order => ['ready', 'delivery', 'delivered'].includes(order.status))
                  .map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.customer}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[150px]">{order.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{order.address}</TableCell>
                      <TableCell>R$ {order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-2">
                          {order.status === 'ready' && (
                            <Button
                              size="sm"
                              className="w-full sm:w-auto"
                              onClick={() => updateOrderStatus(order.id, 'delivery')}
                            >
                              Saiu para Entrega
                            </Button>
                          )}
                          {order.status === 'delivery' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                            >
                              Marcar Entregue
                            </Button>
                          )}
                          {order.status === 'delivered' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remover Entrega</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Tem certeza que deseja remover este pedido do histórico de entregas? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => removeDelivery(order.id)}>
                                    Remover
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    Nenhuma entrega encontrada
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  </TabsContent>

  {/* Staff Tab */}
  <TabsContent value="staff">
  <Card className="shadow-warm">
    <CardHeader>
      <CardTitle>Gerenciar Colaboradores</CardTitle>
      <CardDescription>Controle de acesso e permissões</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="fire">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Colaborador</DialogTitle>
              <DialogDescription>Preencha os dados do novo colaborador</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="staff-name">Nome</Label>
                <Input
                  id="staff-name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="staff-email">Email</Label>
                <Input
                  id="staff-email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="staff-role">Função</Label>
                <Select
                  value={newStaff.role}
                  onValueChange={(value) => setNewStaff(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cook">Cozinheiro</SelectItem>
                    <SelectItem value="delivery">Entregador</SelectItem>
                    <SelectItem value="assistant">Assistente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={addStaff}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Função</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staff.length > 0 ? (
              staff.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {member.role === 'cook'
                        ? 'Cozinheiro'
                        : member.role === 'delivery'
                        ? 'Entregador'
                        : 'Assistente'}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>
                    <Switch
                      checked={member.active}
                      onCheckedChange={() => toggleStaffActive(member.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingStaff(member)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Colaborador</DialogTitle>
                          </DialogHeader>
                          {editingStaff && (
                            <div className="space-y-4">
                              <div>
                                <Label>Nome</Label>
                                <Input
                                  value={editingStaff.name}
                                  onChange={(e) =>
                                    setEditingStaff(prev => ({ ...prev, name: e.target.value }))
                                  }
                                />
                              </div>
                              <div>
                                <Label>Email</Label>
                                <Input
                                  value={editingStaff.email}
                                  onChange={(e) =>
                                    setEditingStaff(prev => ({ ...prev, email: e.target.value }))
                                  }
                                />
                              </div>
                              <div>
                                <Label>Função</Label>
                                <Select
                                  value={editingStaff.role}
                                  onValueChange={(value) =>
                                    setEditingStaff(prev => ({ ...prev, role: value }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="cook">Cozinheiro</SelectItem>
                                    <SelectItem value="delivery">Entregador</SelectItem>
                                    <SelectItem value="assistant">Assistente</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                          <DialogFooter>
                            <Button onClick={() => editStaff(editingStaff)}>Salvar</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Colaborador</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja remover {member.name}? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => removeStaff(member.id)}>
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Nenhum colaborador encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</TabsContent>
 </Tabs>
      </div>
    </div>
  );
};
export default AdminDashboard;