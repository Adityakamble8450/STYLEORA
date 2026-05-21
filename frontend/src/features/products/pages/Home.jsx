import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Heart, ShoppingBag } from "lucide-react";
import { useSelector } from "react-redux";
import Useproduct from "../hook/Useproduct";
import UseCart from "../hook/UseCart";
import StorefrontHeader from "../components/StorefrontHeader";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    title: "Collections That Convert",
    caption: "Build a storefront where original products and live variants feel polished from the first click.",
  },
  {
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
    title: "Variant-Ready Catalog",
    caption: "Let shoppers switch color or style options and instantly see the matching product image.",
  },
  {
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1600&q=80",
    title: "Premium Seller Presentation",
    caption: "Give your product team a cleaner home page with stronger product cards and better catalog context.",
  },
];

const heroCards = [
  { title: "Free Shipping", subtitle: "On orders above ₹999" },
  { title: "Easy Returns", subtitle: "Within 7 days" },
  { title: "Secure Payments", subtitle: "100% safe & secure" },
  { title: "24/7 Support", subtitle: "We're here to help" },
];

const categoryCards = [
  {
    title: "Men",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Kids",
    image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Accessories",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  },
];

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const Home = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { handleGetAllProducts, products, loading, error } = Useproduct();
  const { handleAddToCart } = UseCart();
  const [addingId, setAddingId] = useState(null);
  const [addError, setAddError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    handleGetAllProducts().catch(() => {});
  }, [handleGetAllProducts]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 4000);

    return () => window.clearInterval(intervalId);
  }, []);

  const featuredProducts = useMemo(() => products.slice(0, 8), [products]);

  const handleAddProductToCart = async (product) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAddError("");
      setAddingId(product._id);
      await handleAddToCart({
        productId: product._id,
        quantity: 1,
      });
      navigate("/cart");
    } catch (requestError) {
      setAddError(requestError.message || "Unable to add product to cart.");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,_#f9f5ee_0%,_#f5eee3_48%,_#f0e7da_100%)] text-stone-900">
      <StorefrontHeader />

      <main className="mx-auto max-w-[1600px] px-4 pb-16 pt-6 sm:px-6 lg:px-10">
        <section className="overflow-hidden rounded-[2rem] bg-[linear-gradient(120deg,_#f7efe2_0%,_#f9f5ef_48%,_#efe3d0_100%)] shadow-[0_28px_70px_rgba(93,62,24,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-center px-6 py-8 lg:px-10 lg:py-12">
              <span className="w-fit rounded-full bg-white/75 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#a46a1f]">
                New Season Edit
              </span>
              <h1 className="mt-5 max-w-xl font-serif text-[3rem] leading-[0.98] text-stone-950 sm:text-[4.6rem]">
                {heroSlides[activeSlide].title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-600 sm:text-lg">
                {heroSlides[activeSlide].caption}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#catalog"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#b77928] px-8 py-4 text-sm font-semibold text-white shadow-[0_16px_35px_rgba(183,121,40,0.28)] transition hover:bg-[#a56b21]"
                >
                  Shop Collection
                </a>
                <Link
                  to="/cart"
                  className="inline-flex items-center justify-center rounded-2xl border border-stone-300 bg-white/80 px-8 py-4 text-sm font-semibold text-stone-900 transition hover:bg-white"
                >
                  Open Cart
                </Link>
              </div>

              <div className="mt-8 flex gap-2">
                {heroSlides.map((slide, index) => (
                  <button
                    key={slide.title}
                    type="button"
                    onClick={() => setActiveSlide(index)}
                    className={`h-2.5 rounded-full transition ${
                      activeSlide === index ? "w-10 bg-[#b77928]" : "w-2.5 bg-stone-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="relative min-h-[420px]">
              <img
                src={heroSlides[activeSlide].image}
                alt={heroSlides[activeSlide].title}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(237,225,207,0.08)_0%,_rgba(237,225,207,0)_35%,_rgba(70,39,10,0.06)_100%)]" />
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 rounded-[1.8rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_45px_rgba(70,39,10,0.06)] md:grid-cols-2 xl:grid-cols-4">
          {heroCards.map((item) => (
            <div key={item.title} className="rounded-2xl border border-stone-100 bg-white/80 px-5 py-5">
              <p className="font-semibold text-stone-900">{item.title}</p>
              <p className="mt-1 text-sm text-stone-600">{item.subtitle}</p>
            </div>
          ))}
        </section>

        <section id="categories" className="pt-12">
          <div className="text-center">
            <h2 className="font-serif text-4xl text-stone-950 sm:text-5xl">Shop by Category</h2>
            <p className="mt-3 text-base text-stone-600">
              Browse Men, Women, Kids, and Accessories collections before opening the live catalog.
            </p>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categoryCards.map((card) => (
              <a
                key={card.title}
                href="#catalog"
                className="group relative overflow-hidden rounded-[1.6rem] shadow-[0_18px_40px_rgba(70,39,10,0.12)]"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-[320px] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/72 via-stone-900/18 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <h3 className="text-4xl font-semibold tracking-tight">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/85">Explore now</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="catalog" className="mt-12">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-serif text-4xl text-stone-950 sm:text-5xl">You may also like</h2>
              <p className="mt-2 text-base text-stone-600">Live products from your backend, styled as a premium shopping grid.</p>
            </div>
            <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-semibold text-[#9d631d]">
              View Cart <ArrowRight size={16} />
            </Link>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          {addError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{addError}</div>
          ) : null}

          {loading ? (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="overflow-hidden rounded-[1.5rem] border border-stone-200/70 bg-white/80">
                  <div className="h-72 animate-pulse bg-stone-200" />
                  <div className="space-y-3 p-4">
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-stone-200" />
                    <div className="h-4 w-1/3 animate-pulse rounded-full bg-stone-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {featuredProducts.map((product) => (
                <article
                  key={product._id}
                  className="group overflow-hidden rounded-[1.5rem] border border-white/80 bg-white/82 shadow-[0_18px_42px_rgba(70,39,10,0.08)] transition duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden bg-[#efe4d7]">
                    <Link to={`/details/${product._id}`}>
                      <img
                        src={product.images?.[0]?.url || "https://placehold.co/600x720/e7dfd2/6b5b4d?text=Product"}
                        alt={product.title}
                        className="h-72 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      />
                    </Link>
                    <button
                      type="button"
                      className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/92 text-stone-700 shadow-sm"
                    >
                      <Heart size={17} />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <Link to={`/details/${product._id}`} className="text-lg font-semibold text-stone-900">
                          {product.title}
                        </Link>
                        <p className="mt-2 text-base font-semibold text-stone-900">
                          {formatCurrency(product.price?.amount, product.price?.currency)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleAddProductToCart(product)}
                        className="grid h-11 w-11 place-items-center rounded-xl border border-[#d2b38e] bg-white text-[#9d631d] shadow-sm transition hover:bg-[#f7efe4]"
                      >
                        {addingId === product._id ? "..." : <ShoppingBag size={18} />}
                      </button>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">{product.description}</p>
                    <p className="mt-4 text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
                      {addingId === product._id ? "Adding to cart..." : "Tap bag to add to cart"}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </section>
  );
};

export default Home;
