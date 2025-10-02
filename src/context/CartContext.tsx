// src/context/CartContext.tsx
import { createContext, useContext, useState } from "react";

type CartContextType = {
  hasNewItem: boolean;
  setHasNewItem: (value: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasNewItem, setHasNewItem] = useState(false);

  return (
    <CartContext.Provider value={{ hasNewItem, setHasNewItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve estar dentro do CartProvider");
  return ctx;
};
