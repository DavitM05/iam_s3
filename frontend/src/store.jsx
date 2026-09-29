import { createContext, useContext, useEffect, useState } from "react";

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

const load = (k, d) => {
  try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; }
};

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => load("cart", []));
  const [auth, setAuth] = useState(() => load("auth", null)); // { token, user }

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("auth", JSON.stringify(auth)), [auth]);

  const addToCart = (p) =>
    setCart((c) => {
      const line = c.find((l) => l.id === p.id);
      if (line) return c.map((l) => (l.id === p.id ? { ...l, qty: Math.min(l.qty + 1, 10) } : l));
      return [...c, { id: p.id, name: p.name, price: Number(p.price), brand: p.brand, storage: p.storage, qty: 1 }];
    });
  const setQty = (id, qty) => setCart((c) => (qty < 1 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, 10) } : l))));
  const clearCart = () => setCart([]);
  const total = cart.reduce((s, l) => s + l.price * l.qty, 0);
  const count = cart.reduce((s, l) => s + l.qty, 0);

  return (
    <Ctx.Provider value={{ cart, addToCart, setQty, clearCart, total, count, auth, setAuth, logout: () => setAuth(null) }}>
      {children}
    </Ctx.Provider>
  );
}
