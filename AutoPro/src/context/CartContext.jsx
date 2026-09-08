import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { supabase } from '../lib/supabaseClient';
import { PRODUCT_SELECT } from '../lib/products';

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
    const items = JSON.parse(localStorage.getItem(GUEST_KEY) || '[]');
    return Array.isArray(items) ? items.filter(i => i.product?.seller_id && i.product?.ativo && Number.isInteger(i.quantidade) && i.quantidade > 0) : [];
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

  // ── DB fetch ─────────────────────────────────────────────────
  const fetchCartFromDB = useCallback(async (userId) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        quantidade,
        product:products (${PRODUCT_SELECT})
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setCartItems(data.filter(i => i.product?.seller_id && i.product.seller_id !== userId && i.product.ativo && i.product.estoque > 0));
    }
    setLoading(false);
  }, []);

  // ── Guest cart ────────────────────────────────────────────────
  const loadGuestCart = useCallback(async () => {
    setLoading(true);
    const guest = readGuestCart();
    if (!guest.length) { setCartItems([]); setLoading(false); return; }
    const { data, error } = await supabase.from('products').select(PRODUCT_SELECT).in('id', guest.map(i => i.product.id)).eq('ativo', true).not('seller_id', 'is', null);
    if (!error) {
      const current = guest.flatMap(item => {
        const product = data.find(p => p.id === item.product.id && p.estoque > 0);
        return product ? [{ ...item, product, quantidade: Math.min(item.quantidade, product.estoque) }] : [];
      });
      writeGuestCart(current); setCartItems(current);
    } else { setCartItems([]); }
    setLoading(false);
  }, []);

  // ── Load cart whenever session changes ───────────────────────
  useEffect(() => {
    if (session) {
      fetchCartFromDB(session.user.id);
    } else {
      loadGuestCart();
    }
  }, [session, fetchCartFromDB, loadGuestCart]);

  // ── Migrate guest → DB on login ──────────────────────────────
  useEffect(() => {
    if (!session) return;
    const guest = readGuestCart();
    if (guest.length === 0) return;

    (async () => {
      for (const item of guest) {
        const { data: product } = await supabase.from('products').select('id, estoque').eq('id', item.product.id).eq('ativo', true).not('seller_id', 'is', null).maybeSingle();
        if (!product || product.seller_id === session.user.id || product.estoque < 1) continue;
        const { error } = await supabase
          .from('cart_items')
          .upsert(
            {
              user_id:    session.user.id,
              product_id: item.product.id,
              quantidade: Math.min(item.quantidade, product.estoque),
            },
            { onConflict: 'user_id,product_id', ignoreDuplicates: false }
          );
        if (error) return;
      }
      localStorage.removeItem(GUEST_KEY);
      fetchCartFromDB(session.user.id);
    })();
  }, [session, fetchCartFromDB]);

  // ── updateQty ─────────────────────────────────────────────────
  const updateQty = useCallback(async (cartItemId, qty) => {
    if (qty < 1) return;
    const item = cartItems.find(i => i.id === cartItemId);
    if (!item || qty > item.product.estoque) return;

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
  }, [session, cartItems]);

  // ── addToCart ─────────────────────────────────────────────────
  const addToCart = useCallback(async (product) => {
    const { data: current, error: productError } = await supabase.from('products').select(PRODUCT_SELECT).eq('id', product.id).eq('ativo', true).not('seller_id', 'is', null).maybeSingle();
    if (productError) throw productError;
    if (!current || current.estoque < 1) throw new Error('Este produto não está mais disponível.');
    if (session?.user?.id === current.seller_id) throw new Error('Você não pode adicionar seu próprio produto ao carrinho.');
    product = current;
    if (session) {
      // Check if already in cart
      const existing = cartItems.find((i) => i.product.id === product.id);
      if (existing) {
        return updateQty(existing.id, existing.quantidade + 1);
      }
      const { error } = await supabase
        .from('cart_items')
        .insert({ user_id: session.user.id, product_id: product.id, quantidade: 1 });
      if (error) throw error;
      await fetchCartFromDB(session.user.id);
    } else {
      // Guest mode
      const guest = readGuestCart();
      const idx = guest.findIndex((i) => i.product.id === product.id);
      if (idx >= 0) {
        if (guest[idx].quantidade >= product.estoque) throw new Error('Quantidade máxima disponível atingida.');
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
  }, [session, cartItems, fetchCartFromDB, updateQty]);

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
