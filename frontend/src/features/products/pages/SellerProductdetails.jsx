import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Useproduct from '../hook/Useproduct'
import { getDisplayProduct } from '../services/product.normalize'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import {
  ChevronRight,
  LayoutDashboard,
  Eye,
  Plus,
  Trash2,
  ImageIcon,
  Tag,
  Layers,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  PackageSearch,
} from 'lucide-react'

// ── Helpers ────────────────────────────────────────────────────────────────
const createAttributeRow = () => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  key: '',
  value: '',
})

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(amount || 0))

// ── Component ──────────────────────────────────────────────────────────────
const SellerProductdetails = () => {
  const { productId } = useParams()
  const { handleGetprodcutById, handleaddProductVeriant, error, loading, products } = Useproduct()
  const [product, setProduct] = useState(null)
  const [selectedVariantId, setSelectedVariantId] = useState(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [successMessage, setSuccessMessage] = useState('')
  const [variantForm, setVariantForm] = useState({
    sku: '',
    attributes: [createAttributeRow()],
    stock: '',
    priceAmount: '',
    images: [],
  })

  useEffect(() => {
    handleGetprodcutById(productId).catch(() => {})
  }, [handleGetprodcutById, productId])

  useEffect(() => {
    if (products?.length) {
      setProduct(products[0])
    }
  }, [products])

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v._id === selectedVariantId) || null,
    [product, selectedVariantId],
  )

  const displayProduct = useMemo(
    () => (product ? getDisplayProduct(product, selectedVariant) : null),
    [product, selectedVariant],
  )

  const previewImages = displayProduct?.displayImages?.length
    ? displayProduct.displayImages
    : [{ url: 'https://placehold.co/900x1200/e7dfd2/6b5b4d?text=No+Image' }]

  useEffect(() => {
    setSelectedImageIndex(0)
  }, [selectedVariantId, product?._id])

  // ── Handlers ──────────────────────────────────────────────────────────
  const handleInputChange = (event) => {
    const { name, value, files } = event.target
    setSuccessMessage('')
    if (name === 'images') {
      setVariantForm((cur) => ({ ...cur, images: Array.from(files || []) }))
      return
    }
    setVariantForm((cur) => ({ ...cur, [name]: value }))
  }

  const updateAttributeRow = (id, field, value) => {
    setVariantForm((cur) => ({
      ...cur,
      attributes: cur.attributes.map((a) =>
        a.id === id ? { ...a, [field]: value } : a,
      ),
    }))
  }

  const addAttributeRow = () => {
    setVariantForm((cur) => ({
      ...cur,
      attributes: [...cur.attributes, createAttributeRow()],
    }))
  }

  const removeAttributeRow = (id) => {
    setVariantForm((cur) => ({
      ...cur,
      attributes:
        cur.attributes.length > 1
          ? cur.attributes.filter((a) => a.id !== id)
          : cur.attributes.map((a) =>
              a.id === id ? { ...a, key: '', value: '' } : a,
            ),
    }))
  }

  const handleVariantSubmit = async (event) => {
    event.preventDefault()
    const attributes = variantForm.attributes.reduce((result, attr) => {
      const key = attr.key.trim()
      const value = attr.value.trim()
      if (!key || !value) return result
      result[key] = value
      return result
    }, {})

    try {
      const updatedProduct = await handleaddProductVeriant(productId, {
        sku: variantForm.sku.trim(),
        stock: variantForm.stock,
        priceAmount: variantForm.priceAmount,
        priceCurrency: 'INR',
        attributes,
        images: variantForm.images,
      })
      setProduct(updatedProduct)
      const newestVariant = updatedProduct.variants?.[updatedProduct.variants.length - 1]
      setSelectedVariantId(newestVariant?._id || null)
      setVariantForm({
        sku: '',
        attributes: [createAttributeRow()],
        stock: '',
        priceAmount: '',
        images: [],
      })
      setSuccessMessage('Variant added successfully.')
    } catch {
      setSuccessMessage('')
    }
  }

  // ── Loading Skeleton ────────────────────────────────────────────────
  if (loading && !product) {
    return (
      <div className="page-bg min-h-screen flex flex-col">
        <StorefrontHeader />
        <div className="flex-1 px-4 py-10">
          <div className="container-luxury animate-pulse space-y-6">
            {/* Breadcrumb skeleton */}
            <div className="skeleton h-10 w-64 rounded-xl" />
            {/* Two-col skeleton */}
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="skeleton h-[42rem] rounded-2xl" />
              <div className="skeleton h-[42rem] rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Not Found / Error ───────────────────────────────────────────────
  if (!product) {
    return (
      <div className="page-bg min-h-screen flex flex-col">
        <StorefrontHeader />
        <div className="flex flex-1 items-center justify-center px-4 py-20">
          <div className="max-w-md w-full rounded-2xl border border-[#e8ddd0] bg-white p-10 text-center shadow-[0_8px_40px_rgba(107,66,38,0.08)]">
            <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[#f0e9df]">
              <PackageSearch className="h-8 w-8 text-[#b87d2a]" />
            </div>
            <h1 className="mt-6 font-serif text-3xl text-[#1a1411]">Product not available</h1>
            <p className="mt-3 text-sm leading-6 text-[#6b4226]/70">
              {error || 'We could not load this product right now.'}
            </p>
            <Link
              to="/seller/dashboard"
              className="btn-gold mt-7 inline-flex items-center gap-2 text-sm"
            >
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // ── Main Render ─────────────────────────────────────────────────────
  return (
    <div className="page-bg min-h-screen flex flex-col">
      <StorefrontHeader />

      {/* ── Breadcrumb Bar ─────────────────────────────────────────── */}
      <div className="border-b border-[#e8ddd0] bg-[#faf7f2]/95 backdrop-blur-md px-4 py-4">
        <div className="container-luxury">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm">
              <Link
                to="/seller/dashboard"
                className="font-medium text-[#b87d2a] hover:text-[#6b4226] transition-colors"
              >
                Dashboard
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-[#6b4226]/40" />
              <span className="font-semibold text-[#1a1411] truncate max-w-[200px] sm:max-w-none">
                {product.title}
              </span>
            </nav>

            {/* Nav Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/seller/dashboard"
                className="inline-flex items-center gap-2 rounded-xl border border-[#e8ddd0] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#6b4226] shadow-sm transition hover:border-[#b87d2a]/40 hover:bg-[#faf7f2]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Back to Dashboard
              </Link>
              <Link
                to={`/details/${product._id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#b87d2a] via-[#d4983a] to-[#b87d2a] px-4 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-white shadow-[0_4px_16px_rgba(184,125,42,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(184,125,42,0.38)]"
              >
                <Eye className="h-3.5 w-3.5" />
                Buyer Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-8">
        <div className="container-luxury">
          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">

            {/* ════════════════════════════════════════════════════════
                LEFT COLUMN
            ════════════════════════════════════════════════════════ */}
            <div className="space-y-5">

              {/* ── Image Viewer ──────────────────────────────────── */}
              <div className="rounded-2xl border border-[#e8ddd0] bg-white p-5 shadow-[0_4px_24px_rgba(107,66,38,0.07)]">
                {/* Main Image */}
                <div className="overflow-hidden rounded-xl border border-[#e8ddd0] bg-[#f0e9df]">
                  <img
                    src={previewImages[selectedImageIndex]?.url}
                    alt={displayProduct?.title}
                    className="h-[340px] w-full object-cover transition duration-300"
                  />
                </div>

                {/* Thumbnail Rail */}
                {previewImages.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                    {previewImages.map((image, index) => (
                      <button
                        key={`${image.url}-${index}`}
                        type="button"
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 overflow-hidden rounded-lg border-2 transition duration-200 ${
                          selectedImageIndex === index
                            ? 'border-[#b87d2a] shadow-[0_0_0_2px_rgba(184,125,42,0.2)]'
                            : 'border-[#e8ddd0] hover:border-[#b87d2a]/50'
                        }`}
                      >
                        <img
                          src={image.url}
                          alt={`Preview ${index + 1}`}
                          className="h-16 w-14 object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Stats Mini-Bar */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#e8ddd0] bg-[#faf7f2] px-3 py-3">
                    <div className="flex items-center gap-1.5 text-[#6b4226]/60">
                      <Layers className="h-3 w-3" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Active View</p>
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-[#1a1411] truncate">
                      {selectedVariant?.label || 'Original'}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e8ddd0] bg-[#faf7f2] px-3 py-3">
                    <div className="flex items-center gap-1.5 text-[#6b4226]/60">
                      <DollarSign className="h-3 w-3" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Price</p>
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-[#b87d2a]">
                      {formatCurrency(displayProduct?.displayPrice?.amount, displayProduct?.displayPrice?.currency)}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[#e8ddd0] bg-[#faf7f2] px-3 py-3">
                    <div className="flex items-center gap-1.5 text-[#6b4226]/60">
                      <ImageIcon className="h-3 w-3" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Gallery</p>
                    </div>
                    <p className="mt-1.5 text-xs font-semibold text-[#1a1411]">{previewImages.length} images</p>
                  </div>
                </div>
              </div>

              {/* ── Existing Variants ────────────────────────────── */}
              <div className="rounded-2xl border border-[#e8ddd0] bg-white p-5 shadow-[0_4px_24px_rgba(107,66,38,0.07)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="label-overline text-[#6b4226]/60">Variant Manager</p>
                    <h2 className="mt-1 font-serif text-xl text-[#1a1411]">Existing Variants</h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedVariantId(null)}
                    className="rounded-lg border border-[#e8ddd0] bg-[#faf7f2] px-3 py-1.5 text-xs font-semibold text-[#b87d2a] transition hover:border-[#b87d2a]/40"
                  >
                    Show original
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {(product.variants || []).length ? (
                    product.variants.map((variant) => (
                      <button
                        key={variant._id}
                        type="button"
                        onClick={() => setSelectedVariantId(variant._id)}
                        className={`flex w-full items-center gap-4 rounded-xl border-2 p-3 text-left transition duration-200 ${
                          selectedVariantId === variant._id
                            ? 'border-[#b87d2a] bg-[#fdf6eb] shadow-[0_0_0_3px_rgba(184,125,42,0.12)]'
                            : 'border-[#e8ddd0] bg-white hover:border-[#b87d2a]/50 hover:bg-[#faf7f2]'
                        }`}
                      >
                        {/* Variant thumbnail */}
                        <div className="h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg border border-[#e8ddd0]">
                          <img
                            src={
                              variant.images?.[0]?.url ||
                              product.images?.[0]?.url ||
                              'https://placehold.co/120x160/e7dfd2/6b5b4d?text=No+Image'
                            }
                            alt={variant.label}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Variant info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-[#1a1411]">{variant.label}</p>
                          <p className="mt-0.5 line-clamp-1 text-xs text-[#6b4226]/60">
                            {Object.entries(variant.attributes || {})
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ') || 'No attributes'}
                          </p>
                          {variant.sku && (
                            <p className="mt-1 text-[10px] font-mono text-[#b87d2a]/70 uppercase">
                              SKU: {variant.sku}
                            </p>
                          )}
                        </div>

                        <p className="flex-shrink-0 text-sm font-bold text-[#b87d2a]">
                          {formatCurrency(variant.price?.amount, variant.price?.currency)}
                        </p>
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e8ddd0] bg-[#faf7f2] py-10 text-center">
                      <Layers className="h-8 w-8 text-[#b87d2a]/40" />
                      <p className="mt-3 text-sm font-medium text-[#6b4226]/70">No variants yet</p>
                      <p className="mt-1 text-xs text-[#6b4226]/50">
                        Add your first color, size, or material combination using the form.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ════════════════════════════════════════════════════════
                RIGHT COLUMN — Add Variant Form
            ════════════════════════════════════════════════════════ */}
            <div>
              <form
                onSubmit={handleVariantSubmit}
                className="rounded-2xl border border-[#e8ddd0] bg-white p-6 shadow-[0_4px_24px_rgba(107,66,38,0.07)]"
              >
                {/* Form Header */}
                <div className="border-b border-[#e8ddd0] pb-5 mb-6">
                  <p className="label-overline text-[#b87d2a]">Variant Manager</p>
                  <h2 className="mt-2 font-serif text-2xl text-[#1a1411]">Add New Variant</h2>
                  <p className="mt-1.5 text-sm leading-6 text-[#6b4226]/70">
                    Keep it simple: basic info, images, then one or more attributes.
                  </p>
                </div>

                {/* ── Input Grid ─────────────────────────────────── */}
                <div className="grid gap-5 sm:grid-cols-2">
                  {/* SKU */}
                  <label className="space-y-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6b4226]">
                      <Tag className="h-3 w-3" />
                      SKU
                    </span>
                    <input
                      name="sku"
                      value={variantForm.sku}
                      onChange={handleInputChange}
                      placeholder="BLUE-PANT-01"
                      className="input-luxury w-full"
                    />
                  </label>

                  {/* Stock */}
                  <label className="space-y-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6b4226]">
                      <Layers className="h-3 w-3" />
                      Stock
                    </span>
                    <input
                      name="stock"
                      type="number"
                      min="0"
                      value={variantForm.stock}
                      onChange={handleInputChange}
                      placeholder="12"
                      required
                      className="input-luxury w-full"
                    />
                  </label>

                  {/* Variant Price */}
                  <label className="space-y-2 sm:col-span-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6b4226]">
                      <DollarSign className="h-3 w-3" />
                      Variant Price
                    </span>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#b87d2a]">
                        ₹
                      </span>
                      <input
                        name="priceAmount"
                        type="number"
                        min="0"
                        value={variantForm.priceAmount}
                        onChange={handleInputChange}
                        placeholder={`Leave blank to use ${formatCurrency(product.price?.amount, product.price?.currency)}`}
                        className="input-luxury w-full pl-8"
                      />
                    </div>
                  </label>

                  {/* Variant Images */}
                  <label className="space-y-2 sm:col-span-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#6b4226]">
                      <ImageIcon className="h-3 w-3" />
                      Variant Images
                    </span>
                    <div className="relative">
                      <input
                        name="images"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        onChange={handleInputChange}
                        className="w-full cursor-pointer rounded-xl border-2 border-dashed border-[#e8ddd0] bg-[#faf7f2] px-4 py-4 text-sm text-[#6b4226]/60 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#b87d2a] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:uppercase file:tracking-wider hover:border-[#b87d2a]/50 focus:outline-none focus:border-[#b87d2a] transition"
                      />
                      {variantForm.images.length > 0 && (
                        <p className="mt-1.5 text-xs text-[#b87d2a] font-medium">
                          {variantForm.images.length} file{variantForm.images.length === 1 ? '' : 's'} selected
                        </p>
                      )}
                    </div>
                  </label>
                </div>

                {/* ── Attributes Section ─────────────────────────── */}
                <div className="mt-6 rounded-xl border border-[#e8ddd0] bg-[#faf7f2] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="label-overline text-[#6b4226]/60">Product Attributes</p>
                      <h3 className="mt-0.5 text-sm font-semibold text-[#1a1411]">
                        Size, Color, Material…
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={addAttributeRow}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#b87d2a]/30 bg-white px-3 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#b87d2a] shadow-sm transition hover:bg-[#b87d2a] hover:text-white"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Attribute
                    </button>
                  </div>

                  <div className="mt-4 space-y-3">
                    {variantForm.attributes.map((attribute, idx) => (
                      <div
                        key={attribute.id}
                        className="grid gap-2 md:grid-cols-[1fr_1fr_auto]"
                      >
                        <input
                          value={attribute.key}
                          onChange={(e) => updateAttributeRow(attribute.id, 'key', e.target.value)}
                          placeholder={`Key (e.g. color)`}
                          className="input-luxury w-full text-sm"
                        />
                        <input
                          value={attribute.value}
                          onChange={(e) => updateAttributeRow(attribute.id, 'value', e.target.value)}
                          placeholder={`Value (e.g. Blue)`}
                          className="input-luxury w-full text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeAttributeRow(attribute.id)}
                          title="Remove attribute"
                          className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── Success / Error Messages ───────────────────── */}
                {successMessage && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-600" />
                    <p className="text-sm text-emerald-700">{successMessage}</p>
                  </div>
                )}

                {error && (
                  <div className="mt-5 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* ── Submit Button ──────────────────────────────── */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#b87d2a] via-[#d4983a] to-[#b87d2a] py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_6px_24px_rgba(184,125,42,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(184,125,42,0.42)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving variant…
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Save Variant
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SellerProductdetails
