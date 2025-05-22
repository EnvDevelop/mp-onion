import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "wouter";

interface PageTransitionProps {
  children: ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  // Анимация при маунте компонента
  useEffect(() => {
    setIsVisible(true);
    return () => setIsVisible(false);
  }, [location]);

  // Варианты анимации для страниц
  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="min-h-[calc(100vh-80px)]"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
} 