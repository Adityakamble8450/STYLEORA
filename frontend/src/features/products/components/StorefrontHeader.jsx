import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Heart, Search, ShoppingBag, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState } from "../../auth/state/auth.slice";
import { clearAuthSession } from "../../auth/services/auth.session";
import { clearCartState } from "../state/cart.slice";
import UseCart from "../hook/UseCart";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Men", to: "/" },
  { label: "Women", to: "/" },
  { label: "Kids", to: "/" },
  { label: "New Arrivals", to: "/" },
  { label: "Collections", to: "/" },
  { label: "Offers", to: "/" },
];

const StorefrontHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cart, initialized, handleGetCart } = UseCart();
  const [isCartMenuOpen, setCartMenuOpen] = useState(false);
  const cartRef = useRef(null);

  useEffect(() => {
    if (user && !initialized) {
      handleGetCart().catch(() => {});
    }
  }, [handleGetCart, initialized, user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuthSession();
    dispatch(clearAuthState());
    dispatch(clearCartState());
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div className="border-b border-stone-200/80 bg-[linear-gradient(90deg,_rgba(255,255,255,0.8),_rgba(247,241,233,0.95),_rgba(255,255,255,0.8))]">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 text-[13px] text-stone-700 sm:px-6 lg:px-10">
          <span>Free Shipping on Orders Above ₹999</span>
          <span>Easy Returns & Exchanges</span>
          <div className="flex items-center gap-5">
            <span>Download App</span>
            <span>Sell on Stylore Maki</span>
          </div>
        </div>
      </div>

      <header className="border-b border-stone-200/80 bg-white/82 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-4 py-5 sm:px-6 lg:px-10 xl:flex-row xl:items-center">
          <Link to="/" className="min-w-fit">
            <div className="font-serif text-[2.2rem] leading-none tracking-[0.08em] text-stone-950">STYLORE</div>
            <div className="text-xs uppercase tracking-[0.34em] text-stone-500">Maki</div>
          </Link>

          <nav className="hidden items-center gap-8 pl-4 text-[1rem] text-stone-800 xl:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className={`transition hover:text-amber-700 ${
                  location.pathname === link.to && link.label === "Home" ? "font-medium text-stone-950" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-[250px] items-center gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 shadow-sm xl:min-w-[360px]">
              <Search size={18} className="text-stone-500" />
              <span className="text-sm text-stone-400">Search for products...</span>
            </div>

            <div className="flex items-center gap-4 text-stone-700">
              <Heart size={20} />
              <div className="relative" ref={cartRef}>
                <button
                  type="button"
                  onClick={() => setCartMenuOpen((open) => !open)}
                  className="relative inline-flex items-center rounded-full p-2 text-stone-700 transition hover:bg-stone-100"
                >
                  <ShoppingBag size={20} />
                  {user && cart.totalItems > 0 ? (
                    <span className="absolute -right-2.5 -top-2.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[11px] font-semibold text-white shadow-[0_4px_10px_rgba(220,38,38,0.35)] ring-2 ring-white">
                      {cart.totalItems}
                    </span>
                  ) : null}
                </button>

                {isCartMenuOpen ? (
                  <div className="absolute right-0 top-full z-50 mt-3 w-[320px] rounded-[1.6rem] border border-stone-200/80 bg-white/95 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.1)]">
                    <div className="flex items-center justify-between border-b border-stone-200/60 pb-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-stone-500">Cart preview</p>
                        <p className="mt-1 text-base font-semibold text-stone-950">{cart.totalItems || 0} item(s)</p>
                      </div>
                      <span className="text-sm font-semibold text-amber-700">{cart.totalAmount ? `₹${cart.totalAmount}` : "₹0"}</span>
                    </div>

                    <div className="max-h-[320px] space-y-3 overflow-auto py-4">
                      {cart.items?.length ? (
                        cart.items.slice(0, 4).map((item) => {
                          const product = item.product || {};
                          const price = item.price?.amount || product.price?.amount || 0;

                          return (
                            <div key={item._id} className="flex items-start gap-3 rounded-3xl bg-stone-50 p-3">
                              <img
                                src={product.images?.[0]?.url || "https://placehold.co/80x90/e7dfd2/6b5b4d?text=Img"}
                                alt={product.title}
                                className="h-16 w-16 rounded-2xl object-cover"
                              />
                              <div className="min-w-0 flex-1 text-sm">
                                <p className="font-medium text-stone-900">{product.title || "Product"}</p>
                                <p className="mt-1 text-stone-500">Qty {item.quantity}</p>
                                <p className="mt-2 font-semibold text-stone-900">₹{price}</p>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="rounded-3xl bg-stone-50 p-4 text-center text-sm text-stone-500">
                          Your cart is empty. Add items to see them here.
                        </div>
                      )}
                    </div>

                    <div className="pt-3">
                      <Link
                        to="/cart"
                        onClick={() => setCartMenuOpen(false)}
                        className="block rounded-2xl bg-stone-950 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-stone-800"
                      >
                        View cart
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="hidden text-sm md:inline">Hi, {user?.fullname?.split(" ")[0] || "User"}</span>
              </div>
              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-full border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:bg-stone-50"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default StorefrontHeader;
