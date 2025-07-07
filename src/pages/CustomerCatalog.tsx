import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, Search, MapPin, Clock, Plus, Minus, Trash2, Heart, ChevronDown, Flame, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useIsMobile } from '@/hooks/use-mobile';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

// Type definitions for data structures
type MenuCategory = {
  id: number;
  name: string;
  icon: string;
  active: boolean;
};

type StoreStatus = {
  isOpen?: boolean;
  openingTime?: string;
  closingTime?: string;
  deliveryTime?: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
};

type Accompaniment = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
};

const CustomerCatalog = () => {
  const [cart, setCart] = useState<{id: number, quantity: number, notes?: string}[]>([]);
  const [customerData, setCustomerData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({});
  const [storeOpen, setStoreOpen] = useState(false);
  const [showShippingCalculator, setShowShippingCalculator] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [shippingCost, setShippingCost] = useState(3.00); // Base shipping cost
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showAddNoteDialog, setShowAddNoteDialog] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<number | null>(null);
  const [productNote, setProductNote] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestedItems, setSuggestedItems] = useState<Accompaniment[]>([]);
  const [menuCategories, setMenuCategories] = useState<MenuCategory[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [accompaniments, setAccompaniments] = useState<Accompaniment[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    // Check if customer data exists
    const storedCustomerData = localStorage.getItem('customerData');
    const storedAddress = localStorage.getItem('customerAddress');
    
    if (!storedCustomerData || !storedAddress) {
      toast({
        title: "Dados incompletos",
        description: "Por favor, complete seu cadastro primeiro.",
        variant: "destructive"
      });
      navigate('/customer');
      return;
    }

    setCustomerData({
      ...JSON.parse(storedCustomerData),
      address: JSON.parse(storedAddress)
    });
    
    // Get user location for shipping calculation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Localização não disponível",
            description: "Não foi possível obter sua localização para cálculo de frete.",
            variant: "destructive"
          });
        }
      );
    }
    
    // Load favorites from localStorage
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
    
    // Limpar o localStorage do carrinho para garantir que comece vazio
    localStorage.removeItem('cart');
    
    // Inicializa o carrinho sempre vazio (sem produtos pré-mockados)
    setCart([]);
    
    // Salva o carrinho vazio no localStorage
    localStorage.setItem('cart', JSON.stringify([]));
    
    // Exibe mensagem informando que o carrinho está vazio
    toast({
      title: "Carrinho vazio",
      description: "Adicione produtos ao seu carrinho.",
    });
    
    // Load products from localStorage or initialize with default products
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      // Produtos padrão incluindo lasanhas, molhos e refrigerantes mokado
      const defaultProducts = [
        {
          id: 1,
          name: "Pizza Margherita",
          description: "Molho de tomate, mussarela, manjericão fresco e azeite de oliva.",
          price: 39.90,
          image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=500&auto=format&fit=crop",
          rating: 4.8,
          category: "Pizzas"
        },
        {
          id: 2,
          name: "Pizza Pepperoni",
          description: "Molho de tomate, mussarela e pepperoni.",
          price: 45.90,
          image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=500&auto=format&fit=crop",
          rating: 4.7,
          category: "Pizzas"
        },
        {
          id: 3,
          name: "Calzone de Presunto e Queijo",
          description: "Massa de pizza recheada com presunto, queijo, orégano e molho de tomate.",
          price: 32.90,
          image: "https://images.unsplash.com/photo-1536964549204-cce9eab227bd?q=80&w=500&auto=format&fit=crop",
          rating: 4.5,
          category: "Calzones"
        },
        {
          id: 4,
          name: "Lasanha à Bolonhesa",
          description: "Camadas de massa intercaladas com molho bolonhesa, molho bechamel e queijo gratinado.",
          price: 48.90,
          image: "https://images.unsplash.com/photo-1619895092538-128341789043?q=80&w=500&auto=format&fit=crop",
          rating: 4.9,
          category: "Massas"
        },
        {
          id: 5,
          name: "Lasanha Quatro Queijos",
          description: "Camadas de massa intercaladas com molho branco e quatro tipos de queijos: mussarela, parmesão, provolone e gorgonzola.",
          price: 52.90,
          image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?q=80&w=500&auto=format&fit=crop",
          rating: 4.8,
          category: "Massas"
        },
        {
          id: 6,
          name: "Lasanha de Frango com Catupiry",
          description: "Camadas de massa intercaladas com frango desfiado, catupiry e molho branco.",
          price: 50.90,
          image: "https://images.unsplash.com/photo-1633436375153-d7045cb93e38?q=80&w=500&auto=format&fit=crop",
          rating: 4.7,
          category: "Massas"
        },
        {
          id: 7,
          name: "Refrigerante Mokado Cola",
          description: "Refrigerante sabor cola, garrafa 2L.",
          price: 12.90,
          image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=500&auto=format&fit=crop",
          rating: 4.5,
          category: "Bebidas"
        },
        {
          id: 8,
          name: "Refrigerante Mokado Guaraná",
          description: "Refrigerante sabor guaraná, garrafa 2L.",
          price: 12.90,
          image: "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?q=80&w=500&auto=format&fit=crop",
          rating: 4.6,
          category: "Bebidas"
        },
        {
          id: 9,
          name: "Refrigerante Mokado Laranja",
          description: "Refrigerante sabor laranja, garrafa 2L.",
          price: 12.90,
          image: "https://images.unsplash.com/photo-1596803244618-8dbee441d70b?q=80&w=500&auto=format&fit=crop",
          rating: 4.4,
          category: "Bebidas"
        }
      ];
      setProducts(defaultProducts);
      localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
    
    // Load categories from localStorage or initialize with default categories
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
      setMenuCategories(JSON.parse(storedCategories));
    } else {
      // Categorias padrão
      const defaultCategories = [
        { id: 1, name: "Pizzas", icon: "🍕", active: true },
        { id: 2, name: "Massas", icon: "🍝", active: true },
        { id: 3, name: "Calzones", icon: "🥟", active: true },
        { id: 4, name: "Bebidas", icon: "🥤", active: true }
      ];
      setMenuCategories(defaultCategories);
      localStorage.setItem('categories', JSON.stringify(defaultCategories));
    }
    
    // Load accompaniments from localStorage or initialize with default accompaniments
    const storedAccompaniments = localStorage.getItem('accompaniments');
    if (storedAccompaniments) {
      setAccompaniments(JSON.parse(storedAccompaniments));
    } else {
      // Acompanhamentos padrão incluindo molhos
      const defaultAccompaniments = [
        {
          id: 1,
          name: "Molho de Alho",
          price: 5.90,
          image: "https://images.unsplash.com/photo-1612200132999-b1b357a6972e?q=80&w=500&auto=format&fit=crop",
          category: "molho"
        },
        {
          id: 2,
          name: "Molho Barbecue",
          price: 6.90,
          image: "https://images.unsplash.com/photo-1593645457241-1a3b9ddbcd8a?q=80&w=500&auto=format&fit=crop",
          category: "molho"
        },
        {
          id: 3,
          name: "Molho Picante",
          price: 5.90,
          image: "https://images.unsplash.com/photo-1589895224288-65e4d1a9a207?q=80&w=500&auto=format&fit=crop",
          category: "molho"
        },
        {
          id: 4,
          name: "Refrigerante Lata",
          price: 6.90,
          image: "https://images.unsplash.com/photo-1527960471264-932f39eb5846?q=80&w=500&auto=format&fit=crop",
          category: "bebida"
        }
      ];
      setAccompaniments(defaultAccompaniments);
      localStorage.setItem('accompaniments', JSON.stringify(defaultAccompaniments));
    }
    
    // Configuração do status da loja (aberta/fechada)
    // Verificar o status da loja com base no horário atual
    const currentHour = new Date().getHours();
    const openingHour = 10; // 10:00 AM
    const closingHour = 18; // 6:00 PM
    const isStoreOpen = currentHour >= openingHour && currentHour < closingHour;
    
    // Configurar o status da loja
    const storeStatusConfig = {
      isOpen: isStoreOpen,
      openingTime: "10:00",
      closingTime: "18:00",
      deliveryTime: "30-45 min"
    };
    
    setStoreStatus(storeStatusConfig);
    setStoreOpen(isStoreOpen);
    
    // Salvar o status da loja no localStorage
    localStorage.setItem('storeStatus', JSON.stringify(storeStatusConfig));
    
    // Load store status from localStorage (apenas para compatibilidade)
    const storedStoreStatus = localStorage.getItem('storeStatus');
    if (storedStoreStatus && !storeStatusConfig) {
      const parsedStatus = JSON.parse(storedStoreStatus);
      setStoreStatus(parsedStatus);
      setStoreOpen(parsedStatus.isOpen || false);
    }
  }, [navigate, toast]);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    // Sempre salva o carrinho no localStorage, mesmo quando vazio
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (productId: number) => {
    // Check if it's a new product or increasing quantity
    const existing = cart.find(item => item.id === productId);
    
    if (!existing) {
      // New product - show dialog for notes and suggestions
      setCurrentProductId(productId);
      setProductNote("");
      setShowAddNoteDialog(true);
      
      // Generate suggestions based on product category
      const product = products.find(p => p.id === productId);
      if (product) {
        // Suggest beverages for all products
        let suggestions = accompaniments.filter(item => item.category === "bebida");
        
        // Add sauces for pasta and special dishes
        if (["Massas", "Especiais"].includes(product.category)) {
          suggestions = [
            ...suggestions,
            ...accompaniments.filter(item => item.category === "molho")
          ];
        }
        
        // Add extras for certain categories
        if (["Massas", "Lanches", "Salgados"].includes(product.category)) {
          suggestions = [
            ...suggestions,
            ...accompaniments.filter(item => item.category === "adicional")
          ];
        }
        
        setSuggestedItems(suggestions);
      }
    } else {
      // Just increase quantity for existing product
      setCart(prev => prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
      
      const product = products.find(p => p.id === productId);
      toast({
        title: "Quantidade aumentada",
        description: `${product?.name} agora tem ${existing.quantity + 1} unidades.`,
      });
    }
  };
  
  const confirmAddToCart = () => {
    if (currentProductId === null) return;
    
    setCart(prev => {
      return [...prev, { id: currentProductId, quantity: 1, notes: productNote }];
    });

    const product = products.find(p => p.id === currentProductId);
    toast({
      title: "Produto adicionado!",
      description: `${product?.name} foi adicionado ao carrinho.`,
    });
    
    setShowAddNoteDialog(false);
    setShowSuggestions(true);
  };
  
  const addSuggestionToCart = (suggestionId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === suggestionId);
      if (existing) {
        return prev.map(item => 
          item.id === suggestionId 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { id: suggestionId, quantity: 1 }];
    });

    const suggestion = accompaniments.find(p => p.id === suggestionId);
    toast({
      title: "Acompanhamento adicionado!",
      description: `${suggestion?.name} foi adicionado ao carrinho.`,
    });
  };
  
  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item => 
          item.id === productId 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.id !== productId);
    });
  };
  
  const deleteFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast({
      title: "Produto removido",
      description: "Item removido do carrinho.",
    });
  };
  
  const toggleFavorite = (productId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  const calculateShipping = () => {
    // Mock store location (would come from database in a real app)
    const storeLocation = { lat: -23.550520, lng: -46.633308 };
    
    if (!userLocation) {
      toast({
        title: "Localização não disponível",
        description: "Não foi possível calcular o frete sem sua localização.",
        variant: "destructive"
      });
      return;
    }
    
    // Calculate distance using Haversine formula
    const R = 6371; // Earth radius in km
    const dLat = (userLocation.lat - storeLocation.lat) * Math.PI / 180;
    const dLng = (userLocation.lng - storeLocation.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(storeLocation.lat * Math.PI / 180) * Math.cos(userLocation.lat * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const calculatedDistance = R * c;
    
    setDistance(calculatedDistance);
    
    // Calculate shipping cost: base rate (R$3.00) + R$1.00 per km
    const calculatedCost = 3.00 + (Math.ceil(calculatedDistance) * 1.00);
    setShippingCost(calculatedCost);
    setShowShippingCalculator(true);
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => {
      const product = products.find(p => p.id === item.id) || accompaniments.find(p => p.id === item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
    
    return subtotal;
  };
  
  const getFinalPrice = () => {
    return getTotalPrice() + shippingCost;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCartItemsForSidebar = () => {
    return cart.map(cartItem => {
      // Check if it's a regular product or a suggested accompaniment
      const product = products.find(p => p.id === cartItem.id) || 
                     accompaniments.find(p => p.id === cartItem.id);
      return { ...product, quantity: cartItem.quantity, notes: cartItem.notes };
    }).filter(Boolean);
  };

  if (!customerData) {
    return (
      <div className="min-h-screen bg-gradient-warm flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        {/* Main Content */}
        <div className="flex-1 p-2 sm:p-4 lg:pr-80 pb-20 lg:pb-4">
          <div className="w-full max-w-4xl mx-auto">
            {/* Store Status Banner - Only shown if manager has set status */}
            {storeStatus.isOpen !== undefined && (
              storeStatus.isOpen ? (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <AlertTitle className="text-green-800">Loja Aberta</AlertTitle>
                  </div>
                  <AlertDescription className="text-green-700">
                    Horário: {storeStatus.openingTime} - {storeStatus.closingTime} | Tempo de entrega: {storeStatus.deliveryTime}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="mb-6 border-red-200 bg-red-50 text-red-800">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-800">Loja Fechada</AlertTitle>
                  </div>
                  <AlertDescription className="text-red-700">
                    Voltamos às {storeStatus.openingTime}. Você pode fazer pedidos para serem entregues quando abrirmos!
                  </AlertDescription>
                </Alert>
              )
            )}

            {/* Header */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0 mb-3 sm:mb-6">
              <div>
                <h1 className="text-lg xs:text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">Olá, {customerData.fullName.split(' ')[0]}! 👋</h1>
                <p className="text-muted-foreground text-xs xs:text-sm">O que você quer comer hoje?</p>
              </div>
              <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm text-muted-foreground">
                <MapPin className="h-3 w-3 xs:h-4 xs:w-4" />
                <span className="truncate max-w-[100px] xs:max-w-[150px]">{customerData.address?.neighborhood}</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-2 xs:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 xs:h-4 xs:w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar pratos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 xs:pl-10 text-xs xs:text-sm h-8 xs:h-10"
              />
            </div>

            {/* Promotional Banner - Food-focused */}
            <Card className="mb-4 sm:mb-6 overflow-hidden rounded-xl shadow-warm">
              <CardContent className="p-0 relative">
                <div className="relative overflow-hidden h-32 xs:h-36 sm:h-48 md:h-56">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80 z-10"></div>
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80')] bg-cover bg-center opacity-80"></div>
                  <div className="absolute inset-0 flex flex-col justify-center p-3 xs:p-4 sm:p-6 z-20 text-white">
                    <div className="max-w-md">
                      <Badge variant="secondary" className="mb-1 sm:mb-3 animate-flame-flicker text-xs">
                        <Flame className="h-3 w-3 mr-1" /> Sabor Irresistível
                      </Badge>
                      <h2 className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 drop-shadow-md">Desperte seu Apetite</h2>
                      <p className="text-xs sm:text-sm md:text-base mb-2 sm:mb-4 drop-shadow-md line-clamp-2 sm:line-clamp-3">Sabores artesanais preparados com ingredientes frescos e técnicas tradicionais italianas.</p>
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        className="shadow-fire text-xs h-7 sm:h-9 sm:text-sm"
                        onClick={() => {
                          const menuSection = document.getElementById('menu-categories');
                          if (menuSection) menuSection.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Ver Menu
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Menu Categories */}
            <div className="mb-4 sm:mb-6" id="menu-categories">
              <h3 className="text-base xs:text-lg font-semibold mb-2 xs:mb-4">Categorias do Menu</h3>
              {isMobile ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    <CarouselItem className="basis-auto">
                      <Button
                        variant={selectedCategory === "Todos" ? "fire" : "outline"}
                        onClick={() => setSelectedCategory("Todos")}
                        className="min-w-fit rounded-full text-xs h-7 xs:h-8 xs:text-sm"
                      >
                        Todos
                      </Button>
                    </CarouselItem>
                    {menuCategories.map((category) => (
                      <CarouselItem key={category.id} className="basis-auto">
                        <Button
                          variant={selectedCategory === category.name ? "fire" : "outline"}
                          onClick={() => setSelectedCategory(category.name)}
                          className="min-w-fit rounded-full text-xs h-7 xs:h-8 xs:text-sm"
                        >
                          {category.name}
                        </Button>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden sm:flex">
                    <CarouselPrevious className="-left-3" />
                    <CarouselNext className="-right-3" />
                  </div>
                </Carousel>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <Button
                    variant={selectedCategory === "Todos" ? "fire" : "outline"}
                    onClick={() => setSelectedCategory("Todos")}
                    className="min-w-fit rounded-full text-xs h-7 sm:h-9 sm:text-sm"
                  >
                    Todos
                  </Button>
                  {menuCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.name ? "fire" : "outline"}
                      onClick={() => setSelectedCategory(category.name)}
                      className="min-w-fit rounded-full text-xs h-7 sm:h-9 sm:text-sm"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Popular Dishes */}
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 xs:mb-4">
                <h3 className="text-base xs:text-lg font-semibold">Pratos Populares</h3>
                <Button variant="ghost" size="sm" className="h-7 xs:h-8 text-xs xs:text-sm">Ver Mais</Button>
              </div>
              
              {isMobile ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {filteredProducts.slice(4).map((product) => (
                      <CarouselItem key={product.id} className="md:basis-1/2">
                        <Card className="hover:shadow-warm transition-all duration-300 overflow-hidden border border-muted/50 group">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="flex-1 p-4">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-semibold text-sm">{product.name}</h4>
                                  <button 
                                    onClick={() => toggleFavorite(product.id)}
                                    className="text-muted-foreground hover:text-primary transition-colors"
                                  >
                                    <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-primary text-primary' : ''}`} />
                                  </button>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                  {product.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-primary text-sm sm:text-base">R$ {product.price.toFixed(2)}</span>
                                  <div className="flex items-center gap-1">
                                    {cart.find(item => item.id === product.id) ? (
                                      <div className="flex items-center gap-1">
                                        <Button 
                                          size="icon" 
                                          variant="outline"
                                          className="h-6 w-6 sm:h-7 sm:w-7"
                                          onClick={() => removeFromCart(product.id)}
                                        >
                                          <Minus className="h-3 w-3" />
                                        </Button>
                                        <span className="text-xs font-medium w-4 text-center">
                                          {cart.find(item => item.id === product.id)?.quantity || 0}
                                        </span>
                                        <Button 
                                          size="icon" 
                                          variant="outline"
                                          className="h-6 w-6 sm:h-7 sm:w-7"
                                          onClick={() => addToCart(product.id)}
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button 
                                        size="sm" 
                                        variant="fire"
                                        onClick={() => addToCart(product.id)}
                                        className="shadow-fire group-hover:animate-warm-pulse text-xs sm:text-sm h-7 sm:h-8"
                                      >
                                        Adicionar
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="w-28 h-28 m-4 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
                                {typeof product.image === 'string' && (product.image.startsWith('data:image') || product.image.startsWith('http')) ? (
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden sm:flex">
                    <CarouselPrevious className="-left-3" />
                    <CarouselNext className="-right-3" />
                  </div>
                </Carousel>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {filteredProducts.slice(0, 4).map((product) => (
                    <Card key={product.id} className="hover:shadow-warm transition-all duration-300 overflow-hidden border border-muted/50 group">
                      <CardContent className="p-0">
                        <div className="flex flex-col xs:flex-row">
                          <div className="flex-1 p-3 sm:p-4">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-sm truncate pr-2">{product.name}</h4>
                              <button 
                                onClick={() => toggleFavorite(product.id)}
                                className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                              >
                                <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-primary text-primary' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary text-sm sm:text-base">R$ {product.price.toFixed(2)}</span>
                              <div className="flex items-center gap-1">
                                {cart.find(item => item.id === product.id) ? (
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      size="icon" 
                                      variant="outline"
                                      className="h-6 w-6 sm:h-7 sm:w-7"
                                      onClick={() => removeFromCart(product.id)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-xs font-medium w-4 text-center">
                                      {cart.find(item => item.id === product.id)?.quantity || 0}
                                    </span>
                                    <Button 
                                      size="icon" 
                                      variant="outline"
                                      className="h-6 w-6 sm:h-7 sm:w-7"
                                      onClick={() => addToCart(product.id)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="fire"
                                    onClick={() => addToCart(product.id)}
                                    className="shadow-fire group-hover:animate-warm-pulse text-xs sm:text-sm h-7 sm:h-8"
                                  >
                                    Adicionar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="w-full xs:w-24 sm:w-28 h-24 sm:h-28 xs:m-3 sm:m-4 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden order-first xs:order-last">
                            {typeof product.image === 'string' && (product.image.startsWith('data:image') || product.image.startsWith('http')) ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                ))}
              </div>
              )}
            </div>

            {/* All Products */}
            {filteredProducts.length > 4 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Todos os Pratos</h3>
                {isMobile ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {filteredProducts.slice(4).map((product) => (
                      <CarouselItem key={product.id} className="md:basis-1/2">
                        <Card className="hover:shadow-warm transition-all duration-300 overflow-hidden border border-muted/50 group">
                          <CardContent className="p-0">
                            <div className="flex">
                              <div className="flex-1 p-4">
                                  <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-sm truncate pr-2">{product.name}</h4>
                                    <button 
                                      onClick={() => toggleFavorite(product.id)}
                                      className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                                    >
                                      <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-primary text-primary' : ''}`} />
                                    </button>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {product.description}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-primary text-sm sm:text-base">R$ {product.price.toFixed(2)}</span>
                                    <div className="flex items-center gap-1">
                                      {cart.find(item => item.id === product.id) ? (
                                        <div className="flex items-center gap-1">
                                          <Button 
                                            size="icon" 
                                            variant="outline"
                                            className="h-6 w-6 sm:h-7 sm:w-7"
                                            onClick={() => removeFromCart(product.id)}
                                          >
                                            <Minus className="h-3 w-3" />
                                          </Button>
                                          <span className="text-xs font-medium w-4 text-center">
                                            {cart.find(item => item.id === product.id)?.quantity || 0}
                                          </span>
                                          <Button 
                                            size="icon" 
                                            variant="outline"
                                            className="h-6 w-6 sm:h-7 sm:w-7"
                                            onClick={() => addToCart(product.id)}
                                          >
                                            <Plus className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button 
                                          size="sm" 
                                          variant="fire"
                                          onClick={() => addToCart(product.id)}
                                          className="shadow-fire group-hover:animate-warm-pulse text-xs sm:text-sm h-7 sm:h-8"
                                        >
                                          Adicionar
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="w-28 h-28 m-4 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden">
                                  {typeof product.image === 'string' && (product.image.startsWith('data:image') || product.image.startsWith('http')) ? (
                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <div className="hidden sm:flex">
                      <CarouselPrevious className="-left-3" />
                      <CarouselNext className="-right-3" />
                    </div>
                  </Carousel>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {filteredProducts.slice(4).map((product) => (
                    <Card key={product.id} className="hover:shadow-warm transition-all duration-300 overflow-hidden border border-muted/50 group">
                      <CardContent className="p-0">
                        <div className="flex flex-col xs:flex-row">
                          <div className="flex-1 p-3 sm:p-4">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-semibold text-sm truncate pr-2">{product.name}</h4>
                              <button 
                                onClick={() => toggleFavorite(product.id)}
                                className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                              >
                                <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-primary text-primary' : ''}`} />
                              </button>
                            </div>
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-primary text-sm sm:text-base">R$ {product.price.toFixed(2)}</span>
                              <div className="flex items-center gap-1">
                                {cart.find(item => item.id === product.id) ? (
                                  <div className="flex items-center gap-1">
                                    <Button 
                                      size="icon" 
                                      variant="outline"
                                      className="h-6 w-6 sm:h-7 sm:w-7"
                                      onClick={() => removeFromCart(product.id)}
                                    >
                                      <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-xs font-medium w-4 text-center">
                                      {cart.find(item => item.id === product.id)?.quantity || 0}
                                    </span>
                                    <Button 
                                      size="icon" 
                                      variant="outline"
                                      className="h-6 w-6 sm:h-7 sm:w-7"
                                      onClick={() => addToCart(product.id)}
                                    >
                                      <Plus className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <Button 
                                    size="sm" 
                                    variant="fire"
                                    onClick={() => addToCart(product.id)}
                                    className="shadow-fire group-hover:animate-warm-pulse text-xs sm:text-sm h-7 sm:h-8"
                                  >
                                    Adicionar
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="w-full xs:w-24 sm:w-28 h-24 sm:h-28 xs:m-3 sm:m-4 bg-muted/30 rounded-lg flex items-center justify-center overflow-hidden order-first xs:order-last">
                            {typeof product.image === 'string' && (product.image.startsWith('data:image') || product.image.startsWith('http')) ? (
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border p-4 transform translate-x-full lg:translate-x-0 transition-transform z-40 overflow-y-auto">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="h-5 w-5" />
            <h3 className="font-semibold">Meu Carrinho</h3>
          </div>
          
          {cart.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {getCartItemsForSidebar().map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg group hover:bg-muted/80 transition-colors">
                  <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center overflow-hidden">
                      {typeof item.image === 'string' && (item.image.startsWith('data:image') || item.image.startsWith('http')) ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                      )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-5 w-5 p-0 hover:bg-background/80"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-xs">{item.quantity}x</span>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-5 w-5 p-0 hover:bg-background/80"
                        onClick={() => addToCart(item.id)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => deleteFromCart(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {/* Shipping Calculator */}
              <div className="border border-muted rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Calcular Frete</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs"
                    onClick={calculateShipping}
                  >
                    Calcular
                  </Button>
                </div>
                
                {showShippingCalculator && (
                  <div className="text-xs space-y-1 mt-2 bg-muted/30 p-2 rounded">
                    {distance && (
                      <div className="flex justify-between">
                        <span>Distância:</span>
                        <span>{distance.toFixed(1)} km</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Taxa base:</span>
                      <span>R$ 3,00</span>
                    </div>
                    {distance && (
                      <div className="flex justify-between">
                        <span>Adicional por km:</span>
                        <span>R$ {Math.ceil(distance).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-1" />
                    <div className="flex justify-between font-medium">
                      <span>Frete:</span>
                      <span>R$ {shippingCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">R$ {getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Frete</span>
                  <span className="text-sm">R$ {shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-primary text-lg">R$ {getFinalPrice().toFixed(2)}</span>
                </div>
                
                <Button 
                  variant="fire" 
                  className="w-full shadow-fire"
                  onClick={() => {
                    localStorage.setItem('cart', JSON.stringify(cart));
                    localStorage.setItem('shippingCost', shippingCost.toString());
                    navigate('/customer/checkout');
                  }}
                >
                  Finalizar Pedido
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Cart Button */}
        <div className="fixed bottom-3 xs:bottom-4 right-3 xs:right-4 lg:hidden z-50">
          <Button 
            variant="fire" 
            size="icon" 
            className="h-12 w-12 xs:h-14 xs:w-14 rounded-full shadow-fire relative"
            onClick={() => setShowMobileCart(!showMobileCart)}
          >
            <ShoppingCart className="h-5 w-5 xs:h-6 xs:w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full h-5 w-5 xs:h-6 xs:w-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Button>
        </div>
        
        {/* Mobile Cart Drawer */}
        <div className={`fixed inset-0 bg-black/50 z-50 lg:hidden transition-opacity ${showMobileCart ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setShowMobileCart(false)}>
          <div 
            className={`fixed bottom-0 left-0 right-0 bg-background rounded-t-xl p-3 xs:p-4 transition-transform ${showMobileCart ? 'translate-y-0' : 'translate-y-full'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 xs:w-12 h-1 bg-muted rounded-full mx-auto mb-3 xs:mb-4"></div>
            
            <div className="flex items-center justify-between mb-3 xs:mb-4">
              <div className="flex items-center gap-1.5 xs:gap-2">
                <ShoppingCart className="h-4 w-4 xs:h-5 xs:w-5" />
                <h3 className="font-semibold text-sm xs:text-base">Meu Carrinho</h3>
              </div>
              <span className="text-xs text-muted-foreground">{getTotalItems()} itens</span>
            </div>
            
            {cart.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Seu carrinho está vazio</p>
              </div>
            ) : (
              <div className="space-y-3 xs:space-y-4 max-h-[40vh] xs:max-h-[50vh] overflow-y-auto">
                {getCartItemsForSidebar().map((item) => (
                  <div key={item.id} className="flex items-center gap-2 xs:gap-3 p-2 xs:p-3 bg-muted/50 rounded-lg">
                    <div className="w-14 h-14 xs:w-16 xs:h-16 bg-background rounded-lg flex items-center justify-center overflow-hidden">
                        {typeof item.image === 'string' && (item.image.startsWith('data:image') || item.image.startsWith('http')) ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs xs:text-sm truncate">{item.name}</h4>
                      {item.notes && (
                        <p className="text-[10px] xs:text-xs text-muted-foreground italic mt-0.5 mb-0.5 xs:mb-1 line-clamp-1">
                          Obs: {item.notes}
                        </p>
                      )}
                      <div className="flex items-center gap-1 xs:gap-2 mt-0.5 xs:mt-1">
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-4 w-4 xs:h-5 xs:w-5 p-0"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Minus className="h-2 w-2 xs:h-3 xs:w-3" />
                        </Button>
                        <span className="text-[10px] xs:text-xs">{item.quantity}x</span>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          className="h-4 w-4 xs:h-5 xs:w-5 p-0"
                          onClick={() => addToCart(item.id)}
                        >
                          <Plus className="h-2 w-2 xs:h-3 xs:w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xs xs:text-sm">R$ {(item.price * item.quantity).toFixed(2)}</p>
                      <Button 
                        size="icon" 
                        variant="ghost"
                        className="h-5 w-5 xs:h-6 xs:w-6 p-0 text-muted-foreground hover:text-destructive mt-0.5 xs:mt-1"
                        onClick={() => deleteFromCart(item.id)}
                      >
                        <Trash2 className="h-2 w-2 xs:h-3 xs:w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full text-xs xs:text-sm py-1 xs:py-2"
                  onClick={calculateShipping}
                >
                  Calcular Frete
                </Button>
                
                {showShippingCalculator && (
                  <div className="text-[10px] xs:text-xs space-y-0.5 xs:space-y-1 bg-muted/30 p-2 xs:p-3 rounded">
                    {distance && (
                      <div className="flex justify-between">
                        <span>Distância:</span>
                        <span>{distance.toFixed(1)} km</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Taxa base:</span>
                      <span>R$ 3,00</span>
                    </div>
                    {distance && (
                      <div className="flex justify-between">
                        <span>Adicional por km:</span>
                        <span>R$ {Math.ceil(distance).toFixed(2)}</span>
                      </div>
                    )}
                    <Separator className="my-0.5 xs:my-1" />
                    <div className="flex justify-between font-medium">
                      <span>Frete:</span>
                      <span>R$ {shippingCost.toFixed(2)}</span>
                    </div>
                  </div>
                )}
                
                <div className="border-t pt-3 xs:pt-4 mt-3 xs:mt-4">
                  <div className="flex justify-between items-center mb-1 xs:mb-2">
                    <span className="text-xs xs:text-sm">Subtotal</span>
                    <span className="text-xs xs:text-sm">R$ {getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-1 xs:mb-2">
                    <span className="text-xs xs:text-sm">Frete</span>
                    <span className="text-xs xs:text-sm">R$ {shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-3 xs:mb-4">
                    <span className="font-bold text-sm">Total</span>
                    <span className="font-bold text-primary text-base xs:text-lg">R$ {getFinalPrice().toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    variant="fire" 
                    className="w-full shadow-fire text-sm xs:text-base py-2 xs:py-3"
                    onClick={() => {
                      localStorage.setItem('cart', JSON.stringify(cart));
                      localStorage.setItem('shippingCost', shippingCost.toString());
                      navigate('/customer/checkout');
                    }}
                  >
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialog for adding notes to products */}
      <Dialog open={showAddNoteDialog} onOpenChange={setShowAddNoteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar observações</DialogTitle>
            <DialogDescription>
              Deseja adicionar alguma observação para este item?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                placeholder="Ex: Sem cebola, bem passado, etc."
                value={productNote}
                onChange={(e) => setProductNote(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowAddNoteDialog(false)}>Cancelar</Button>
            <Button variant="fire" onClick={confirmAddToCart}>Adicionar ao carrinho</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog for suggested accompaniments */}
      <Dialog open={showSuggestions} onOpenChange={setShowSuggestions}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sugestões de acompanhamento</DialogTitle>
            <DialogDescription>
              Que tal adicionar um acompanhamento ao seu pedido?
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            {suggestedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted/80 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-background rounded-lg flex items-center justify-center overflow-hidden">
                    {typeof item.image === 'string' && (item.image.startsWith('data:image') || item.image.startsWith('http')) ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted/50 flex items-center justify-center text-xs">Sem imagem</div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-muted-foreground">R$ {item.price.toFixed(2)}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    addSuggestionToCart(item.id);
                    // Keep dialog open to allow multiple selections
                  }}
                >
                  Adicionar
                </Button>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="fire" onClick={() => setShowSuggestions(false)}>Concluir</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerCatalog;