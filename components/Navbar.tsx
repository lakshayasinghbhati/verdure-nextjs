"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Search, Heart, User, LayoutDashboard } from "lucide-react";
import BasketIcon from "@/components/BasketIcon";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useSearchStore } from "../store/useSearchStore";
export default function Navbar() {
  const { data: session } = useSession();
  const [cartOpen, setCartOpen] = useState(false);
  const [wishOpen, setWishOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const search = useSearchStore((s) => s.search);
  const setSearch = useSearchStore((s) => s.setSearch);
  useEffect(() => {
  if (!search.trim()) {
    setSuggestions([]);
    return;
  }

  fetch(`/api/products?q=${encodeURIComponent(search)}`)
    .then((res) => res.json())
    .then((data) => setSuggestions(data))
    .catch(() => setSuggestions([]));
}, [search]);
  return (
    <>
      <nav className="sticky top-0 z-30 backdrop-blur-md bg-ink/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center gap-4">
          <Link href="/" className="font-display text-2xl tracking-tight">
            Verdure
          </Link>

          <div className="flex-1 flex justify-center px-2">
            <div className="relative w-full max-w-md z-50">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-porcelain/40" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search fresh produce, dairy, pantry..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-4 text-sm"
              />
              {suggestions.length > 0 && search.trim() && (
  <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-white/10 bg-[#102019] shadow-xl overflow-hidden z-50">
    {suggestions.slice(0, 6).map((product) => (
      <button
        key={product._id}
        onClick={() => setSearch(product.name)}
        className="w-full text-left px-4 py-3 hover:bg-white/10 transition"
      >
        {product.name}
      </button>
    ))}
  </div>
)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {session?.user?.role === "admin" && (
              <Link href="/admin" className="p-2 rounded-full hover:bg-white/10 transition" aria-label="Admin dashboard">
                <LayoutDashboard className="w-5 h-5" />
              </Link>
            )}
            {session ? (
  <>
    <Link
      href="/account"
      className="p-2 rounded-full hover:bg-white/10 transition"
      aria-label="My account"
    >
      <User className="w-5 h-5" />
    </Link>

    <button
      onClick={() => signOut()}
      className="p-2 rounded-full hover:bg-white/10 transition text-sm"
    >
      Sign Out
    </button>
  </>
) : (
  <Link
    href="/signin"
    className="p-2 rounded-full hover:bg-white/10 transition"
    aria-label="Sign in"
  >
    <User className="w-5 h-5" />
  </Link>
)}
            <button onClick={() => setWishOpen(true)} className="relative p-2 rounded-full hover:bg-white/10 transition" aria-label="Wishlist">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-citrus text-[10px] font-mono w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>
            <BasketIcon onClick={() => setCartOpen(true)} />
          </div>
        </div>
      </nav>

      {cartOpen && <CartDrawer onClose={() => setCartOpen(false)} />}
      {wishOpen && <WishlistDrawer onClose={() => setWishOpen(false)} />}
    </>
  );
}
