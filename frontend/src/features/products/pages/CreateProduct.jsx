import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import Useproduct from '../hook/Useproduct'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'
import {
  LayoutDashboard, Image as ImageIcon, X, Upload,
  CheckCircle, AlertCircle, DollarSign, FileText, Package
} from 'lucide-react'

const initialFormState = { title: '', price: '', description: '' }

const formatPrice = (value) => {
  if (!value) return '0'
  const amount = Number(value)
  if (Number.isNaN(amount)) return '0'
  return new Intl.NumberFormat('en-IN').format(amount)
}

const CreateProduct = () => {
  const { handleCreateProduct, loading, error } = Useproduct()
  const addToast = useToast()
  const [formData, setFormData] = useState(initialFormState)
  const [selectedImages, setSelectedImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const nextUrls = selectedImages.map((file) => URL.createObjectURL(file))
    setPreviewUrls(nextUrls)
    return () => nextUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [selectedImages])

  const validateField = (name, value, files = selectedImages) => {
    if (name === 'title') {
      if (!value.trim()) return 'Product title is required.'
      if (value.trim().length < 3) return 'Title must be at least 3 characters.'
    }
    if (name === 'price') {
      if (!value) return 'Price is required.'
      if (Number(value) <= 0) return 'Price must be greater than 0.'
    }
    if (name === 'description') {
      if (!value.trim()) return 'Description is required.'
      if (value.trim().length < 10) return 'Description must be at least 10 characters.'
    }
    if (name === 'images') {
      if (!files.length) return 'Add at least one product image.'
      if (files.length > 7) return 'You can upload up to 7 images.'
    }
    return ''
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((c) => ({ ...c, [name]: value }))
    setFieldErrors((c) => ({ ...c, [name]: validateField(name, value) }))
  }

  const handleFiles = (files) => {
    const nextFiles = Array.from(files).slice(0, 7)
    setSelectedImages(nextFiles)
    setFieldErrors((c) => ({ ...c, images: validateField('images', '', nextFiles) }))
  }

  const handleImageChange = (e) => handleFiles(e.target.files || [])

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  const removeImage = (idx) => {
    const nextFiles = selectedImages.filter((_, i) => i !== idx)
    setSelectedImages(nextFiles)
    if (fileInputRef.current) fileInputRef.current.value = ''
    setFieldErrors((c) => ({ ...c, images: validateField('images', '', nextFiles) }))
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setSelectedImages([])
    setFieldErrors({})
    setSubmitError('')
    setSuccessMessage('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    const nextErrors = {
      title: validateField('title', formData.title),
      price: validateField('price', formData.price),
      description: validateField('description', formData.description),
      images: validateField('images', '', selectedImages),
    }

    if (Object.values(nextErrors).some(Boolean)) {
      setFieldErrors(nextErrors)
      setSubmitError('Please fix the highlighted fields before publishing.')
      return
    }

    const payload = new FormData()
    payload.append('title', formData.title.trim())
    payload.append('price', formData.price)
    payload.append('description', formData.description.trim())
    selectedImages.forEach((file) => payload.append('images', file))

    try {
      await handleCreateProduct(payload)
      resetForm()
      setSuccessMessage('Product published and live in your catalog!')
      addToast('Product published successfully!', 'success')
    } catch (err) {
      setSubmitError(err.message || 'Unable to create product right now.')
      addToast('Failed to publish product.', 'error')
    }
  }

  const charCount = formData.description.trim().length

  return (
    <div className="min-h-screen page-bg">
      <StorefrontHeader />

      <main className="container-luxury py-8 pb-16">
        {/* ── Breadcrumb ── */}
        <div className="mb-8 flex items-center gap-3">
          <Link
            to="/seller/dashboard"
            className="flex items-center gap-2 text-sm text-stone-500 hover:text-amber-700 transition-colors"
          >
            <LayoutDashboard size={15} />
            Seller Dashboard
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-sm font-medium text-stone-700">Create Product</span>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">

          {/* ── Form Column ── */}
          <div>
            <div className="mb-6">
              <p className="label-overline mb-2">Seller Studio</p>
              <h1 className="font-serif text-4xl text-stone-950 sm:text-5xl">
                Create a New Product
              </h1>
              <p className="mt-3 text-stone-500">
                Add polished details, clear pricing, and rich imagery — all in one seamless flow.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
              {/* Title + Price row */}
              <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
                    <FileText size={15} className="text-amber-600" />
                    Product Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Minimal Leather Weekender Bag"
                    className={`input-luxury ${fieldErrors.title ? '!border-red-300 focus:!border-red-400' : ''}`}
                    aria-describedby={fieldErrors.title ? 'title-error' : undefined}
                  />
                  {fieldErrors.title && (
                    <p id="title-error" className="mt-1.5 text-xs text-red-500">{fieldErrors.title}</p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
                    <DollarSign size={15} className="text-amber-600" />
                    Price (INR)
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-amber-700">₹</span>
                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      step="1"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="2499"
                      className={`input-luxury pl-9 ${fieldErrors.price ? '!border-red-300 focus:!border-red-400' : ''}`}
                    />
                  </div>
                  {fieldErrors.price && (
                    <p className="mt-1.5 text-xs text-red-500">{fieldErrors.price}</p>
                  )}
                  {formData.price && !fieldErrors.price && (
                    <p className="mt-1.5 text-xs text-stone-400">
                      Display: ₹{formatPrice(formData.price)}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="mb-2 flex items-center gap-2 text-sm font-semibold text-stone-800">
                  <Package size={15} className="text-amber-600" />
                  Product Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the materials, feel, fit, and standout details that make this product special..."
                  className={`input-luxury h-auto resize-none px-4 py-4 leading-7 ${fieldErrors.description ? '!border-red-300 focus:!border-red-400' : ''}`}
                />
                <div className="mt-1.5 flex items-center justify-between text-xs">
                  <span className={fieldErrors.description ? 'text-red-500' : 'text-stone-400'}>
                    {fieldErrors.description || 'Keep it vivid, tactile, and specific.'}
                  </span>
                  <span className={`font-medium ${charCount > 1800 ? 'text-orange-500' : 'text-stone-400'}`}>
                    {charCount}/2000
                  </span>
                </div>
              </div>

              {/* Image Upload */}
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <ImageIcon size={15} className="text-amber-600" />
                      <p className="text-sm font-semibold text-stone-800">Product Gallery</p>
                    </div>
                    <p className="text-xs text-stone-400 ml-5">
                      1–7 images (JPG, PNG, WEBP). First image = cover shot.
                    </p>
                  </div>
                  <label className="btn-outline cursor-pointer rounded-xl px-4 py-2.5 text-xs shrink-0">
                    <Upload size={14} />
                    Select Images
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {fieldErrors.images && (
                  <p className="mb-3 text-xs text-red-500">{fieldErrors.images}</p>
                )}

                {/* Drag and drop zone / preview grid */}
                {previewUrls.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {previewUrls.map((url, idx) => (
                      <div
                        key={`${url}-${idx}`}
                        className="group relative overflow-hidden rounded-xl border border-stone-100 bg-stone-50 shadow-sm"
                      >
                        <img src={url} alt={`Preview ${idx + 1}`} className="h-44 w-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute left-2 top-2 badge-gold text-[0.6rem]">Cover</span>
                        )}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-xs text-white/80 truncate">{selectedImages[idx]?.name}</p>
                          <p className="text-xs text-white/55">
                            {(selectedImages[idx]?.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`flex min-h-52 flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
                      isDragging
                        ? 'border-amber-400 bg-amber-50/60 scale-[0.99]'
                        : 'border-stone-200 bg-stone-50/60 hover:border-amber-300 hover:bg-amber-50/20'
                    }`}
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-3">
                      <Upload size={24} />
                    </div>
                    <p className="text-sm font-semibold text-stone-800">
                      {isDragging ? 'Drop images here' : 'Drag & drop images here'}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">or use the "Select Images" button above</p>
                  </div>
                )}
              </div>

              {/* Submit messages */}
              {(submitError || error) && (
                <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <AlertCircle size={15} className="shrink-0" />
                  {submitError || error}
                </div>
              )}

              {successMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <CheckCircle size={15} className="shrink-0" />
                  {successMessage}
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col gap-3 border-t border-stone-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-stone-400">Your listing will be saved with seller protection and INR pricing.</p>
                <div className="flex gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-outline rounded-xl px-5 py-3 text-sm"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-gold rounded-xl px-6 py-3 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="animate-spin h-4 w-4 border-2 border-white/30 border-t-white rounded-full" />
                    ) : <CheckCircle size={16} />}
                    {loading ? 'Publishing...' : 'Publish Product'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* ── Preview Column ── */}
          <aside className="xl:sticky xl:top-24 xl:self-start space-y-5">
            {/* Live preview card */}
            <div className="overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-[0_8px_32px_rgba(70,39,10,0.08)]">
              <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Live Preview</p>
                <span className="badge-gold text-[0.6rem]">
                  {selectedImages.length} image{selectedImages.length !== 1 ? 's' : ''}
                </span>
              </div>

              {/* Preview image */}
              {previewUrls[0] ? (
                <img src={previewUrls[0]} alt="Cover preview" className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 items-center justify-center bg-[linear-gradient(145deg,_#f3cf99_0%,_#d48834_100%)] text-white">
                  <div className="text-center px-6">
                    <ImageIcon size={28} className="mx-auto mb-2 opacity-60" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/80">Hero Shot</p>
                    <p className="mt-2 text-sm font-medium">Your cover image appears here</p>
                  </div>
                </div>
              )}

              <div className="p-5">
                <p className="label-overline mb-1">Stylore Maki</p>
                <h3 className="font-serif text-2xl text-stone-900 leading-tight">
                  {formData.title.trim() || 'Your product title'}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-500 line-clamp-2">
                  {formData.description.trim() || 'A refined product story helps buyers trust quality faster.'}
                </p>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <div>
                    <p className="text-xs text-stone-400 mb-1">Price</p>
                    <p className="font-serif text-2xl font-semibold text-stone-950">
                      ₹{formatPrice(formData.price || '0')}
                    </p>
                  </div>
                  <span className={`badge-gold ${formData.title && formData.price ? '' : 'opacity-40'}`}>
                    {formData.title && formData.price ? 'Ready' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Listing tips */}
            <div className="rounded-2xl border border-stone-100 bg-white p-5 shadow-[0_4px_20px_rgba(70,39,10,0.06)]">
              <p className="label-overline mb-4">Listing Tips</p>
              {[
                { n: 1, title: 'Use a title that scans quickly', body: 'Lead with material, shape, or category so buyers understand the item at a glance.' },
                { n: 2, title: 'Tell the story visually', body: 'Start with a crisp hero image, then follow with angle, detail, and scale shots.' },
                { n: 3, title: 'Keep descriptions specific', body: 'Mention finish, texture, usage, or standout value — avoid generic marketing lines.' },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex gap-3 mb-4 last:mb-0">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xs font-bold text-amber-700 mt-0.5">
                    {n}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-stone-500">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default CreateProduct
