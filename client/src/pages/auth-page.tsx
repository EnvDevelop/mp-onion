import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertUserSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { Loader2, Shield, AlertCircle, Lock, User as UserIcon } from "lucide-react";
import { useState, useEffect } from "react";

// Расширяем схему для формы регистрации
const extendedRegisterSchema = z
  .object({
    username: z.string().min(3, "Логин должен содержать минимум 3 символа"),
    displayName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов"),
    confirmPassword: z
      .string()
      .min(6, "Пароль должен содержать минимум 6 символов"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof extendedRegisterSchema>;

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [_, setLocation] = useLocation();
  const [loginError, setLoginError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // Эффект для задержки анимации для плавного появления карточки
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationLoaded(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Используем типизацию для формы
  const loginForm = useForm<{
    username: string;
    password: string;
  }>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: {
      username: "",
      displayName: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: any) => {
    try {
      setLoginError(null);
      await loginMutation.mutateAsync(data);
    } catch (error: any) {
      if (error.message.includes("blocked")) {
        setLoginError(error.message);
      }
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setRegisterError(null);
      // Отправляем только нужные поля без confirmPassword
      await registerMutation.mutateAsync({
        username: data.username,
        displayName: data.displayName,
        password: data.password,
      });
    } catch (error: any) {
      setRegisterError(error.message);
    }
  };

  if (user) {
    setLocation("/");
    return null;
  }

  // Классы анимации для разных элементов
  const titleFadeClass = animationLoaded ? "animate-fade-in-up" : "opacity-0";
  const cardScaleClass = animationLoaded ? "animate-scale-in" : "opacity-0 scale-95";
  const staggerItemClass = "animate-fade-in";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="absolute inset-0 bg-[url('/images/auth-bg.png')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 animate-shine"></div>
      
      <div className={`text-center mb-8 relative z-10 ${titleFadeClass}`} style={{animationDelay: "150ms"}}>
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="h-10 w-10 text-primary animate-bounce-subtle" />
          <h1 className="text-3xl font-bold">Keanone</h1>
        </div>
        <p className="text-muted-foreground animate-fade-in" style={{animationDelay: "400ms"}}>
          Маркетплейс цифровых товаров
        </p>
      </div>
      
      <Card className={`w-full max-w-md border-border relative z-10 shadow-xl bg-card/90 backdrop-blur-sm ${cardScaleClass}`}>
        <CardHeader className="space-y-1 text-center pb-6">
          <CardTitle className="text-2xl font-bold">Добро пожаловать</CardTitle>
        </CardHeader>
        
        <CardContent>
          {loginError && (
            <div className="mb-6 p-4 border border-destructive rounded-md bg-destructive/10 text-destructive animate-fade-in">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 animate-pulse-subtle" />
                <h3 className="font-bold">Ваш аккаунт был заблокирован!</h3>
              </div>
              <p className="text-sm mb-1">
                <span className="font-semibold">Причина:</span>{" "}
                {loginError.includes("Reason:")
                  ? loginError.split("Reason:")[1].split(",")[0].trim()
                  : "Нарушение правил сайта"}
              </p>
              <p className="text-sm mb-1">
                <span className="font-semibold">Дата блокировки:</span>{" "}
                {loginError.includes("Date:")
                  ? loginError.split("Date:")[1].split(",")[0].trim()
                  : new Date().toLocaleDateString()}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Время бана:</span>{" "}
                {loginError.includes("Duration:")
                  ? loginError.split("Duration:")[1].trim()
                  : "Бессрочно"}
              </p>
            </div>
          )}

          <Tabs defaultValue="login" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="text-sm font-medium">Вход</TabsTrigger>
              <TabsTrigger value="register" className="text-sm font-medium">Регистрация</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <form
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-4"
              >
                <div className={`space-y-2 ${staggerItemClass}`} style={{animationDelay: "200ms"}}>
                  <Label htmlFor="username" className="text-sm font-medium">Логин</Label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      {...loginForm.register("username")}
                      autoComplete="username"
                      className="pl-10"
                      placeholder="Введите логин"
                    />
                  </div>
                </div>
                
                <div className={`space-y-2 ${staggerItemClass}`} style={{animationDelay: "300ms"}}>
                  <Label htmlFor="password" className="text-sm font-medium">Пароль</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      {...loginForm.register("password")}
                      autoComplete="current-password"
                      className="pl-10"
                      placeholder="Введите пароль"
                    />
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className={`w-full btn-animate-hover ${staggerItemClass}`}
                  style={{animationDelay: "400ms"}}
                  disabled={loginMutation.isLoading}
                  onClick={() => {
                    if (
                      !loginMutation.isLoading &&
                      loginForm.formState.isValid
                    ) {
                      // Redirect to homepage after successful login
                      setTimeout(() => {
                        window.location.href = "/";
                      }, 500);
                    }
                  }}
                >
                  {loginMutation.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spinner" />
                  ) : null}
                  Войти
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4">
              <form
                onSubmit={registerForm.handleSubmit(handleRegister)}
                className="space-y-4"
              >
                {registerError && (
                  <div className="p-3 border border-destructive rounded-md bg-destructive/10 text-destructive text-sm animate-fade-in">
                    {registerError}
                  </div>
                )}

                <div className={`space-y-2 ${staggerItemClass}`} style={{animationDelay: "150ms"}}>
                  <Label htmlFor="reg-username" className="text-sm font-medium">Желаемый логин</Label>
                  <Input
                    id="reg-username"
                    {...registerForm.register("username")}
                    autoComplete="username"
                    placeholder="Минимум 3 символа"
                  />
                  {registerForm.formState.errors.username && (
                    <p className="text-destructive text-xs mt-1">
                      {registerForm.formState.errors.username.message}
                    </p>
                  )}
                </div>

                <div className={`space-y-2 ${staggerItemClass}`} style={{animationDelay: "250ms"}}>
                  <Label htmlFor="reg-displayName" className="text-sm font-medium">Отображаемое имя</Label>
                  <Input
                    id="reg-displayName"
                    {...registerForm.register("displayName")}
                    placeholder="Ваше имя на платформе"
                  />
                  {registerForm.formState.errors.displayName && (
                    <p className="text-destructive text-xs mt-1">
                      {registerForm.formState.errors.displayName.message}
                    </p>
                  )}
                </div>

                <div className={`space-y-2 ${staggerItemClass}`} style={{animationDelay: "350ms"}}>
                  <Label htmlFor="reg-password" className="text-sm font-medium">Пароль</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    {...registerForm.register("password")}
                    autoComplete="new-password"
                    placeholder="Минимум 6 символов"
                  />
                  {registerForm.formState.errors.password && (
                    <p className="text-destructive text-xs mt-1">
                      {registerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div className={`space-y-2 ${staggerItemClass}`} style={{animationDelay: "450ms"}}>
                  <Label htmlFor="reg-confirmPassword" className="text-sm font-medium">Повторите пароль</Label>
                  <Input
                    id="reg-confirmPassword"
                    type="password"
                    {...registerForm.register("confirmPassword")}
                    autoComplete="new-password"
                    placeholder="Повторите пароль"
                  />
                  {registerForm.formState.errors.confirmPassword && (
                    <p className="text-destructive text-xs mt-1">
                      {registerForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className={`w-full btn-animate-hover ${staggerItemClass}`}
                  style={{animationDelay: "550ms"}}
                  disabled={registerMutation.isLoading}
                >
                  {registerMutation.isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spinner" />
                  ) : null}
                  Зарегистрироваться
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="px-8 py-4 text-center border-t">
          <p className="text-xs text-muted-foreground animate-fade-in" style={{animationDelay: "650ms"}}>
            Регистрируясь, вы соглашаетесь с <a href="/terms" className="text-primary hover:underline">условиями использования</a> и <a href="/privacy" className="text-primary hover:underline">политикой конфиденциальности</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
