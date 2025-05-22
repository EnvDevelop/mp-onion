import { Link } from "wouter";
import { 
  MessageCircle, Bell, User, Shield, Menu, 
  ShoppingBag, MessageSquare, LayoutGrid, Users, BookOpen, ScrollText,
  LogOut, Package, Settings, Home, Store, UserPlus, Flag, CheckCircle,
  AlertTriangle, CreditCard, Plus, LayoutDashboard, Star
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { UserRole } from "@shared/schema";
import { useLocation } from "wouter";
import { LanguageToggle } from "@/components/ui/language-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  // Больше не нужен после удаления боковой панели
}

export function Navbar(props: NavbarProps) {
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();

  // Правильные проверки ролей
  const hasAdminAccess = user && (
    user.role === UserRole.OWNER ||
    user.role === UserRole.SECURITY ||
    user.role === UserRole.HEADADMIN ||
    user.role === UserRole.ADMIN
  );

  const hasFullAccess = user && (
    user.role === UserRole.OWNER ||
    user.role === UserRole.SECURITY
  );

  const isStaff = user?.role !== UserRole.USER;
  
  // Проверка для владельцев и сотрудников магазинов
  const isShopRelated = user && (
    user.role === UserRole.SHOP_OWNER || 
    user.role === UserRole.SHOP_MAIN || 
    user.role === UserRole.SHOP_STAFF
  );
  
  const isShopOwner = user && (
    user.role === UserRole.SHOP_OWNER || 
    user.role === UserRole.SHOP_MAIN
  );

  // Запрос количества непрочитанных уведомлений и сообщений
  const { data: notificationCounts = { 
    chats: 0,
    notifications: 0,
    complaints: 0,
    shopComplaints: 0,
    shopChats: 0
  } } = useQuery({
    queryKey: ["navbar-notifications", user?.id],
    queryFn: async () => {
      if (!user) return { chats: 0, notifications: 0, complaints: 0, shopComplaints: 0, shopChats: 0 };
      try {
        const res = await apiRequest("GET", "/api/notifications/counts");
        return res.json();
      } catch (error) {
        console.error("Failed to fetch notification counts:", error);
        return { chats: 0, notifications: 0, complaints: 0, shopComplaints: 0, shopChats: 0 };
      }
    },
    enabled: !!user,
    refetchInterval: 15000, // Обновление каждые 15 секунд
  });

  // Уведомления (калькуляция)
  const mainNotifications = notificationCounts.complaints + notificationCounts.chats;
  const shopNotifications = notificationCounts.shopComplaints + notificationCounts.shopChats;
  const adminNotifications = hasAdminAccess ? (mainNotifications + shopNotifications) : 0;

  return (
    <div className="border-b bg-background shadow-sm animate-fade-in">
      {/* Верхняя панель с логотипом и иконками */}
      <div className="h-16 flex items-center justify-between px-6 max-w-screen-2xl mx-auto">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <div className="flex items-center space-x-3 hover:opacity-90 transition-opacity group">
              <Shield className="h-8 w-8 text-primary group-hover:animate-pulse-subtle" />
              <span className="font-bold text-xl">Keanone</span>
            </div>
          </Link>
        </div>

        {/* Отображение текста */}
        <div className="hidden md:flex items-center text-sm font-medium text-muted-foreground">
          <span className="animate-fade-in">Marketplace Platform</span>
        </div>

        {/* Навигационные кнопки справа */}
        <div className="flex items-center space-x-5">
          {/* Тема и язык */}
          <div className="hidden md:flex items-center space-x-3">
            <LanguageToggle />
          </div>

          {/* Корзина */}
          <Link href="/cart">
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-accent/50 transition-colors btn-animate-hover">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </Link>

          {/* Кнопка сообщений */}
          <Link href="/chats">
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-accent/50 transition-colors btn-animate-hover">
              <MessageCircle className="h-5 w-5" />
              {notificationCounts.chats > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                  {notificationCounts.chats}
                </Badge>
              )}
            </div>
          </Link>

          {/* Кнопка уведомлений */}
          <Link href="/notifications">
            <div className="relative cursor-pointer p-2 rounded-full hover:bg-accent/50 transition-colors btn-animate-hover">
              <Bell className="h-5 w-5" />
              {notificationCounts.notifications > 0 && (
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                  {notificationCounts.notifications}
                </Badge>
              )}
            </div>
          </Link>

          {/* Профиль (с дропдауном) */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer rounded-full overflow-hidden border-2 border-transparent hover:border-primary/30 transition-all">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {user?.username?.charAt(0).toUpperCase() || <User className="h-4 w-4" />}
                  </AvatarFallback>
                  {user?.avatarUrl && (
                    <AvatarImage src={user.avatarUrl} alt={user.username} />
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-1 p-1 rounded-lg border border-border shadow-lg animate-scale-in">
              <DropdownMenuLabel className="px-3 py-2">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {user?.username?.charAt(0).toUpperCase() || ""}
                    </AvatarFallback>
                    {user?.avatarUrl && <AvatarImage src={user.avatarUrl} />}
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user?.displayName || user?.username}</p>
                    <p className="text-xs text-muted-foreground font-medium">
                      {user?.role && formatRole(user.role)}
                      {user?.role === "SHOP_OWNER" && user?.shopName && (<> • {user.shopName}</>)}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <Link href="/profile">
                <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                  <User className="mr-2 h-4 w-4" />
                  <span>Профиль</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/settings">
                <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Настройки</span>
                </DropdownMenuItem>
              </Link>
              {user?.role === UserRole.OWNER && (
                <>
                  <Link href="/banned-names">
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      <span>Бан-лист</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/site-settings">
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Настройки сайта</span>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem onClick={() => logoutMutation.mutate()} 
                className="cursor-pointer rounded-md px-3 py-2 hover:bg-destructive/10 text-destructive hover:text-destructive transition-colors stagger-item">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Выйти</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Нижняя панель с основной навигацией */}
      <div className="bg-accent/5 border-t border-border shadow-inner">
        <div className="max-w-screen-2xl mx-auto flex items-center overflow-x-auto py-1 px-4">
          <Link href="/catalog">
            <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
              <LayoutGrid className="h-4 w-4 mr-2 text-primary/80" />
              Каталог
            </Button>
          </Link>
          <Link href="/shops">
            <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
              <ShoppingBag className="h-4 w-4 mr-2 text-primary/80" />
              Магазины
            </Button>
          </Link>
          <Link href="/chats">
            <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
              <MessageCircle className="h-4 w-4 mr-2 text-primary/80" />
              Чаты
              {notificationCounts.chats > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                  {notificationCounts.chats}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/complaints">
            <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
              <ScrollText className="h-4 w-4 mr-2 text-primary/80" />
              Обращения
              {notificationCounts.complaints > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                  {notificationCounts.complaints}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/orders">
            <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
              <Package className="h-4 w-4 mr-2 text-primary/80" />
              Заказы
            </Button>
          </Link>
          
          {/* Администрация */}
          {hasAdminAccess && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
                  <Shield className="h-4 w-4 mr-2 text-primary/80" />
                  Администрация
                  {adminNotifications > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                      {adminNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-1 p-1 rounded-lg border border-border bg-popover shadow-lg animate-scale-in">
                <Link href="/admin">
                  <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                    <LayoutDashboard className="mr-2 h-4 w-4 text-primary/80" />
                    <span>Админ-панель</span>
                  </DropdownMenuItem>
                </Link>
                {hasFullAccess && (
                  <Link href="/create-account">
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <UserPlus className="mr-2 h-4 w-4 text-primary/80" />
                      <span>Создать аккаунт</span>
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {/* Магазины меню (для владельцев и связанных с магазинами) */}
          {(isStaff || isShopRelated) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-4 py-2 rounded-md h-10 text-sm font-medium hover:bg-accent/30 hover:text-primary transition-colors btn-animate-hover">
                  <Store className="h-4 w-4 mr-2 text-primary/80" />
                  Управление
                  {shopNotifications > 0 && (
                    <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                      {shopNotifications}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-1 p-1 rounded-lg border border-border bg-popover shadow-lg animate-scale-in">
                <Link href="/manage-shops">
                  <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                    <Store className="mr-2 h-4 w-4 text-primary/80" />
                    <span>Магазины</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/manage-products">
                  <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                    <Package className="mr-2 h-4 w-4 text-primary/80" />
                    <span>Товары</span>
                  </DropdownMenuItem>
                </Link>
                
                {/* Создание магазина (только для OWNER, SECURITY) */}
                {hasFullAccess && (
                  <Link href="/create-shop">
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <Plus className="mr-2 h-4 w-4 text-primary/80" />
                      <span>Создать магазин</span>
                    </DropdownMenuItem>
                  </Link>
                )}
                
                {/* Сотрудники магазина */}
                {isShopRelated && user && 'shopId' in user && user.shopId && (
                  <Link href={`/shops/${user.shopId}/staff`}>
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <Users className="mr-2 h-4 w-4 text-primary/80" />
                      <span>Сотрудники магазина</span>
                    </DropdownMenuItem>
                  </Link>
                )}
                
                {/* Обращения в магазин */}
                {isShopOwner && (
                  <Link href="/shop-appeal">
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <MessageSquare className="mr-2 h-4 w-4 text-primary/80" />
                      <span>Обращения в магазин</span>
                      {notificationCounts.shopComplaints > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                          {notificationCounts.shopComplaints}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </Link>
                )}
                
                {/* Чаты магазина */}
                {isShopRelated && (
                  <Link href="/shop-chats">
                    <DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 hover:bg-accent/50 transition-colors stagger-item">
                      <MessageCircle className="mr-2 h-4 w-4 text-primary/80" />
                      <span>Чаты с клиентами</span>
                      {notificationCounts.shopChats > 0 && (
                        <Badge variant="destructive" className="ml-2 h-5 min-w-5 flex items-center justify-center px-1 py-0 text-xs animate-border-pulse">
                          {notificationCounts.shopChats}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

// Функция форматирования роли для более читабельного отображения
function formatRole(role: string): string {
  switch (role) {
    case 'OWNER': return 'Владелец';
    case 'SECURITY': return 'Безопасность';
    case 'ADMIN': return 'Администратор';
    case 'HEADADMIN': return 'Главный админ';
    case 'MODERATOR': return 'Модератор';
    case 'SHOP_OWNER': return 'Владелец магазина';
    case 'SHOP_MAIN': return 'Управляющий';
    case 'SHOP_STAFF': return 'Сотрудник магазина';
    case 'USER': return 'Пользователь';
    default: return role;
  }
} 