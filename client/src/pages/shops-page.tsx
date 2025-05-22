import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search, Store, Star, Clock, ShoppingBag, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Shop {
  id: number;
  name: string;
  description: string;
  logo?: string;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isPromoted: boolean;
  isNew: boolean;
  dealCount: number;
  categories: string[];
  createdAt: string;
}

// Мок-данные для тестирования
const mockShops: Shop[] = [
  {
    id: 1,
    name: "Digital Keys",
    description: "Лицензионные ключи для игр и программ",
    logo: "/images/shops/digital-keys.png",
    rating: 4.8,
    reviewsCount: 342,
    isVerified: true,
    isPromoted: true,
    isNew: false,
    dealCount: 1245,
    categories: ["Игры", "Программы"],
    createdAt: "2022-05-12T10:00:00Z"
  },
  {
    id: 2,
    name: "GameArt Studio",
    description: "Цифровые арты и ассеты для разработчиков игр",
    rating: 4.5,
    reviewsCount: 128,
    isVerified: true,
    isPromoted: false,
    isNew: false,
    dealCount: 567,
    categories: ["Арты", "Ассеты", "Игры"],
    createdAt: "2022-08-23T14:30:00Z"
  },
  {
    id: 3,
    name: "Code Templates",
    description: "Готовые шаблоны кода для веб-разработчиков",
    logo: "/images/shops/code-templates.png",
    rating: 4.2,
    reviewsCount: 89,
    isVerified: true,
    isPromoted: false,
    isNew: true,
    dealCount: 210,
    categories: ["Веб", "Разработка"],
    createdAt: "2023-01-05T09:15:00Z"
  },
  {
    id: 4,
    name: "Audio Masters",
    description: "Звуковые эффекты и музыка для контента",
    rating: 4.7,
    reviewsCount: 205,
    isVerified: false,
    isPromoted: false,
    isNew: false,
    dealCount: 832,
    categories: ["Аудио", "Музыка"],
    createdAt: "2022-03-18T11:45:00Z"
  },
  {
    id: 5,
    name: "Design Pro",
    description: "Профессиональные шаблоны для дизайнеров",
    logo: "/images/shops/design-pro.png",
    rating: 4.9,
    reviewsCount: 412,
    isVerified: true,
    isPromoted: true,
    isNew: false,
    dealCount: 1876,
    categories: ["Дизайн", "UI/UX"],
    createdAt: "2021-11-30T16:20:00Z"
  },
  {
    id: 6,
    name: "Video Effects",
    description: "Эффекты и переходы для видеомонтажа",
    rating: 4.4,
    reviewsCount: 156,
    isVerified: true,
    isPromoted: false,
    isNew: false,
    dealCount: 623,
    categories: ["Видео", "Эффекты"],
    createdAt: "2022-07-14T13:10:00Z"
  }
];

export default function ShopsPage() {
  const { isLoading: isAuthLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  
  // Получаем список магазинов
  const { data: shops, isLoading: isShopsLoading, error: apiError } = useQuery<Shop[]>({
    queryKey: ["/api/shops"],
    queryFn: async () => {
      // Имитируем задержку загрузки данных
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockShops;
    },
  });
  
  // Фильтрация магазинов
  const filteredShops = shops?.filter(shop => {
    // Поиск по названию или описанию
    const matchesQuery = 
      shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shop.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Фильтр по категории
    const matchesCategory = !filterCategory || shop.categories.includes(filterCategory);
    
    return matchesQuery && matchesCategory;
  }) || [];

  // Получение уникальных категорий для фильтрации
  const categories = shops?.flatMap(shop => shop.categories)
    .filter((category, index, self) => self.indexOf(category) === index) || [];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-3xl font-bold mb-6">Магазины</h1>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:max-w-md">
            <Input
              type="text"
              placeholder="Поиск магазинов..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1 w-full md:w-auto">
            <Button 
              variant={!filterCategory ? "default" : "outline"} 
              onClick={() => setFilterCategory(null)}
              className="shrink-0"
            >
              Все
            </Button>
            
            {categories.map(category => (
              <Button 
                key={category}
                variant={filterCategory === category ? "default" : "outline"}
                onClick={() => setFilterCategory(category)}
                className="shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Индикатор загрузки */}
        {isShopsLoading && (
          <div className="flex justify-center items-center h-full min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {/* Сообщение об ошибке */}
        {apiError instanceof Error && (
          <Card className="border-red-300">
            <CardContent className="text-center p-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
              <h2 className="text-xl font-semibold mb-2">Ошибка загрузки</h2>
              <p className="text-muted-foreground mb-6">
                Не удалось загрузить список магазинов. Пожалуйста, попробуйте позже.
              </p>
              <Button onClick={() => window.location.reload()}>
                Попробовать снова
              </Button>
            </CardContent>
          </Card>
        )}
        
        {/* Список магазинов */}
        {!isShopsLoading && !(apiError instanceof Error) && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredShops.map((shop) => (
                <Link key={shop.id} href={`/shops/${shop.id}`}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border border-border/50">
                    {/* Верхняя плашка с определением типа магазина */}
                    {(shop.isPromoted || shop.isNew) && (
                      <div className={`py-1 px-3 text-xs font-medium text-center text-white ${shop.isPromoted ? 'bg-amber-600' : 'bg-blue-600'} rounded-t-lg`}>
                        {shop.isPromoted && "Топ продаж"}
                        {shop.isNew && !shop.isPromoted && "Новый магазин"}
                      </div>
                    )}
                    
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <Avatar className="h-12 w-12 rounded-md">
                          <AvatarFallback className="rounded-md">
                            {shop.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                          {shop.logo && (
                            <AvatarImage src={shop.logo} alt={shop.name} />
                          )}
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <h2 className="font-bold">{shop.name}</h2>
                            {shop.isVerified && (
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {shop.description}
                          </p>
                          
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span className="text-sm">{shop.rating.toFixed(1)}</span>
                            <span className="text-xs text-muted-foreground">({shop.reviewsCount} отзывов)</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {shop.categories.map((category) => (
                          <Badge key={category} variant="outline" className="bg-accent/50">
                            {category}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex justify-between items-center mt-4 pt-3 border-t text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <ShoppingBag className="h-4 w-4" />
                          <span>Сделок: {shop.dealCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>C {new Date(shop.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Если магазинов не найдено */}
            {filteredShops.length === 0 && (
              <Card>
                <CardContent className="text-center p-12">
                  <Store className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                  <h2 className="text-xl font-semibold mb-2">Магазины не найдены</h2>
                  <p className="text-muted-foreground mb-6">
                    Попробуйте изменить параметры поиска или фильтрации
                  </p>
                  <Button onClick={() => {
                    setSearchQuery("");
                    setFilterCategory(null);
                  }}>
                    Сбросить фильтры
                  </Button>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
} 