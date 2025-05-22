import { useState, useEffect, useRef } from "react";
import { useRoute, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Loader2, ArrowLeft, Store, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShopChat } from "@/components/shop/shop-chat";
import { ShopChat as ShopChatType, User, ShopChatMessage, ChatMessageType, UserRole } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

export default function ShopChatPage() {
  const [, params] = useRoute<{ chatId: string, shopId: string }>("/chats=:chatId&shop=:shopId");
  const { user, isLoading: isAuthLoading } = useAuth();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localMessages, setLocalMessages] = useState<ShopChatMessage[]>([]);
  const [userCache, setUserCache] = useState<Record<number, User>>({});
  const [shopStaffJoined, setShopStaffJoined] = useState<Set<number>>(new Set());
  
  if (!params) return null;
  const chatId = parseInt(params.chatId);
  const shopId = parseInt(params.shopId);
  
  // Получаем информацию о чате, используя оба параметра - chatId и shopId
  const { data: chat, isLoading: isChatLoading } = useQuery<ShopChatType & { shopName: string }>({
    queryKey: [`/api/shop-chats/${chatId}`, shopId],
    queryFn: async () => {
      const response = await fetch(`/api/shop-chats/${chatId}?shopId=${shopId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch chat");
      }
      return response.json();
    },
    enabled: !!user && chatId > 0 && shopId > 0,
  });
  
  // Получаем сообщения чата с учетом параметра shopId
  const { data: messages = [], isLoading: isMessagesLoading } = useQuery<ShopChatMessage[]>({
    queryKey: [`/api/shop-chats/${chatId}/messages`, shopId],
    queryFn: async () => {
      const response = await fetch(`/api/shop-chats/${chatId}/messages?shopId=${shopId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch messages");
      }
      return response.json();
    },
    refetchInterval: 5000, // Обновляем каждые 5 секунд, если WebSocket недоступен
    enabled: !!user && chatId > 0 && shopId > 0,
  });

  // Обновляем локальные сообщения при получении новых с сервера
  useEffect(() => {
    if (messages && messages.length > 0) {
      setLocalMessages(messages);
    }
  }, [messages]);
  
  // Скролл к последнему сообщению
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [localMessages]);
  
  // Настраиваем WebSocket подключение для чата
  useEffect(() => {
    if (!user) return;
    
    // URL для WebSocket подключения (используем текущий хост)
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/ws/shop-chats`;
    
    // Создаем WebSocket соединение
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;
    
    socket.onopen = () => {
      console.log('WebSocket connected for shop chat');
      setIsConnected(true);
      
      // Отправляем аутентификационные данные
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
          type: 'auth',
          userId: user.id,
          chatId: chatId
        }));
      }
    };
    
    // Обработчик входящих сообщений
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Обрабатываем новые сообщения
        if (data.type === 'new_message' && data.chatId === chatId && data.message) {
          console.log('Received new message via WebSocket:', data.message);
          
          // Добавляем новое сообщение к локальным сообщениям
          setLocalMessages(prev => [...prev, data.message]);
          
          // Проверяем, нужно ли получать информацию о новом пользователе
          if (data.message.senderId && !userCache[data.message.senderId]) {
            getUserInfo(data.message.senderId);
          }
          
          // Проверяем, является ли отправитель сотрудником магазина
          if (data.senderInfo && 
              (data.senderInfo.role === UserRole.SHOP_OWNER || 
               data.senderInfo.role === UserRole.SHOP_MAIN || 
               data.senderInfo.role === UserRole.SHOP_STAFF) && 
              !shopStaffJoined.has(data.message.senderId)) {
            
            setShopStaffJoined(prev => {
              const newSet = new Set(prev);
              newSet.add(data.message.senderId);
              return newSet;
            });
          }
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
      toast({
        title: "Ошибка соединения",
        description: "Не удалось подключиться к серверу сообщений. Используется режим с периодическим обновлением.",
        variant: "destructive"
      });
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
      setIsConnected(false);
    };
    
    // Закрываем соединение при размонтировании компонента
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [chatId, user, toast]);
  
  // Функция для получения информации о пользователе по ID
  const getUserInfo = async (userId: number) => {
    // Если пользователь уже в кэше, возвращаем его
    if (userCache[userId]) {
      return userCache[userId];
    }

    // Если это текущий пользователь, возвращаем его
    if (user && userId === user.id) {
      setUserCache(prev => ({ ...prev, [userId]: user }));
      return user;
    }

    try {
      // Иначе запрашиваем информацию о пользователе с сервера
      const response = await fetch(`/api/users/${userId}`, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      const userData = await response.json();
      // Сохраняем пользователя в кэш
      setUserCache(prev => ({ ...prev, [userId]: userData }));
      return userData;
    } catch (error) {
      console.error("Error fetching user info:", error);
      // Возвращаем заглушку, если не удалось получить информацию
      return { 
        username: "Пользователь", 
        avatarUrl: "", 
        role: "USER", 
        isVerified: false,
        isPremium: false,
        displayName: "Неизвестный пользователь"
      };
    }
  };
  
  // Функция для получения информации о пользователях
  useEffect(() => {
    if (!user || !messages || messages.length === 0) return;
    
    const loadUserInfo = async () => {
      // Загружаем информацию о пользователях из сообщений
      const userIds = Array.from(new Set(messages.map(msg => msg.senderId).filter(id => id !== 0 && id !== null)));
      for (const userId of userIds) {
        if (userId && !userCache[userId]) {
          const userInfo = await getUserInfo(userId);
          
          // Проверяем, является ли пользователь сотрудником магазина
          // и проверяем, был ли сотрудник уже отмечен как присоединившийся
          if ((userInfo.role === UserRole.SHOP_OWNER || 
              userInfo.role === UserRole.SHOP_MAIN || 
              userInfo.role === UserRole.SHOP_STAFF) && 
              !shopStaffJoined.has(userId)) {
            
            // Находим первое сообщение этого сотрудника
            const firstMessageIndex = messages.findIndex(msg => msg.senderId === userId);
            if (firstMessageIndex >= 0) {
              setShopStaffJoined(prev => {
                const newSet = new Set(prev);
                newSet.add(userId);
                return newSet;
              });
            }
          }
        }
      }
    };
    
    loadUserInfo();
  }, [messages, userCache, user]);
  
  // Мутация для отправки сообщения
  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      const res = await fetch(`/api/shop-chats/${chatId}/messages?shopId=${shopId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: text, shopId })
      });
      
      if (!res.ok) {
        throw new Error("Failed to send message");
      }
      
      return res.json();
    },
    onSuccess: (newMessage) => {
      // Добавляем новое сообщение локально для мгновенного отображения
      setLocalMessages(prev => [...prev, newMessage]);
      
      // Очищаем поле ввода
      setMessage("");
    },
    onError: (error) => {
      toast({
        title: "Ошибка отправки",
        description: "Не удалось отправить сообщение. Пожалуйста, попробуйте снова.",
        variant: "destructive"
      });
      console.error("Error sending message:", error);
    }
  });
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthLoading && !user) {
    window.location.href = "/auth";
    return null;
  }
  
  // Если данные загружаются, показываем индикатор загрузки
  if (isAuthLoading || isChatLoading) {
    return (
      <div className="flex justify-center items-center h-full bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }
  
  // Проверяем доступ к чату
  const hasAccess = user && (
    // Пользователь является участником чата
    (chat && chat.userId === user.id) ||
    // Или пользователь является сотрудником магазина (это проверяется на сервере)
    true // Упрощенная проверка, основная проверка на сервере
  );
  
  if (!hasAccess) {
    return (
      <div className="max-w-3xl mx-auto text-center text-white bg-black h-full flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4">Доступ запрещен</h1>
        <p className="text-gray-400 mb-6">
          У вас нет доступа к этому чату
        </p>
        <Button asChild variant="outline" className="text-white border-white/20 hover:bg-white/10">
          <Link href="/">Вернуться на главную</Link>
        </Button>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };
  
  // Функция для определения роли пользователя в читаемом формате
  const getRoleDisplayName = (role: string) => {
    switch(role) {
      case UserRole.SHOP_OWNER: return "Владелец магазина";
      case UserRole.SHOP_MAIN: return "Управляющий магазина";
      case UserRole.SHOP_STAFF: return "Сотрудник магазина";
      default: return "Сотрудник магазина";
    }
  };
  
  // Рендерим сообщение
  const renderMessage = (msg: ShopChatMessage, index: number) => {
    const sender = msg.senderId ? userCache[msg.senderId] : null;
    const isCurrentUser = user && msg.senderId && user.id === msg.senderId;
    
    // Если нет информации об отправителе, показываем загрузку
    if (!sender && msg.senderId !== 0 && msg.senderId !== null) {
      return (
        <div key={index} className="flex items-center justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
        </div>
      );
    }
    
    // Для системных сообщений
    if (msg.senderType === ChatMessageType.SYSTEM || msg.senderId === 0 || msg.senderId === null) {
      return (
        <div key={index} className="text-center text-sm text-gray-500 py-1">
          <p className="bg-gray-900/50 px-4 py-1 rounded-full inline-block">
            {msg.message}
          </p>
        </div>
      );
    }
    
    // Проверяем, должны ли мы показать уведомление о входе сотрудника магазина перед этим сообщением
    const showStaffJoinedMessage = sender && (
      (sender.role === UserRole.SHOP_OWNER || 
       sender.role === UserRole.SHOP_MAIN || 
       sender.role === UserRole.SHOP_STAFF)
    ) && messages.findIndex(m => m.senderId === msg.senderId) === index;
    
    // Обычное сообщение от пользователя или магазина
    return (
      <>
        {/* Показываем уведомление о присоединении, если это первое сообщение от сотрудника */}
        {showStaffJoinedMessage && sender && (
          <div key={`staff-join-${msg.senderId}`} className="text-center text-sm text-gray-500 py-1">
            <p className="bg-gray-900/50 px-4 py-1 rounded-full inline-block">
              {getRoleDisplayName(sender.role)} {sender.displayName || sender.username} вошёл в чат
            </p>
          </div>
        )}
        
        {/* Сообщение */}
        <div 
          key={index} 
          className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2`}>
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={sender?.avatarUrl || ""} />
              <AvatarFallback className="bg-gray-800 text-white">
                {(sender?.displayName || sender?.username || "?").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className={`rounded-lg px-3 py-2 ${isCurrentUser ? 'bg-blue-600 text-white' : 'bg-gray-800 text-white'}`}>
              <div className="text-xs text-gray-300 mb-1">
                {sender?.displayName || sender?.username}
              </div>
              <div>{msg.message}</div>
            </div>
          </div>
        </div>
      </>
    );
  };
  
  // Определяем, было ли уже показано системное сообщение о создании чата
  const hasChatCreatedMessage = localMessages.some(
    msg => (msg.senderType === ChatMessageType.SYSTEM || msg.senderId === 0 || msg.senderId === null) && 
           msg.message && msg.message.includes("Чат создан")
  );

  return (
    <div className="flex flex-col h-full bg-black text-white">
      {/* Заголовок с информацией о чате */}
      <div className="border-b border-gray-800 flex items-center justify-between px-6 py-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8 text-white hover:bg-gray-800">
            <Link href="/chats">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8 border-2 border-gray-700">
              <AvatarFallback className="bg-gray-800 text-white">
                {chat?.shopName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold">{chat?.shopName}</h1>
              <p className="text-xs text-gray-400">
                {isConnected ? "Онлайн" : "Режим обновления"}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white border-gray-700 hover:bg-gray-800"
            onClick={() => window.location.href = `/shops/${shopId}`}
          >
            Профиль магазина
          </Button>
        </div>
      </div>
      
      {/* Область сообщений */}
      <div className="flex-1 bg-black overflow-y-auto px-4 py-2">
        <div className="max-w-4xl mx-auto space-y-2">
          {/* Системное сообщение о создании чата, только если его еще нет среди системных сообщений */}
          {!hasChatCreatedMessage && localMessages.length > 0 && (
            <div className="text-center text-sm text-gray-500 py-1">
              <p>Чат создан. Вы можете начать общение с магазином.</p>
            </div>
          )}
          
          {/* Сообщения */}
          {isMessagesLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
            </div>
          ) : (
            localMessages.map((msg, index) => renderMessage(msg, index))
          )}
          
          {/* Элемент для автоскролла */}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Панель ввода сообщения */}
      <div className="border-t border-gray-800 p-3">
        <div className="max-w-screen-lg mx-auto flex gap-2 relative">
          <Input 
            placeholder="Введите сообщение..." 
            className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={sendMessageMutation.isLoading}
          />
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isLoading}
          >
            {sendMessageMutation.isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Отправить"
            )}
          </Button>
          <div className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-500">
            <Send 
              className={`h-4 w-4 cursor-pointer ${sendMessageMutation.isLoading ? 'text-gray-700' : 'hover:text-white'}`} 
              onClick={handleSendMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 