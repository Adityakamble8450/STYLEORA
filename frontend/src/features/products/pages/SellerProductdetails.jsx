import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import Useproduct from '../hook/Useproduct'
import { getDisplayProduct } from '../services/product.normalize'

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
    () => product?.variants?.find((variant) => variant._id === selectedVariantId) || null,
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

  const handleInputChange = (event) => {
    const { name, value, files } = event.target
    setSuccessMessage('')

    if (name === 'images') {
      setVariantForm((current) => ({
        ...current,
        images: Array.from(files || []),
      }))
      return
    }

    setVariantForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const updateAttributeRow = (id, field, value) => {
    setVariantForm((current) => ({
      ...current,
      attributes: current.attributes.map((attribute) =>
        attribute.id === id ? { ...attribute, [field]: value } : attribute,
      ),
    }))
  }

  const addAttributeRow = () => {
    setVariantForm((current) => ({
      ...current,
      attributes: [...current.attributes, createAttributeRow()],
    }))
  }

  const removeAttributeRow = (id) => {
    setVariantForm((current) => ({
      ...current,
      attributes:
        current.attributes.length > 1
          ? current.attributes.filter((attribute) => attribute.id !== id)
          : current.attributes.map((attribute) =>
              attribute.id === id ? { ...attribute, key: '', value: '' } : attribute,
            ),
    }))
  }

  const handleVariantSubmit = async (event) => {
    event.preventDefault()

    const attributes = variantForm.attributes.reduce((result, attribute) => {
      const key = attribute.key.trim()
      const value = attribute.value.trim()

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

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] px-4 py-10">
        <div className="mx-auto max-w-[1280px] animate-pulse space-y-6">
          <div className="h-14 rounded-xl bg-white" />
          <div className="h-[42rem] rounded-xl bg-white" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] px-4 py-16">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Seller product not available</h1>
          <p className="mt-3 text-slate-600">{error || 'We could not load this product right now.'}</p>
          <Link
            to="/seller/dashboard"
            className="mt-6 inline-flex rounded-lg bg-[#2874f0] px-6 py-3 text-sm font-semibold text-white"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <section className="min-h-screen bg-[#f1f3f6] px-4 py-6">
      <div className="mx-auto max-w-[1280px] space-y-4">
        <div className="rounded-xl bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2874f0]">Seller Variant Manager</p>
              <h1 className="mt-1 text-3xl font-semibold text-slate-900">{product.title}</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/seller/dashboard"
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Dashboard
              </Link>
              <Link
                to={`/details/${product._id}`}
                className="rounded-lg bg-[#2874f0] px-4 py-2 text-sm font-semibold text-white"
              >
                Buyer preview
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                <img
                  src={previewImages[selectedImageIndex]?.url}
                  alt={displayProduct?.title}
                  className="h-[320px] w-full object-cover"
                />
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto">
                {previewImages.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`overflow-hidden rounded-lg border ${selectedImageIndex === index ? 'border-[#2874f0]' : 'border-slate-200'}`}
                  >
                    <img src={image.url} alt={`Preview ${index + 1}`} className="h-20 w-16 object-cover" />
                  </button>
                ))}
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Active view</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{selectedVariant?.label || 'Original product'}</p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Price</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {formatCurrency(displayProduct?.displayPrice?.amount, displayProduct?.displayPrice?.currency)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Gallery</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">{previewImages.length} images</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">Existing Variants</h2>
                <button
                  type="button"
                  onClick={() => setSelectedVariantId(null)}
                  className="text-sm font-semibold text-[#2874f0]"
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
                      className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${
                        selectedVariantId === variant._id ? 'border-[#2874f0] bg-[#eef5ff]' : 'border-slate-200 bg-white'
                      }`}
                    >
                      <img
                        src={variant.images?.[0]?.url || product.images?.[0]?.url || 'https://placehold.co/120x160/e7dfd2/6b5b4d?text=No+Image'}
                        alt={variant.label}
                        className="h-16 w-14 rounded-lg object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-slate-900">{variant.label}</p>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {Object.entries(variant.attributes || {}).map(([key, value]) => `${key}: ${value}`).join(' • ') || 'No attributes'}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">
                        {formatCurrency(variant.price?.amount, variant.price?.currency)}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-5 text-sm text-slate-500">
                    No variants yet. Add your first color, size, or material combination below.
                  </div>
                )}
              </div>
            </div>
          </div>

          <form onSubmit={handleVariantSubmit} className="rounded-xl bg-white p-4 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Add Variant</h2>
            <p className="mt-1 text-sm text-slate-500">Keep this simple: basic info, images, then one or more attributes.</p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">SKU</span>
                <input
                  name="sku"
                  value={variantForm.sku}
                  onChange={handleInputChange}
                  placeholder="BLUE-PANT-01"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2874f0]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Stock</span>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  value={variantForm.stock}
                  onChange={handleInputChange}
                  placeholder="12"
                  required
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2874f0]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Variant price</span>
                <input
                  name="priceAmount"
                  type="number"
                  min="0"
                  value={variantForm.priceAmount}
                  onChange={handleInputChange}
                  placeholder={`Leave blank to use ${formatCurrency(product.price?.amount, product.price?.currency)}`}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2874f0]"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Variant images</span>
                <input
                  name="images"
                  type="file"
                  multiple
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600"
                />
              </label>
            </div>

            <div className="mt-6 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">Attributes</h3>
                <button
                  type="button"
                  onClick={addAttributeRow}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700"
                >
                  Add attribute
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {variantForm.attributes.map((attribute) => (
                  <div key={attribute.id} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <input
                      value={attribute.key}
                      onChange={(event) => updateAttributeRow(attribute.id, 'key', event.target.value)}
                      placeholder="color"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2874f0]"
                    />
                    <input
                      value={attribute.value}
                      onChange={(event) => updateAttributeRow(attribute.id, 'value', event.target.value)}
                      placeholder="Blue"
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-[#2874f0]"
                    />
                    <button
                      type="button"
                      onClick={() => removeAttributeRow(attribute.id)}
                      className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {successMessage ? (
              <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {error ? (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-[#2874f0] px-6 py-4 text-sm font-semibold text-white disabled:opacity-70"
            >
              {loading ? 'Saving variant...' : 'Save variant'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default SellerProductdetails
