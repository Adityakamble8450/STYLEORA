import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import { Heart, Share2, Star } from "lucide-react";
import Useproduct from "../hook/Useproduct";
import UseCart from "../hook/UseCart";
import StorefrontHeader from "../components/StorefrontHeader";
import { findMatchingVariant, getDisplayProduct, getVariantGroups } from "../services/product.normalize";

const formatCurrency = (amount, currency = "INR") =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));

const getVariantPreviewImage = (variant, product) =>
  variant?.images?.[0]?.url || product?.images?.[0]?.url || "https://placehold.co/320x420/e7dfd2/6b5b4d?text=No+Image";

const ProductDetails = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { handleGetprodcutById, error, loading, products } = Useproduct();
  const { handleAddToCart } = UseCart();
  const [product, setProduct] = useState(null);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    handleGetprodcutById(productId).catch(() => {});
  }, [handleGetprodcutById, productId]);

  useEffect(() => {
    if (products?.length) {
      setProduct(products[0]);
    }
  }, [products]);

  const variantGroups = useMemo(() => getVariantGroups(product?.variants || []), [product?.variants]);
  const activeVariant = useMemo(
    () => findMatchingVariant(product?.variants || [], selectedAttributes),
    [product?.variants, selectedAttributes],
  );
  const displayProduct = useMemo(
    () => (product ? getDisplayProduct(product, activeVariant) : null),
    [product, activeVariant],
  );

  const galleryImages = displayProduct?.displayImages?.length
    ? displayProduct.displayImages
    : [{ url: "https://placehold.co/900x1200/e7dfd2/6b5b4d?text=No+Image" }];

  useEffect(() => {
    setSelectedGalleryImage(0);
  }, [activeVariant?._id, product?._id]);

  const handleAttributeSelect = (key, value) => {
    setSelectedAttributes((current) => ({
      ...current,
      [key]: current[key] === value ? undefined : value,
    }));
  };

  const handleVariantSelect = (variant) => {
    setSelectedAttributes(variant?.attributes || {});
  };

  const handleAddProductToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setAddingToCart(true);
      await handleAddToCart({
        productId: product._id,
        variantId: activeVariant?._id,
        quantity: 1,
      });
      navigate("/cart");
    } catch {}
    finally {
      setAddingToCart(false);
    }
  };

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#faf6ef_0%,_#f4ecdf_55%,_#efe4d5_100%)] px-4 py-10">
        <div className="mx-auto max-w-[1600px] animate-pulse space-y-5">
          <div className="h-12 rounded-2xl bg-white/70" />
          <div className="grid gap-6 xl:grid-cols-[1.04fr_0.96fr]">
            <div className="h-[36rem] rounded-[2rem] bg-white/70" />
            <div className="h-[36rem] rounded-[2rem] bg-white/70" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,_#faf6ef_0%,_#f4ecdf_55%,_#efe4d5_100%)] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/80 bg-white/85 p-10 text-center shadow-[0_22px_60px_rgba(70,39,10,0.08)]">
          <h1 className="font-serif text-4xl text-stone-950">Product not available</h1>
          <p className="mt-3 text-stone-600">{error || "Unable to load this product right now."}</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(180deg,_#faf6ef_0%,_#f4ecdf_55%,_#efe4d5_100%)] text-stone-900">
      <StorefrontHeader />

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm text-stone-500">
          <Link to="/" className="hover:text-amber-700">Home</Link>
          <span> › Product › </span>
          <span className="font-medium text-stone-800">{product.title}</span>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.02fr_0.98fr] 2xl:gap-8">
          <div className="grid min-w-0 gap-4 xl:grid-cols-[82px_minmax(0,1fr)]">
            <div className="order-2 flex gap-3 overflow-x-auto pb-1 xl:order-1 xl:flex-col xl:overflow-visible">
              {galleryImages.map((image, index) => (
                <button
                  key={`${image.url}-${index}`}
                  type="button"
                  onClick={() => setSelectedGalleryImage(index)}
                  className={`overflow-hidden rounded-[1.1rem] border bg-white shadow-sm transition ${
                    selectedGalleryImage === index ? "border-stone-950" : "border-stone-200"
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="h-24 w-[72px] object-cover sm:h-28 sm:w-20 xl:h-[98px] xl:w-[68px]"
                  />
                </button>
              ))}
            </div>

            <div className="order-1 overflow-hidden rounded-[2rem] border border-white/90 bg-white/85 shadow-[0_22px_55px_rgba(70,39,10,0.07)] xl:order-2">
              <div className="relative bg-[linear-gradient(135deg,_#dfcfbc_0%,_#f4eadf_100%)]">
                <img
                  src={galleryImages[selectedGalleryImage]?.url}
                  alt={displayProduct?.title}
                  className="h-[320px] w-full object-cover sm:h-[420px] md:h-[500px] lg:h-[560px] xl:h-[620px] 2xl:h-[660px]"
                />

                <button
                  type="button"
                  onClick={() => setWishlist((current) => !current)}
                  className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full shadow-sm sm:right-5 sm:top-5 sm:h-11 sm:w-11 ${
                    wishlist ? "bg-amber-50 text-amber-700" : "bg-white/92 text-stone-700"
                  }`}
                >
                  <Heart size={18} fill={wishlist ? "currentColor" : "none"} />
                </button>

                <button
                  type="button"
                  className="absolute right-4 top-16 grid h-10 w-10 place-items-center rounded-full bg-white/92 text-stone-700 shadow-sm sm:right-5 sm:top-[4.6rem] sm:h-11 sm:w-11"
                >
                  <Share2 size={17} />
                </button>
              </div>
            </div>
          </div>

          <aside className="min-w-0 rounded-[2rem] border border-white/90 bg-white/88 p-5 shadow-[0_22px_55px_rgba(70,39,10,0.07)] sm:p-6 xl:sticky xl:top-6 xl:self-start">
            <p className="text-sm font-semibold text-amber-700">Product Details</p>
            <h1 className="mt-3 break-words font-serif text-[2rem] leading-tight text-stone-950 sm:text-[2.35rem] 2xl:text-[2.6rem]">
              {product.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-3 text-stone-600">
              <div className="flex gap-1 text-amber-500">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-medium">Product preview</span>
            </div>

            <div className="mt-5 flex flex-wrap items-end gap-3">
              <p className="break-words text-3xl font-semibold text-stone-950 sm:text-4xl">
                {formatCurrency(displayProduct.displayPrice?.amount, displayProduct.displayPrice?.currency)}
              </p>
              {activeVariant?.stock >= 0 ? (
                <span className="pb-1 text-sm font-medium text-stone-500">
                  {activeVariant ? `${activeVariant.stock} in stock` : "Base product price"}
                </span>
              ) : null}
            </div>

            <p className="mt-5 text-base leading-8 text-stone-700">{product.description}</p>

            {product.variants?.length ? (
              <div className="mt-8 border-t border-stone-200 pt-6">
                <p className="text-lg font-semibold text-stone-900">
                  Selected Variant: <span className="font-medium text-stone-700">{activeVariant?.label || "Original product"}</span>
                </p>

                <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                  {product.variants.map((variant) => {
                    const isActive = activeVariant?._id === variant._id;

                    return (
                      <button
                        key={variant._id}
                        type="button"
                        onClick={() => handleVariantSelect(variant)}
                        className={`min-w-[78px] rounded-[1rem] border bg-white p-1.5 transition sm:min-w-[84px] ${
                          isActive ? "border-stone-950 shadow-[0_0_0_1px_#1c1917]" : "border-stone-200"
                        }`}
                      >
                        <img
                          src={getVariantPreviewImage(variant, product)}
                          alt={variant.label}
                          className="h-20 w-full rounded-[0.8rem] object-cover sm:h-24"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {!!Object.keys(variantGroups).length && (
              <div className="mt-8 space-y-6 border-t border-stone-200 pt-6">
                {Object.entries(variantGroups).map(([key, values]) => (
                  <div key={key} className="min-w-0">
                    <p className="text-lg font-semibold text-stone-900">
                      {key}: <span className="font-medium text-stone-700">{selectedAttributes[key] || "Not selected"}</span>
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3">
                      {values.map((value) => {
                        const isSelected = selectedAttributes[key] === value;

                        return (
                          <button
                            key={`${key}-${value}`}
                            type="button"
                            onClick={() => handleAttributeSelect(key, value)}
                            className={`rounded-[1rem] border px-5 py-3 text-sm font-medium transition ${
                              isSelected
                                ? "border-stone-950 bg-stone-950 text-white"
                                : "border-stone-300 bg-white text-stone-700"
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleAddProductToCart}
                className="rounded-[1.15rem] border border-stone-300 bg-white px-5 py-4 text-base font-semibold text-stone-900 shadow-sm transition hover:bg-stone-50"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                type="button"
                onClick={handleAddProductToCart}
                className="rounded-[1.15rem] bg-[#b97a29] px-5 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-[#a26922]"
              >
                Buy Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
