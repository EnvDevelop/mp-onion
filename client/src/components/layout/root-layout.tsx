import { FC, ReactNode, useEffect, useState } from 'react'
import { Cart } from '@/components/ui/cart'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useLocation } from 'wouter'
import { PageTransition } from '@/components/ui/page-transition'

export interface RootLayoutProps {
  children: ReactNode
}

export const RootLayout: FC<RootLayoutProps> = ({
  children,
}) => {
  const [isMounted, setIsMounted] = useState(false)
  const [openMobileMenu, setOpenMobileMenu] = useState(false)
  const [location] = useLocation()

  // Проверяем, находимся ли мы на странице авторизации
  const isAuthPage = location === '/auth'

  useEffect(() => {
    setIsMounted(true)
    // Force dark mode
    document.documentElement.classList.add('dark')
  }, [])

  // Закрываем мобильное меню при смене маршрута
  useEffect(() => {
    setOpenMobileMenu(false);
  }, [location]);

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground dark antialiased">
      {/* Отображаем навбар только если не на странице авторизации */}
      {!isAuthPage && <Navbar />}
      
      <div className="flex flex-1 flex-col">
        {!isAuthPage && (
          <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
            <SheetTrigger asChild className="fixed top-4 left-4 z-50 md:hidden">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-sm border-border bg-background/80 backdrop-blur-sm"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] md:hidden bg-background border-border p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setOpenMobileMenu(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                    <span className="font-semibold">Меню</span>
                  </div>
                </div>
                <div className="py-4 px-2 flex-1 overflow-y-auto">
                  {/* Mobile menu content */}
                  <nav className="space-y-1">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <a href="/">Главная</a>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <a href="/catalog">Каталог</a>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <a href="/shops">Магазины</a>
                    </Button>
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <a href="/profile">Профиль</a>
                    </Button>
                  </nav>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
        
        <main className="flex-1 flex flex-col">
          <div className={`flex-1 ${isAuthPage ? '' : 'p-4 md:p-6 pt-16 md:pt-6'}`}>
            {isAuthPage ? (
              children
            ) : (
              <PageTransition>
                {children}
              </PageTransition>
            )}
          </div>
          {!isAuthPage && <Footer />}
        </main>
      </div>
      {!isAuthPage && <Cart />}
    </div>
  )
} 