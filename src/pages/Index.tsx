import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Star, Award, ChefHat, Utensils, Sparkles, ArrowRight, Menu, User, UserCog, ShieldCheck, Flame, Heart } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import heroOven from '@/assets/hero-oven.jpg';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-sans">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <div className="flex items-center">
                <Flame className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-2xl font-bold text-primary tracking-tight">La Fornata</h1>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Cardápio</Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Sobre Nós</Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">Contato</Button>
              <Button variant="outline" className="rounded-full border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Phone className="h-4 w-4 mr-2" />
                (11) 99999-9999
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="rounded-full bg-primary hover:bg-primary/90">
                    <Menu className="h-4 w-4 mr-2" />
                    Acessar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuItem onClick={() => navigate('/customer')} className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span>Sou Cliente</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/staff')} className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <UserCog className="h-4 w-4 mr-2 text-secondary" />
                    <span>Sou Colaborador</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <ShieldCheck className="h-4 w-4 mr-2 text-earth" />
                    <span>Sou Gestor</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {/* Mobile Menu */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuItem className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <span>Cardápio</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <span>Sobre Nós</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <span>Contato</span>
                  </DropdownMenuItem>
                  <Separator className="my-2" />
                  <DropdownMenuItem onClick={() => navigate('/customer')} className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    <span>Sou Cliente</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/staff')} className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <UserCog className="h-4 w-4 mr-2 text-secondary" />
                    <span>Sou Colaborador</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin')} className="cursor-pointer flex items-center p-3 hover:bg-muted">
                    <ShieldCheck className="h-4 w-4 mr-2 text-earth" />
                    <span>Sou Gestor</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center filter brightness-[0.85]"
          style={{ backgroundImage: `url(${heroOven})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 to-background/95" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 flex flex-col md:flex-row items-center">
          <div className="md:w-3/5 text-left md:pr-12 animate-fade-in">
            <Badge className="mb-6 bg-accent/30 text-earth px-4 py-1.5 text-sm rounded-full">
              <Flame className="h-4 w-4 mr-2 animate-flame-flicker" />
              Sabor autêntico direto do nosso forno
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
              Sabores Artesanais
              <span className="text-primary block">Com Tradição Italiana</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Criamos nossas massas com amor e dedicação, usando técnicas tradicionais e ingredientes selecionados para uma experiência gastronômica inesquecível
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                className="text-base px-8 py-6 bg-primary hover:bg-primary/90 rounded-full group shadow-fire"
                onClick={() => navigate('/customer')}
              >
                Fazer Pedido Agora
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="text-base px-8 py-6 rounded-full border-2 hover:bg-background/50"
              >
                Ver Cardápio
              </Button>
            </div>
          </div>
          
          {/* Features Box */}
          <div className="md:w-3/5 mt-12 md:mt-0 animate-fade-in">
            <Card className="shadow-warm border-0 rounded-2xl overflow-hidden h-full">
              <div className="h-2 bg-gradient-fire w-full"></div>
              <CardHeader className="text-center pb-4 pt-10">
                <div className="w-20 h-20 bg-gradient-fire rounded-full flex items-center justify-center mx-auto mb-6 animate-warm-pulse">
                  <Heart className="h-10 w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-primary text-2xl font-bold mb-2">Nossa Paixão</CardTitle>
                <CardDescription className="text-muted-foreground text-base">Criamos com amor e dedicação</CardDescription>
              </CardHeader>
              <CardContent className="pb-10">
                <div className="space-y-8">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mr-5">
                      <ChefHat className="h-6 w-6 text-earth" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Feito à Mão</h4>
                      <p className="text-muted-foreground">Pratos frescos diariamente</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mr-5">
                      <Utensils className="h-6 w-6 text-earth" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Ingredientes Premium</h4>
                      <p className="text-muted-foreground">Selecionados com cuidado</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-accent/30 flex items-center justify-center mr-5">
                      <Flame className="h-6 w-6 text-earth" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Forno Tradicional</h4>
                      <p className="text-muted-foreground">Sabor autêntico italiano</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Nossa História Section */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-accent/30 text-earth px-4 py-1.5 text-sm rounded-full inline-flex items-center">
              <Sparkles className="h-4 w-4 mr-2" />
              Nossa História
            </Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
              Nossa História
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Nascemos do amor pela culinária italiana e da paixão por criar pratos artesanais perfeitos
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-warm hover:shadow-fire transition-all duration-300 group border-0 bg-background/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="h-2 bg-gradient-fire w-full"></div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="w-16 h-16 bg-gradient-fire rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-primary text-xl font-bold">Nossa Paixão</CardTitle>
                <CardDescription className="text-muted-foreground">Criamos cada prato com dedicação e amor pela culinária italiana tradicional</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Desde 2019, mantemos viva a tradição dos pratos artesanais italianos</p>
              </CardContent>
            </Card>

            <Card className="shadow-warm hover:shadow-fire transition-all duration-300 group border-0 bg-background/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="h-2 bg-gradient-warm w-full"></div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="w-16 h-16 bg-gradient-warm rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Utensils className="h-8 w-8 text-earth" />
                </div>
                <CardTitle className="text-secondary text-xl font-bold">Nosso Processo</CardTitle>
                <CardDescription className="text-muted-foreground">Ingredientes selecionados e técnicas tradicionais para pratos perfeitos</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Cada prato é preparado diariamente, garantindo frescor e sabor incomparáveis</p>
              </CardContent>
            </Card>

            <Card className="shadow-warm hover:shadow-fire transition-all duration-300 group border-0 bg-background/70 backdrop-blur-sm rounded-2xl overflow-hidden">
              <div className="h-2 bg-gradient-gold w-full"></div>
              <CardHeader className="text-center pb-4 pt-8">
                <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Award className="h-8 w-8 text-earth" />
                </div>
                <CardTitle className="text-earth text-xl font-bold">Nosso Compromisso</CardTitle>
                <CardDescription className="text-muted-foreground">Qualidade e autenticidade em cada prato que servimos</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">Buscamos proporcionar uma experiência gastronômica autêntica e memorável</p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-16 text-center">
            <Card className="shadow-warm border-0 bg-background/70 backdrop-blur-sm rounded-2xl overflow-hidden max-w-3xl mx-auto">
              <div className="h-2 bg-gradient-fire w-full"></div>
              <CardContent className="p-8">
                <Button 
                  size="lg" 
                  className="text-base px-8 py-6 bg-primary hover:bg-primary/90 rounded-full group shadow-fire"
                  onClick={() => navigate('/customer')}
                >
                  Experimente Nossos Pratos
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-8 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Flame className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-2xl font-bold text-primary tracking-tight">Sabores Artesanais</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Sabor autêntico direto do nosso forno. Pratos artesanais e molhos tradicionais preparados com amor e dedicação desde 2019.
              </p>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Cardápio</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="hover:text-primary transition-colors"><a href="#">Lasanhas</a></li>
                <li className="hover:text-primary transition-colors"><a href="#">Molhos</a></li>
                <li className="hover:text-primary transition-colors"><a href="#">Refrigerantes</a></li>
              </ul>
            </div>
            
            <div className="col-span-1">
              <h4 className="font-semibold text-foreground mb-4 text-lg">Contato</h4>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <span>(11) 99999-9999</span>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 mr-3 text-primary mt-0.5" />
                  <span>Rua dos Sabores, 123<br />Codó-MA</span>
                </div>
              </div>
            </div>
          </div>
          
          <Separator className="mb-8 bg-border/50" />
          
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© 2025 La Fornata. Todos os direitos reservados.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition-colors">Instagram</a>
              <a href="#" className="hover:text-primary transition-colors">Facebook</a>
              <a href="#" className="hover:text-primary transition-colors">Twitter</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
