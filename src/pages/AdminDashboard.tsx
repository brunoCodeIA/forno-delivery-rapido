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
import { Settings, Users, Package, BarChart3, Clock, MapPin, CheckCircle2, Edit, Eye, Trash2, Plus, ShoppingBag, Image, Upload, TrendingUp, Calendar, DollarSign, LineChart, PieChart, BarChart, ArrowUpRight, ArrowDownRight, Utensils, FileDown, Filter } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { useIsMobile } from '@/hooks/use-mobile';

// Mock data structure (empty by default)
const mockOrders: {
  id: string;
  customer: string;
  phone: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: string;
  address: string;
  orderTime: string;
  date: Date;
}[] = [
  {
    id: 'PED001',
    customer: 'João Silva',
    phone: '(11) 98765-4321',
    items: [
      { name: 'Pizza Margherita', quantity: 1, price: 45.90 },
      { name: 'Refrigerante Cola', quantity: 2, price: 6.50 }
    ],
    total: 58.90,
    status: 'delivered',
    address: 'Rua das Flores, 123',
    orderTime: '19:30',
    date: new Date(2023, 10, 1) // 01/11/2023
  },
  {
    id: 'PED002',
    customer: 'Maria Oliveira',
    phone: '(11) 91234-5678',
    items: [
      { name: 'Lasanha Bolonhesa', quantity: 1, price: 38.90 },
      { name: 'Salada Caesar', quantity: 1, price: 18.90 }
    ],
    total: 57.80,
    status: 'delivered',
    address: 'Av. Paulista, 1000',
    orderTime: '20:15',
    date: new Date(2023, 10, 2) // 02/11/2023
  },
  {
    id: 'PED003',
    customer: 'Carlos Mendes',
    phone: '(11) 99876-5432',
    items: [
      { name: 'Pizza Calabresa', quantity: 2, price: 49.90 },
      { name: 'Refrigerante Guaraná', quantity: 2, price: 6.50 }
    ],
    total: 112.80,
    status: 'delivered',
    address: 'Rua Augusta, 500',
    orderTime: '21:00',
    date: new Date(2023, 10, 3) // 03/11/2023
  },
  {
    id: 'PED004',
    customer: 'Ana Souza',
    phone: '(11) 98888-7777',
    items: [
      { name: 'Macarrão ao Molho Branco', quantity: 1, price: 32.90 },
      { name: 'Tiramisu', quantity: 1, price: 15.90 }
    ],
    total: 48.80,
    status: 'delivered',
    address: 'Rua Oscar Freire, 200',
    orderTime: '19:45',
    date: new Date(2023, 10, 4) // 04/11/2023
  },
  {
    id: 'PED005',
    customer: 'Roberto Almeida',
    phone: '(11) 97777-6666',
    items: [
      { name: 'Pizza Quatro Queijos', quantity: 1, price: 52.90 },
      { name: 'Cerveja', quantity: 2, price: 8.90 }
    ],
    total: 70.70,
    status: 'delivered',
    address: 'Alameda Santos, 800',
    orderTime: '20:30',
    date: new Date(2023, 10, 5) // 05/11/2023
  },
  {
    id: 'PED006',
    customer: 'Fernanda Lima',
    phone: '(11) 96666-5555',
    items: [
      { name: 'Risoto de Camarão', quantity: 1, price: 62.90 },
      { name: 'Água Mineral', quantity: 1, price: 4.50 }
    ],
    total: 67.40,
    status: 'delivered',
    address: 'Rua Consolação, 150',
    orderTime: '21:15',
    date: new Date(2023, 10, 6) // 06/11/2023
  },
  {
    id: 'PED007',
    customer: 'Pedro Santos',
    phone: '(11) 95555-4444',
    items: [
      { name: 'Pizza Portuguesa', quantity: 1, price: 48.90 },
      { name: 'Refrigerante Limão', quantity: 1, price: 6.50 }
    ],
    total: 55.40,
    status: 'delivered',
    address: 'Av. Rebouças, 500',
    orderTime: '19:00',
    date: new Date(2023, 10, 7) // 07/11/2023
  },
  {
    id: 'PED008',
    customer: 'Luciana Costa',
    phone: '(11) 94444-3333',
    items: [
      { name: 'Lasanha Quatro Queijos', quantity: 1, price: 42.90 },
      { name: 'Salada Mista', quantity: 1, price: 16.90 }
    ],
    total: 59.80,
    status: 'delivered',
    address: 'Rua Haddock Lobo, 300',
    orderTime: '20:45',
    date: new Date(2023, 10, 8) // 08/11/2023
  },
  {
    id: 'PED009',
    customer: 'Marcelo Oliveira',
    phone: '(11) 93333-2222',
    items: [
      { name: 'Pizza Frango com Catupiry', quantity: 1, price: 50.90 },
      { name: 'Refrigerante Cola', quantity: 1, price: 6.50 }
    ],
    total: 57.40,
    status: 'delivered',
    address: 'Av. Brigadeiro Faria Lima, 1500',
    orderTime: '21:30',
    date: new Date(2023, 10, 9) // 09/11/2023
  },
  {
    id: 'PED010',
    customer: 'Juliana Martins',
    phone: '(11) 92222-1111',
    items: [
      { name: 'Nhoque ao Sugo', quantity: 1, price: 36.90 },
      { name: 'Pudim', quantity: 1, price: 12.90 }
    ],
    total: 49.80,
    status: 'delivered',
    address: 'Rua Pamplona, 100',
    orderTime: '19:15',
    date: new Date(2023, 10, 10) // 10/11/2023
  },
  {
    id: 'PED011',
    customer: 'Ricardo Ferreira',
    phone: '(11) 91111-0000',
    items: [
      { name: 'Pizza Pepperoni', quantity: 1, price: 54.90 },
      { name: 'Cerveja', quantity: 2, price: 8.90 }
    ],
    total: 72.70,
    status: 'delivered',
    address: 'Rua Bela Cintra, 400',
    orderTime: '20:00',
    date: new Date(2023, 10, 11) // 11/11/2023
  },
  {
    id: 'PED012',
    customer: 'Camila Rodrigues',
    phone: '(11) 90000-9999',
    items: [
      { name: 'Fettuccine Alfredo', quantity: 1, price: 39.90 },
      { name: 'Água com Gás', quantity: 1, price: 5.50 }
    ],
    total: 45.40,
    status: 'delivered',
    address: 'Av. Angélica, 700',
    orderTime: '21:45',
    date: new Date(2023, 10, 12) // 12/11/2023
  },
  {
    id: 'PED013',
    customer: 'Gustavo Alves',
    phone: '(11) 99999-8888',
    items: [
      { name: 'Pizza Margherita', quantity: 1, price: 45.90 },
      { name: 'Pizza Calabresa', quantity: 1, price: 49.90 },
      { name: 'Refrigerante Cola', quantity: 2, price: 6.50 }
    ],
    total: 108.80,
    status: 'delivered',
    address: 'Rua da Consolação, 800',
    orderTime: '19:30',
    date: new Date(2023, 10, 13) // 13/11/2023
  },
  {
    id: 'PED014',
    customer: 'Patrícia Lima',
    phone: '(11) 98888-7777',
    items: [
      { name: 'Lasanha Bolonhesa', quantity: 1, price: 38.90 },
      { name: 'Tiramisu', quantity: 1, price: 15.90 }
    ],
    total: 54.80,
    status: 'delivered',
    address: 'Av. Paulista, 2000',
    orderTime: '20:15',
    date: new Date(2023, 10, 14) // 14/11/2023
  },
  {
    id: 'PED015',
    customer: 'Fábio Souza',
    phone: '(11) 97777-6666',
    items: [
      { name: 'Risoto de Funghi', quantity: 1, price: 58.90 },
      { name: 'Salada Caesar', quantity: 1, price: 18.90 }
    ],
    total: 77.80,
    status: 'delivered',
    address: 'Rua Augusta, 1000',
    orderTime: '21:00',
    date: new Date(2023, 10, 15) // 15/11/2023
  },
  {
    id: 'PED016',
    customer: 'Renata Castro',
    phone: '(11) 96666-5555',
    items: [
      { name: 'Pizza Quatro Queijos', quantity: 1, price: 52.90 },
      { name: 'Refrigerante Guaraná', quantity: 1, price: 6.50 }
    ],
    total: 59.40,
    status: 'delivered',
    address: 'Alameda Santos, 300',
    orderTime: '19:45',
    date: new Date(2023, 10, 16) // 16/11/2023
  },
  {
    id: 'PED017',
    customer: 'Bruno Oliveira',
    phone: '(11) 95555-4444',
    items: [
      { name: 'Macarrão à Carbonara', quantity: 1, price: 36.90 },
      { name: 'Cerveja', quantity: 2, price: 8.90 }
    ],
    total: 54.70,
    status: 'delivered',
    address: 'Rua Oscar Freire, 500',
    orderTime: '20:30',
    date: new Date(2023, 10, 17) // 17/11/2023
  },
  {
    id: 'PED018',
    customer: 'Amanda Santos',
    phone: '(11) 94444-3333',
    items: [
      { name: 'Pizza Portuguesa', quantity: 1, price: 48.90 },
      { name: 'Água Mineral', quantity: 1, price: 4.50 }
    ],
    total: 53.40,
    status: 'delivered',
    address: 'Av. Rebouças, 200',
    orderTime: '21:15',
    date: new Date(2023, 10, 18) // 18/11/2023
  },
  {
    id: 'PED019',
    customer: 'Leonardo Martins',
    phone: '(11) 93333-2222',
    items: [
      { name: 'Lasanha Quatro Queijos', quantity: 1, price: 42.90 },
      { name: 'Refrigerante Limão', quantity: 1, price: 6.50 }
    ],
    total: 49.40,
    status: 'delivered',
    address: 'Rua Haddock Lobo, 600',
    orderTime: '19:00',
    date: new Date(2023, 10, 19) // 19/11/2023
  },
  {
    id: 'PED020',
    customer: 'Isabela Costa',
    phone: '(11) 92222-1111',
    items: [
      { name: 'Pizza Frango com Catupiry', quantity: 1, price: 50.90 },
      { name: 'Salada Mista', quantity: 1, price: 16.90 }
    ],
    total: 67.80,
    status: 'delivered',
    address: 'Av. Brigadeiro Faria Lima, 800',
    orderTime: '20:45',
    date: new Date(2023, 10, 20) // 20/11/2023
  },
  {
    id: 'PED021',
    customer: 'Thiago Almeida',
    phone: '(11) 91111-0000',
    items: [
      { name: 'Nhoque ao Sugo', quantity: 1, price: 36.90 },
      { name: 'Refrigerante Cola', quantity: 1, price: 6.50 }
    ],
    total: 43.40,
    status: 'delivered',
    address: 'Rua Pamplona, 400',
    orderTime: '21:30',
    date: new Date(2023, 10, 21) // 21/11/2023
  },
  {
    id: 'PED022',
    customer: 'Carla Ferreira',
    phone: '(11) 90000-9999',
    items: [
      { name: 'Pizza Pepperoni', quantity: 1, price: 54.90 },
      { name: 'Pudim', quantity: 1, price: 12.90 }
    ],
    total: 67.80,
    status: 'delivered',
    address: 'Rua Bela Cintra, 700',
    orderTime: '19:15',
    date: new Date(2023, 10, 22) // 22/11/2023
  },
  {
    id: 'PED023',
    customer: 'Rodrigo Lima',
    phone: '(11) 99999-8888',
    items: [
      { name: 'Fettuccine Alfredo', quantity: 1, price: 39.90 },
      { name: 'Cerveja', quantity: 2, price: 8.90 }
    ],
    total: 57.70,
    status: 'delivered',
    address: 'Av. Angélica, 300',
    orderTime: '20:00',
    date: new Date(2023, 10, 23) // 23/11/2023
  },
  {
    id: 'PED024',
    customer: 'Bianca Rodrigues',
    phone: '(11) 98888-7777',
    items: [
      { name: 'Pizza Margherita', quantity: 1, price: 45.90 },
      { name: 'Água com Gás', quantity: 1, price: 5.50 }
    ],
    total: 51.40,
    status: 'delivered',
    address: 'Rua da Consolação, 500',
    orderTime: '21:45',
    date: new Date(2023, 10, 24) // 24/11/2023
  },
  {
    id: 'PED025',
    customer: 'Marcos Alves',
    phone: '(11) 97777-6666',
    items: [
      { name: 'Lasanha Bolonhesa', quantity: 1, price: 38.90 },
      { name: 'Refrigerante Guaraná', quantity: 1, price: 6.50 }
    ],
    total: 45.40,
    status: 'delivered',
    address: 'Av. Paulista, 1500',
    orderTime: '19:30',
    date: new Date(2023, 10, 25) // 25/11/2023
  },
  {
    id: 'PED026',
    customer: 'Vanessa Souza',
    phone: '(11) 96666-5555',
    items: [
      { name: 'Pizza Calabresa', quantity: 1, price: 49.90 },
      { name: 'Tiramisu', quantity: 1, price: 15.90 }
    ],
    total: 65.80,
    status: 'delivered',
    address: 'Rua Augusta, 300',
    orderTime: '20:15',
    date: new Date(2023, 10, 26) // 26/11/2023
  },
  {
    id: 'PED027',
    customer: 'Rafael Castro',
    phone: '(11) 95555-4444',
    items: [
      { name: 'Risoto de Camarão', quantity: 1, price: 62.90 },
      { name: 'Salada Caesar', quantity: 1, price: 18.90 }
    ],
    total: 81.80,
    status: 'delivered',
    address: 'Alameda Santos, 600',
    orderTime: '21:00',
    date: new Date(2023, 10, 27) // 27/11/2023
  },
  {
    id: 'PED028',
    customer: 'Daniela Oliveira',
    phone: '(11) 94444-3333',
    items: [
      { name: 'Pizza Quatro Queijos', quantity: 1, price: 52.90 },
      { name: 'Refrigerante Limão', quantity: 1, price: 6.50 }
    ],
    total: 59.40,
    status: 'delivered',
    address: 'Rua Oscar Freire, 800',
    orderTime: '19:45',
    date: new Date(2023, 10, 28) // 28/11/2023
  },
  {
    id: 'PED029',
    customer: 'Felipe Santos',
    phone: '(11) 93333-2222',
    items: [
      { name: 'Macarrão ao Molho Branco', quantity: 1, price: 32.90 },
      { name: 'Cerveja', quantity: 2, price: 8.90 }
    ],
    total: 50.70,
    status: 'delivered',
    address: 'Av. Rebouças, 900',
    orderTime: '20:30',
    date: new Date(2023, 10, 29) // 29/11/2023
  },
  {
    id: 'PED030',
    customer: 'Natália Martins',
    phone: '(11) 92222-1111',
    items: [
      { name: 'Pizza Portuguesa', quantity: 1, price: 48.90 },
      { name: 'Água Mineral', quantity: 1, price: 4.50 }
    ],
    total: 53.40,
    status: 'delivered',
    address: 'Rua Haddock Lobo, 100',
    orderTime: '21:15',
    date: new Date(2023, 10, 30) // 30/11/2023
  },
  {
    id: 'PED031',
    customer: 'João Silva',
    phone: '(11) 98765-4321',
    items: [
      { name: 'Pizza Margherita', quantity: 1, price: 45.90 },
      { name: 'Refrigerante Cola', quantity: 2, price: 6.50 }
    ],
    total: 58.90,
    status: 'production',
    address: 'Rua das Flores, 123',
    orderTime: '19:30',
    date: new Date() // Hoje
  },
  {
    id: 'PED032',
    customer: 'Maria Oliveira',
    phone: '(11) 91234-5678',
    items: [
      { name: 'Lasanha Bolonhesa', quantity: 1, price: 38.90 },
      { name: 'Salada Caesar', quantity: 1, price: 18.90 }
    ],
    total: 57.80,
    status: 'received',
    address: 'Av. Paulista, 1000',
    orderTime: '20:15',
    date: new Date() // Hoje
  }
];

const mockProducts: {
  id: number;
  name: string;
  description: string;
  price: number;
  active: boolean;
  stock: boolean;
  category: string;
  image?: string;
  sales?: number;
}[] = [
  {
    id: 1,
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela, manjericão fresco',
    price: 45.90,
    active: true,
    stock: true,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
    sales: 78
  },
  {
    id: 2,
    name: 'Pizza Calabresa',
    description: 'Molho de tomate, mussarela, calabresa fatiada, cebola',
    price: 49.90,
    active: true,
    stock: true,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
    sales: 92
  },
  {
    id: 3,
    name: 'Pizza Quatro Queijos',
    description: 'Molho de tomate, mussarela, provolone, gorgonzola, parmesão',
    price: 52.90,
    active: true,
    stock: true,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47',
    sales: 65
  },
  {
    id: 4,
    name: 'Pizza Portuguesa',
    description: 'Molho de tomate, mussarela, presunto, ovos, cebola, ervilha, azeitona',
    price: 48.90,
    active: true,
    stock: true,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
    sales: 54
  },
  {
    id: 5,
    name: 'Pizza Frango com Catupiry',
    description: 'Molho de tomate, mussarela, frango desfiado, catupiry',
    price: 50.90,
    active: true,
    stock: true,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1593560708920-61b98681d5cc',
    sales: 87
  },
  {
    id: 6,
    name: 'Pizza Pepperoni',
    description: 'Molho de tomate, mussarela, pepperoni',
    price: 54.90,
    active: true,
    stock: true,
    category: 'Pizzas',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee',
    sales: 72
  },
  {
    id: 7,
    name: 'Lasanha Bolonhesa',
    description: 'Massa fresca, molho bolonhesa, molho branco, queijo gratinado',
    price: 38.90,
    active: true,
    stock: true,
    category: 'Massas',
    image: 'https://images.unsplash.com/photo-1619895092538-128341789043',
    sales: 63
  },
  {
    id: 8,
    name: 'Lasanha Quatro Queijos',
    description: 'Massa fresca, molho branco, mix de quatro queijos',
    price: 42.90,
    active: true,
    stock: true,
    category: 'Massas',
    image: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3',
    sales: 48
  },
  {
    id: 9,
    name: 'Macarrão ao Molho Branco',
    description: 'Fettuccine, molho branco cremoso, ervas finas',
    price: 32.90,
    active: true,
    stock: true,
    category: 'Massas',
    image: 'https://images.unsplash.com/photo-1608219992759-8d74ed8d76eb',
    sales: 41
  },
  {
    id: 10,
    name: 'Macarrão à Carbonara',
    description: 'Espaguete, bacon, ovos, queijo parmesão, pimenta preta',
    price: 36.90,
    active: true,
    stock: true,
    category: 'Massas',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
    sales: 56
  },
  {
    id: 11,
    name: 'Nhoque ao Sugo',
    description: 'Nhoque de batata, molho de tomate caseiro, manjericão',
    price: 36.90,
    active: true,
    stock: true,
    category: 'Massas',
    image: 'https://images.unsplash.com/photo-1598866594230-a7c12756260f',
    sales: 38
  },
  {
    id: 12,
    name: 'Fettuccine Alfredo',
    description: 'Fettuccine, molho alfredo, frango grelhado',
    price: 39.90,
    active: true,
    stock: true,
    category: 'Massas',
    image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023882c',
    sales: 45
  },
  {
    id: 13,
    name: 'Risoto de Camarão',
    description: 'Arroz arbóreo, camarões, vinho branco, creme de leite, parmesão',
    price: 62.90,
    active: true,
    stock: true,
    category: 'Risotos',
    image: 'https://images.unsplash.com/photo-1633436375153-d7045cb93e38',
    sales: 52
  },
  {
    id: 14,
    name: 'Risoto de Funghi',
    description: 'Arroz arbóreo, mix de cogumelos, vinho branco, parmesão',
    price: 58.90,
    active: true,
    stock: true,
    category: 'Risotos',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
    sales: 39
  },
  {
    id: 15,
    name: 'Salada Caesar',
    description: 'Alface americana, croutons, frango grelhado, molho caesar, parmesão',
    price: 18.90,
    active: true,
    stock: true,
    category: 'Saladas',
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
    sales: 47
  },
  {
    id: 16,
    name: 'Salada Mista',
    description: 'Mix de folhas, tomate, pepino, cenoura, azeitona, palmito',
    price: 16.90,
    active: true,
    stock: true,
    category: 'Saladas',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
    sales: 35
  },
  {
    id: 17,
    name: 'Tiramisu',
    description: 'Biscoito champagne, café, queijo mascarpone, cacau em pó',
    price: 15.90,
    active: true,
    stock: true,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9',
    sales: 58
  },
  {
    id: 18,
    name: 'Pudim',
    description: 'Pudim de leite condensado com calda de caramelo',
    price: 12.90,
    active: true,
    stock: true,
    category: 'Sobremesas',
    image: 'https://images.unsplash.com/photo-1539252554935-80c8cabf1911',
    sales: 62
  },
  {
    id: 19,
    name: 'Refrigerante Cola',
    description: 'Lata 350ml',
    price: 6.50,
    active: true,
    stock: true,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97',
    sales: 120
  },
  {
    id: 20,
    name: 'Refrigerante Guaraná',
    description: 'Lata 350ml',
    price: 6.50,
    active: true,
    stock: true,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3',
    sales: 95
  },
  {
    id: 21,
    name: 'Refrigerante Limão',
    description: 'Lata 350ml',
    price: 6.50,
    active: true,
    stock: true,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca',
    sales: 83
  },
  {
    id: 22,
    name: 'Água Mineral',
    description: 'Garrafa 500ml',
    price: 4.50,
    active: true,
    stock: true,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1616118132534-381148898bb4',
    sales: 76
  },
  {
    id: 23,
    name: 'Água com Gás',
    description: 'Garrafa 500ml',
    price: 5.50,
    active: true,
    stock: true,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1564601835759-48d8adb9e115',
    sales: 64
  },
  {
    id: 24,
    name: 'Cerveja',
    description: 'Garrafa 600ml',
    price: 8.90,
    active: true,
    stock: true,
    category: 'Bebidas',
    image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9',
    sales: 110
  }
];

const mockCategories: {
  id: number;
  name: string;
  icon: string;
  active: boolean;
}[] = [
  { id: 1, name: 'Pizzas', icon: '🍕', active: true },
  { id: 2, name: 'Massas', icon: '🍝', active: true },
  { id: 3, name: 'Risotos', icon: '🍚', active: true },
  { id: 4, name: 'Saladas', icon: '🥗', active: true },
  { id: 5, name: 'Sobremesas', icon: '🍰', active: true },
  { id: 6, name: 'Bebidas', icon: '🥤', active: true }
];

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
  const [selectedPeriod, setSelectedPeriod] = useState('daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Função para calcular o faturamento total
  const calculateTotalRevenue = () => {
    return orders.reduce((total, order) => total + order.total, 0).toFixed(2);
  };

  // Função para calcular o faturamento diário
  const calculateDailyRevenue = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
    
    return dailyOrders.reduce((total, order) => total + order.total, 0).toFixed(2);
  };

  // Função para calcular o faturamento semanal
  const calculateWeeklyRevenue = () => {
    const today = new Date();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Domingo como primeiro dia da semana
    firstDayOfWeek.setHours(0, 0, 0, 0);
    
    const weeklyOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate >= firstDayOfWeek;
    });
    
    return weeklyOrders.reduce((total, order) => total + order.total, 0).toFixed(2);
  };

  // Função para calcular o faturamento mensal
  const calculateMonthlyRevenue = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    firstDayOfMonth.setHours(0, 0, 0, 0);
    
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate >= firstDayOfMonth;
    });
    
    return monthlyOrders.reduce((total, order) => total + order.total, 0).toFixed(2);
  };

  // Função para calcular o faturamento anual
  const calculateYearlyRevenue = () => {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    firstDayOfYear.setHours(0, 0, 0, 0);
    
    const yearlyOrders = orders.filter(order => {
      const orderDate = new Date(order.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate >= firstDayOfYear;
    });
    
    return yearlyOrders.reduce((total, order) => total + order.total, 0).toFixed(2);
  };

  // Função para obter os produtos mais vendidos
  const getTopSellingProducts = (limit = 5) => {
    return [...products]
      .sort((a, b) => (b.sales || 0) - (a.sales || 0))
      .slice(0, limit);
  };

  // Função para obter dados de vendas por categoria
  const getSalesByCategory = () => {
    const categorySales: {[key: string]: number} = {};
    
    products.forEach(product => {
      if (!categorySales[product.category]) {
        categorySales[product.category] = 0;
      }
      categorySales[product.category] += product.sales || 0;
    });
    
    return Object.entries(categorySales).map(([category, sales]) => ({
      category,
      sales
    }));
  };

  // Função para obter dados de vendas por dia da semana
  const getSalesByDayOfWeek = () => {
    const dayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const daySales = Array(7).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const dayOfWeek = orderDate.getDay();
      daySales[dayOfWeek] += order.total;
    });
    
    return dayNames.map((day, index) => ({
      day,
      sales: daySales[index]
    }));
  };

  // Função para obter dados de vendas por mês
  const getSalesByMonth = () => {
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const monthSales = Array(12).fill(0);
    
    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const month = orderDate.getMonth();
      monthSales[month] += order.total;
    });
    
    return monthNames.map((month, index) => ({
      month,
      sales: monthSales[index]
    }));
  };

  // Função para obter o faturamento com base no período selecionado
  const getRevenueByPeriod = () => {
    switch (selectedPeriod) {
      case 'daily':
        return calculateDailyRevenue();
      case 'weekly':
        return calculateWeeklyRevenue();
      case 'monthly':
        return calculateMonthlyRevenue();
      case 'yearly':
        return calculateYearlyRevenue();
      default:
        return calculateTotalRevenue();
    }
  };

  // Função para obter o número de pedidos hoje
  const getOrdersToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.date);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    }).length;
  };

  // Função para obter o número de pedidos em produção
  const getOrdersInProduction = () => {
    return orders.filter(order => order.status === 'production').length;
  };

  // Função para obter o número de pedidos para entrega
  const getOrdersForDelivery = () => {
    return orders.filter(order => order.status === 'ready' || order.status === 'delivery').length;
  };
  
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pedidos Hoje</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">{getOrdersToday()}</div>
                  <p className="text-xs text-muted-foreground">
                    +2.1% em relação a ontem
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Faturamento ({selectedPeriod === 'daily' ? 'Hoje' : 
                                 selectedPeriod === 'weekly' ? 'Semanal' : 
                                 selectedPeriod === 'monthly' ? 'Mensal' : 'Anual'})
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">R$ {getRevenueByPeriod()}</div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Button 
                      variant={selectedPeriod === 'daily' ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSelectedPeriod('daily')}
                      className="text-xs h-7 px-2"
                    >
                      Dia
                    </Button>
                    <Button 
                      variant={selectedPeriod === 'weekly' ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSelectedPeriod('weekly')}
                      className="text-xs h-7 px-2"
                    >
                      Semana
                    </Button>
                    <Button 
                      variant={selectedPeriod === 'monthly' ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSelectedPeriod('monthly')}
                      className="text-xs h-7 px-2"
                    >
                      Mês
                    </Button>
                    <Button 
                      variant={selectedPeriod === 'yearly' ? "default" : "outline"} 
                      size="sm" 
                      onClick={() => setSelectedPeriod('yearly')}
                      className="text-xs h-7 px-2"
                    >
                      Ano
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Produção</CardTitle>
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary">{getOrdersInProduction()}</div>
                  <p className="text-xs text-muted-foreground">
                    -10% em relação a ontem
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Para Entrega</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-earth">{getOrdersForDelivery()}</div>
                  <p className="text-xs text-muted-foreground">
                    +7% em relação a ontem
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Painel Financeiro */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
              <Card className="shadow-warm col-span-full md:col-span-4">
                <CardHeader>
                  <CardTitle>Desempenho de Vendas</CardTitle>
                  <CardDescription>
                    Análise de vendas por período
                  </CardDescription>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => toast({
                        title: "Exportar Relatório",
                        description: "Relatório exportado com sucesso!",
                      })}
                    >
                      <FileDown className="mr-1 h-3 w-3" />
                      Exportar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs"
                      onClick={() => toast({
                        title: "Filtros Aplicados",
                        description: "Os filtros foram aplicados com sucesso!",
                      })}
                    >
                      <Filter className="mr-1 h-3 w-3" />
                      Filtrar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {/* Gráfico de Vendas (Mockado) */}
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">Vendas por Mês</div>
                        <div className="text-sm text-muted-foreground">2023</div>
                      </div>
                      <div className="flex-1 flex items-end space-x-2">
                        {getSalesByMonth().map((item, index) => (
                          <div key={index} className="flex flex-col items-center flex-1">
                            <div 
                              className="w-full bg-primary rounded-t-sm" 
                              style={{ 
                                height: `${Math.max(15, (item.sales / Math.max(...getSalesByMonth().map(i => i.sales))) * 200)}px`,
                                opacity: item.sales > 0 ? 1 : 0.3
                              }}
                            />
                            <div className="text-xs mt-1">{item.month}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.sales > 0 ? `R$${item.sales.toFixed(0)}` : '-'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm col-span-full md:col-span-3">
                <CardHeader>
                  <CardTitle>Produtos Mais Vendidos</CardTitle>
                  <CardDescription>
                    Top 5 produtos com melhor desempenho
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getTopSellingProducts(5).map((product, index) => (
                      <div key={index} className="flex items-center">
                        <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {product.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {product.category}
                          </p>
                        </div>
                        <div className="font-medium">{product.sales} vendas</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mb-6">
              <Card className="shadow-warm col-span-full md:col-span-3">
                <CardHeader>
                  <CardTitle>Vendas por Categoria</CardTitle>
                  <CardDescription>
                    Distribuição de vendas por categoria de produto
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] w-full">
                    {/* Gráfico de Pizza Mockado */}
                    <div className="flex flex-col h-full">
                      <div className="flex-1 grid grid-cols-2 gap-4">
                        {getSalesByCategory().map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ 
                                backgroundColor: [
                                  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                                ][index % 6] 
                              }}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{item.category}</div>
                              <div className="text-xs text-muted-foreground">{item.sales} vendas</div>
                            </div>
                            <div className="text-sm font-medium">
                              {Math.round((item.sales / getSalesByCategory().reduce((acc, curr) => acc + curr.sales, 0)) * 100)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-warm col-span-full md:col-span-4">
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
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="store-status"
                      checked={storeOpen}
                      onCheckedChange={setStoreOpen}
                    />
                    <Label htmlFor="store-status">
                      {storeOpen ? "Loja Aberta" : "Loja Fechada"}
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
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