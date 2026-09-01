import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { supabase } from '../lib/supabaseClient';

/* ─────────────────────────────────────────────────────────────────
   CartContext
   ─────────────────────────────────────────────────────────────────
   Manages cart state globally.
   • When user is authenticated  → persists to Supabase cart_items
   • When user is a guest        → persists to localStorage
   • On login                    → guest cart is migrated to Supabase
 ──────────────────────────────────────────────────────────────── */

const CartContext = createContext(null);
const GUEST_KEY = 'autopro_guest_cart';

// ── helpers ──────────────────────────────────────────────────────

function readGuestCart() {
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeGuestCart(items) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

// ── Provider ─────────────────────────────────────────────────────

export const CartProvider = ({ children }) => {
  const [session, setSession]     = useState(null);
  const [cartItems, setCartItems] = useState([]);   // {id, product, quantidade}
  const [loading, setLoading]     = useState(true);

  // ── Session listener ─────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    );
    return () => subscription.unsubscribe();
  }, []);

  // ── Load cart whenever session changes ───────────────────────
  useEffect(() => {
    if (session) {
      fetchCartFromDB(session.user.id);
    } else {
      loadGuestCart();
    }
  }, [session]);

  // ── DB fetch ─────────────────────────────────────────────────
  const fetchCartFromDB = useCallback(async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantidade,
        product:products (
          id, categoria, titulo, status, valor, imagem
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setCartItems(data);
    }
    setLoading(false);
  }, []);

  // ── Guest cart ────────────────────────────────────────────────
  const loadGuestCart = useCallback(() => {
    setCartItems(readGuestCart());
    setLoading(false);
  }, []);

  // ── Migrate guest → DB on login ──────────────────────────────
  useEffect(() => {
    if (!session) return;
    const guest = readGuestCart();
    if (guest.length === 0) return;

    (async () => {
      for (const item of guest) {
        await supabase
          .from('cart_items')
          .upsert(
            {
              user_id:    session.user.id,
              product_id: item.product.id,
              quantidade: item.quantidade,
            },
            { onConflict: 'user_id,product_id', ignoreDuplicates: false }
          );
      }
      localStorage.removeItem(GUEST_KEY);
      fetchCartFromDB(session.user.id);
    })();
  }, [session]);

  // ── addToCart ─────────────────────────────────────────────────
  const addToCart = useCallback(async (product) => {
    if (session) {
      // Check if already in cart
      const existing = cartItems.find((i) => i.product.id === product.id);
      if (existing) {
        return updateQty(existing.id, existing.quantidade + 1);
      }
      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: session.user.id, product_id: product.id, quantidade: 1 });
      if (!error) fetchCartFromDB(session.user.id);
    } else {
      // Guest mode
      const guest = readGuestCart();
      const idx = guest.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        guest[idx].quantidade += 1;
      } else {
        guest.push({
          id: `guest-${product.id}`,
          product,
          quantidade: 1,
        });
      }
      writeGuestCart(guest);
      setCartItems([...guest]);
    }
  }, [session, cartItems]);

  // ── updateQty ─────────────────────────────────────────────────
  const updateQty = useCallback(async (cartItemId, qty) => {
    if (qty < 1) return;

    if (session) {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantidade: qty })
        .eq('id', cartItemId)
        .eq('user_id', session.user.id);
      if (!error) {
        setCartItems((prev) =>
          prev.map((i) => (i.id === cartItemId ? { ...i, quantidade: qty } : i))
        );
      }
    } else {
      const guest = readGuestCart().map((i) =>
        i.id === cartItemId ? { ...i, quantidade: qty } : i
      );
      writeGuestCart(guest);
      setCartItems([...guest]);
    }
  }, [session]);

  // ── removeFromCart ────────────────────────────────────────────
  const removeFromCart = useCallback(async (cartItemId) => {
    if (session) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId)
        .eq('user_id', session.user.id);
      if (!error) {
        setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
      }
    } else {
      const guest = readGuestCart().filter((i) => i.id !== cartItemId);
      writeGuestCart(guest);
      setCartItems([...guest]);
    }
  }, [session]);

  // ── clearCart ─────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    if (session) {
      await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', session.user.id);
    } else {
      localStorage.removeItem(GUEST_KEY);
    }
    setCartItems([]);
  }, [session]);

  // ── Derived values ────────────────────────────────────────────
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantidade, 0);
  const cartTotal = cartItems.reduce(
    (acc, i) => acc + (i.product?.valor ?? 0) * i.quantidade,
    0
  );

  const isInCart = useCallback(
    (productId) => cartItems.some((i) => i.product?.id === productId),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        loading,
        isInCart,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        session,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};
