import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/use-auth";
import { LocaleProvider } from "@/hooks/use-locale";
import { CartProvider } from "@/hooks/use-cart";
import { queryClient } from "./lib/queryClient";
import { Switch, Route, useLocation } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { FloatingCartButton } from "@/components/ui/floating-cart-button";
import { RootLayout } from "@/components/layout/root-layout";
import NotFoundPage from "@/pages/not-found-page";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import AdminPage from "@/pages/admin-page";
import CreateAccountPage from "@/pages/create-account-page";
import ProfilePage from "@/pages/profile-page";
import ComplaintsPage from "@/pages/complaints-page";
import {
  ProtectedRoute,
  StaffProtectedRoute,
  ShopOwnerProtectedRoute,
  OwnerProtectedRoute,
} from "./lib/protected-route";
import CreateShopPage from "@/pages/create-shop-page";
import ShopPage from "@/pages/shop-page";
import ShopsPage from "@/pages/shops-page";
import StaffShopPage from "@/pages/staff-shop-page";
import EditShopPage from "@/pages/edit-shop-page";
import CreateProductPage from "@/pages/create-product-page";
import ProductPage from "@/pages/product-page";
import EditProductPage from "@/pages/edit-product-page";
import ManageShopsPage from "@/pages/manage-shops-page";
import ManageProductsPage from "@/pages/manage-products-page";
import BannedNamesPage from "@/pages/banned-names-page";
import SiteSettingsPage from "@/pages/site-settings-page";
import UserProfilePage from "@/pages/user-profile-page";
import TermsPage from "@/pages/terms-page";
import PrivacyPage from "@/pages/privacy-page";
import ChatsPage from "@/pages/chats-page";
import ShopChatPage from "@/pages/shop-chat-page";
import ShopChatsPage from "@/pages/shop-chats-page";
import ShopAppealPage from "@/pages/shop-appeal-page";
import CatalogPage from "@/pages/catalog-page";
import UserEditPage from "@/pages/user-edit-page";
import NotificationsPage from "@/pages/notifications-page";
import { ThemeProvider } from "@/lib/theme-provider";

function Router() {
  return (
    <RootLayout>
      <Switch>
        {/* Public routes that anyone can access */}
        <Route path="/terms" component={TermsPage} />
        <Route path="/privacy" component={PrivacyPage} />
        <Route path="/catalog" component={CatalogPage} />
        <Route path="/shops" component={ShopsPage} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/shops/:id" component={ShopPage} />
        <Route path="/products/:id" component={ProductPage} />
        <Route path="/users/:id" component={UserProfilePage} />
        
        {/* Routes that require authentication */}
        <ProtectedRoute path="/" component={DashboardPage} />
        <ProtectedRoute path="/profile" component={ProfilePage} />
        <ProtectedRoute path="/complaints" component={ComplaintsPage} />
        <ProtectedRoute path="/chats" component={ChatsPage} />
        <ProtectedRoute path="/chats=:chatId&shop=:shopId" component={ShopChatPage} />
        <ProtectedRoute path="/notifications" component={NotificationsPage} />
        <ProtectedRoute path="/shops/:id/staff" component={StaffShopPage} />
        
        {/* Routes for shop owners and staff */}
        <ShopOwnerProtectedRoute path="/shop-appeal" component={ShopAppealPage} />
        <ShopOwnerProtectedRoute path="/shop-chats" component={ShopChatsPage} />
        <ShopOwnerProtectedRoute path="/shops/:id/edit" component={EditShopPage} />
        <ShopOwnerProtectedRoute path="/shops/:id/products/create" component={CreateProductPage} />
        <ShopOwnerProtectedRoute path="/products/:id/edit" component={EditProductPage} />
        <ShopOwnerProtectedRoute path="/manage-shops" component={ManageShopsPage} />
        <ShopOwnerProtectedRoute path="/manage-products" component={ManageProductsPage} />
        
        {/* Routes for platform staff */}
        <StaffProtectedRoute path="/admin" component={AdminPage} />
        <StaffProtectedRoute path="/create-account" component={CreateAccountPage} />
        <StaffProtectedRoute path="/banned-names" component={BannedNamesPage} />
        <StaffProtectedRoute path="/site-settings" component={SiteSettingsPage} />
        <StaffProtectedRoute path="/users/:id/edit" component={UserEditPage} />
        
        {/* Routes only for platform owners */}
        <OwnerProtectedRoute path="/create-shop" component={CreateShopPage} />
        
        {/* 404 route */}
        <Route component={NotFoundPage} />
      </Switch>
    </RootLayout>
  );
}

// Компонент с плавающей кнопкой корзины, который не отображается на странице авторизации
function FloatingCartWithLocation() {
  const [location] = useLocation();
  const isAuthPage = location === "/auth";

  if (isAuthPage) return null;

  return <FloatingCartButton />;
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LocaleProvider>
            <CartProvider>
              <Router />
              <FloatingCartWithLocation />
              <Toaster />
            </CartProvider>
          </LocaleProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
