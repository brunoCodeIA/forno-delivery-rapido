import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

// Type definition for products
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating?: number;
  category?: string;
};

const CustomerCheckout = () => {
  const [cart, setCart] = useState<{id: number, quantity: number, notes?: string}[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [showPix, setShowPix] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [accompaniments, setAccompaniments] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    const storedCustomerData = localStorage.getItem('customerData');
    const storedAddress = localStorage.getItem('customerAddress');
    
    if (!storedCart || !storedCustomerData || !storedAddress) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, complete seu pedido primeiro.",
        variant: "destructive"
      });
      navigate('/customer/catalog');
      return;
    }

    setCart(JSON.parse(storedCart));
    setCustomerData({
      ...JSON.parse(storedCustomerData),
      address: JSON.parse(storedAddress)
    });

    // Generate order number
    const orderNum = 'LF' + Date.now().toString().slice(-6);
    setOrderNumber(orderNum);
    
    // Load products from localStorage if available
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }
    
    // Load accompaniments from localStorage if available
    const storedAccompaniments = localStorage.getItem('accompaniments');
    if (storedAccompaniments) {
      setAccompaniments(JSON.parse(storedAccompaniments));
    }
  }, [navigate, toast]);

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id) || accompaniments.find(p => p.id === item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
    const delivery = 5.00; // Taxa de entrega fixa
    return subtotal + delivery;
  };

  const getCartItems = () => {
    return cart.map(item => {
      const product = products.find(p => p.id === item.id) || accompaniments.find(p => p.id === item.id);
      return { ...product, quantity: item.quantity, notes: item.notes };
    }).filter(Boolean);
  };

  const generateWhatsAppMessage = () => {
    const items = getCartItems();
    const itemsText = items.map(item => 
      `${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}`
    ).join('\n');
    
    const message = `🍕 *PEDIDO LA FORNATA* 🍕
    
*Número do Pedido:* ${orderNumber}
*Nome:* ${customerData.fullName}
*Telefone:* ${customerData.phone}

*ITENS:*
${itemsText}

*Endereço de Entrega:*
${customerData.address.street}, ${customerData.address.number}
${customerData.address.complement ? `${customerData.address.complement}\n` : ''}${customerData.address.neighborhood}
${customerData.address.city}

*TOTAL: R$ ${getTotalPrice().toFixed(2)}*

Pagamento confirmado via PIX ✅`;

    return encodeURIComponent(message);
  };

  const handlePixPayment = () => {
    setShowPix(true);
  };

  const handleWhatsAppRedirect = () => {
    const message = generateWhatsAppMessage();
    const whatsappUrl = `https://wa.me/5511999999999?text=${message}`;
    
    // Store order for tracking
    const orderData = {
      number: orderNumber,
      items: getCartItems(),
      total: getTotalPrice(),
      customer: customerData,
      status: 'Pedido recebido',
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('currentOrder', JSON.stringify(orderData));
    localStorage.removeItem('cart'); // Clear cart
    
    window.open(whatsappUrl, '_blank');
    navigate('/customer/tracking');
  };

  if (!customerData) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Finalizar Pedido</h1>
          <p className="text-muted-foreground">Pedido #{orderNumber}</p>
        </div>

        {/* Order Summary */}
        <Card className="shadow-warm mb-6">
          <CardHeader>
            <CardTitle>Resumo do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getCartItems().map((item, index) => (
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
            
            <Separator />
            
            <div className="flex justify-between items-center">
              <p>Subtotal:</p>
              <p>R$ {(getTotalPrice() - 5).toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center">
              <p>Taxa de entrega:</p>
              <p>R$ 5,00</p>
            </div>
            <div className="flex justify-between items-center font-bold text-lg">
              <p>Total:</p>
              <p className="text-primary">R$ {getTotalPrice().toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Info */}
        <Card className="shadow-warm mb-6">
          <CardHeader>
            <CardTitle>Dados de Entrega</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Nome:</strong> {customerData.fullName}</p>
            <p><strong>Telefone:</strong> {customerData.phone}</p>
            <p><strong>Endereço:</strong> {customerData.address.street}, {customerData.address.number}</p>
            {customerData.address.complement && <p><strong>Complemento:</strong> {customerData.address.complement}</p>}
            <p><strong>Bairro:</strong> {customerData.address.neighborhood}</p>
            <p><strong>Cidade:</strong> {customerData.address.city}</p>
          </CardContent>
        </Card>

        {/* Payment */}
        {!showPix ? (
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
              <CardDescription>Escolha a forma de pagamento</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant="fire" 
                size="lg" 
                className="w-full"
                onClick={handlePixPayment}
              >
                💳 Pagar via PIX
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-warm">
            <CardHeader>
              <CardTitle>Pagamento PIX</CardTitle>
              <CardDescription>Escaneie o QR Code ou use a chave PIX</CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="bg-muted p-8 rounded-lg">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-sm text-muted-foreground">QR Code aqui</p>
              </div>
              
              <div className="space-y-2">
                <p><strong>Chave PIX:</strong></p>
                <Badge variant="secondary" className="text-sm p-2">
                  lilia@lafornata.com.br
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p><strong>Valor:</strong> R$ {getTotalPrice().toFixed(2)}</p>
                <p><strong>Favorecido:</strong> Lília Santos</p>
              </div>

              <Button 
                variant="fire" 
                size="lg" 
                className="w-full"
                onClick={handleWhatsAppRedirect}
              >
                💬 Confirmar Pagamento no WhatsApp
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setShowPix(false)}
                className="w-full"
              >
                Voltar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CustomerCheckout;