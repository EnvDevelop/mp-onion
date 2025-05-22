import { Link } from "wouter";
import { Shield, Github, Heart, MessageCircle, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-accent/5 animate-fade-in" style={{animationDelay: "600ms"}}>
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 group">
              <Shield className="h-5 w-5 text-primary group-hover:animate-pulse-subtle" />
              <span className="font-bold">Keanone</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Маркетплейс цифровых товаров и услуг с широким выбором предложений и безопасными сделками.
            </p>
            <div className="flex space-x-4 pt-2">
              <a 
                href="https://t.me/KeanoneSupportRobot" 
                className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200"
                aria-label="Telegram Bot"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/KeanoneProject" 
                className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200"
                aria-label="Telegram Channel"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://k-connect.ru/profile/keanone" 
                className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200"
                aria-label="K-connect"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://github.com/fakeallanyway/Keanone-Info/blob/main/README.md" 
                className="text-muted-foreground hover:text-primary transition-colors transform hover:scale-110 duration-200"
                aria-label="Github"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase mb-4">Платформа</h3>
            <ul className="space-y-2">
              <li className="stagger-item">
                <Link href="/catalog">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Каталог товаров
                  </a>
                </Link>
              </li>
              <li className="stagger-item">
                <Link href="/shops">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Магазины
                  </a>
                </Link>
              </li>
              <li className="stagger-item">
                <Link href="/complaints">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Служба поддержки
                  </a>
                </Link>
              </li>
              <li className="stagger-item">
                <Link href="/faq">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Частые вопросы
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase mb-4">Информация</h3>
            <ul className="space-y-2">
              <li className="stagger-item">
                <Link href="/about">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    О нас
                  </a>
                </Link>
              </li>
              <li className="stagger-item">
                <Link href="/terms">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Условия использования
                  </a>
                </Link>
              </li>
              <li className="stagger-item">
                <Link href="/privacy">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Политика конфиденциальности
                  </a>
                </Link>
              </li>
              <li className="stagger-item">
                <Link href="/contacts">
                  <a className="text-sm text-muted-foreground hover:text-primary transition-colors btn-animate-hover inline-block">
                    Контакты
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm tracking-wider uppercase mb-4">Связь с нами</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground stagger-item">
                Email: <a href="mailto:support@keanone.com" className="hover:text-primary transition-colors">support@keanone.com</a>
              </li>
              <li className="text-sm text-muted-foreground stagger-item">
                Телефон: <a href="https://t.me/KeanoneSupportRobot" className="hover:text-primary transition-colors">Техническая поддержка платформы</a>
              </li>
              <li className="text-sm text-muted-foreground stagger-item">
                Мы работаем 24/7!
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Keanone. Все права защищены.
          </p>
          <p className="text-xs text-muted-foreground mt-2 md:mt-0 flex items-center animate-fade-in" style={{animationDelay: "800ms"}}>
            Сделано с <Heart className="h-3 w-3 mx-1 text-destructive animate-pulse-subtle" /> в России
          </p>
        </div>
      </div>
    </footer>
  );
} 