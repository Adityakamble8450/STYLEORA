import { useEffect, useRef, useState } from 'react'
import Useproduct from '../hook/Useproduct'

const initialFormState = {
  title: '',
  price: '',
  description: '',
}

const formatPrice = (value) => {
  if (!value) return '0'

  const amount = Number(value)
  if (Number.isNaN(amount)) return '0'

  return new Intl.NumberFormat('en-IN').format(amount)
}

const CreateProduct = () => {
  const { handleCreateProduct, loading, error } = Useproduct()
  const [formData, setFormData] = useState(initialFormState)
  const [selectedImages, setSelectedImages] = useState([])
  const [previewUrls, setPreviewUrls] = useState([])
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    const nextUrls = selectedImages.map((file) => URL.createObjectURL(file))
    setPreviewUrls(nextUrls)

    return () => {
      nextUrls.forEach((url) => URL.revokeObjectURL(url))
    }
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

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [name]: validateField(name, value),
    }))
  }

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || [])
    const nextFiles = files.slice(0, 7)

    setSelectedImages(nextFiles)
    setFieldErrors((current) => ({
      ...current,
      images: validateField('images', '', nextFiles),
    }))
  }

  const removeImage = (indexToRemove) => {
    const nextFiles = selectedImages.filter((_, index) => index !== indexToRemove)
    setSelectedImages(nextFiles)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    setFieldErrors((current) => ({
      ...current,
      images: validateField('images', '', nextFiles),
    }))
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setSelectedImages([])
    setFieldErrors({})
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitError('')
    setSuccessMessage('')

    const nextErrors = {
      title: validateField('title', formData.title),
      price: validateField('price', formData.price),
      description: validateField('description', formData.description),
      images: validateField('images', '', selectedImages),
    }

    const hasErrors = Object.values(nextErrors).some(Boolean)
    setFieldErrors(nextErrors)

    if (hasErrors) {
      setSubmitError('Please fix the highlighted fields before publishing.')
      return
    }

    const payload = new FormData()
    payload.append('title', formData.title.trim())
    payload.append('price', formData.price)
    payload.append('description', formData.description.trim())
    selectedImages.forEach((file) => {
      payload.append('images', file)
    })

    try {
      await handleCreateProduct(payload)
      resetForm()
      setSuccessMessage('Product created successfully and is ready for your catalog.')
    } catch (requestError) {
      setSubmitError(requestError.message || 'Unable to create product right now.')
    }
  }

  return (
    <section className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(221,170,109,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(194,132,55,0.18),_transparent_24%),linear-gradient(135deg,_#f8f4ee_0%,_#f3ede4_45%,_#ede4d7_100%)]">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        <div className="bg-white/72 px-5 py-6 backdrop-blur-xl sm:px-8 sm:py-8 lg:px-12 lg:py-10 xl:px-16">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-700/80">
                    Seller Studio
                  </p>
                  <h1 className="mt-3 font-serif text-3xl tracking-tight text-stone-950 sm:text-4xl">
                    Create a product page that feels as premium as what you sell
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-800 sm:text-base">
                    Add polished details, clear pricing, and rich product imagery in one seamless flow.
                  </p>
                </div>

                <div className="hidden h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-inner shadow-amber-100 sm:flex">
                  <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                  </svg>
                </div>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-900" htmlFor="title">
                      Product title
                    </label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Minimal leather weekender bag"
                      className={`h-14 w-full rounded-2xl border bg-white/90 px-4 text-sm text-stone-900 outline-none transition duration-200 placeholder:text-stone-500 focus:bg-white ${
                        fieldErrors.title
                          ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.08)]'
                          : 'border-stone-200/80 focus:border-amber-600 focus:shadow-[0_0_0_4px_rgba(180,119,36,0.08)]'
                      }`}
                    />
                    {fieldErrors.title && <p className="text-xs text-red-600">{fieldErrors.title}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-900" htmlFor="price">
                      Price
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-amber-700">
                        INR
                      </span>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="1"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="2499"
                        className={`h-14 w-full rounded-2xl border bg-white/90 pl-16 pr-4 text-sm text-stone-900 outline-none transition duration-200 placeholder:text-stone-500 focus:bg-white ${
                          fieldErrors.price
                            ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.08)]'
                            : 'border-stone-200/80 focus:border-amber-600 focus:shadow-[0_0_0_4px_rgba(180,119,36,0.08)]'
                        }`}
                      />
                    </div>
                    {fieldErrors.price && <p className="text-xs text-red-600">{fieldErrors.price}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-900" htmlFor="description">
                    Product description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="6"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the materials, feel, fit, and standout details that make this product special."
                    className={`w-full rounded-[1.5rem] border bg-white/90 px-4 py-4 text-sm leading-6 text-stone-900 outline-none transition duration-200 placeholder:text-stone-500 focus:bg-white ${
                      fieldErrors.description
                        ? 'border-red-300 focus:border-red-400 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.08)]'
                        : 'border-stone-200/80 focus:border-amber-600 focus:shadow-[0_0_0_4px_rgba(180,119,36,0.08)]'
                    }`}
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className={fieldErrors.description ? 'text-red-600' : 'text-stone-700'}>
                      {fieldErrors.description || 'Keep it clear, vivid, and specific.'}
                    </span>
                    <span className="text-stone-700">{formData.description.trim().length}/2000</span>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-white/70 bg-white/88 p-4 shadow-[0_16px_40px_rgba(80,48,12,0.08)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-900">Product gallery</p>
                      <p className="mt-1 text-sm leading-6 text-stone-800">
                        Upload between 1 and 7 JPG, PNG, or WEBP images. Use bright, clean product shots for the best result.
                      </p>
                    </div>

                    <label className="inline-flex cursor-pointer items-center justify-center rounded-2xl border border-stone-200 bg-white px-5 py-3 text-sm font-semibold text-stone-700 shadow-sm transition duration-200 hover:border-stone-300 hover:bg-stone-50">
                      Select images
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

                  {fieldErrors.images && <p className="mt-3 text-xs text-red-600">{fieldErrors.images}</p>}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {previewUrls.length > 0 ? (
                      previewUrls.map((previewUrl, index) => (
                        <div
                          key={`${previewUrl}-${index}`}
                          className="group relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white shadow-[0_14px_34px_rgba(84,48,11,0.08)]"
                        >
                          <img src={previewUrl} alt={`Preview ${index + 1}`} className="h-48 w-full object-cover" />
                          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-stone-950/80 px-4 py-3 text-white">
                            <div>
                              <p className="text-sm font-medium">{selectedImages[index]?.name}</p>
                              <p className="text-xs text-white/75">
                                {(selectedImages[index]?.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold transition hover:bg-white/30"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="sm:col-span-2 xl:col-span-3">
                        <div className="flex min-h-56 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-stone-300 bg-white/70 px-6 text-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700 shadow-inner shadow-amber-100">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14m-9-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <p className="mt-4 text-sm font-semibold text-stone-900">No images selected yet</p>
                          <p className="mt-2 max-w-md text-sm leading-6 text-stone-800">
                            A strong first image can lift trust instantly. Choose clean, bright shots that show texture and shape.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {submitError && (
                  <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50/70 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                {successMessage && (
                  <div className="rounded-2xl border border-green-200 bg-green-50/80 px-4 py-3 text-sm text-green-700">
                    {successMessage}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-stone-200/80 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-stone-800">
                    Your listing will be saved with seller protection and INR pricing.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="inline-flex h-13 items-center justify-center rounded-2xl border border-stone-200 bg-white px-6 text-sm font-semibold text-stone-700 shadow-sm transition duration-200 hover:border-stone-300 hover:bg-stone-50"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex h-13 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 px-6 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(180,119,36,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(180,119,36,0.38)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                    >
                      {loading ? 'Publishing product...' : 'Publish product'}
                    </button>
                  </div>
                </div>
              </form>
        </div>

        <aside className="flex flex-col gap-5 bg-gradient-to-br from-amber-50/40 to-orange-50/30 px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10 xl:px-12">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/8 p-6 shadow-[0_24px_60px_rgba(50,28,7,0.18)] backdrop-blur-md">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-200/30 to-amber-50/10" />
                <span className="relative rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-amber-700">
                  Live Preview
                </span>
                <div className="relative mt-5 overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#fff9f2]/95 p-4 text-stone-900 shadow-[0_16px_30px_rgba(61,37,11,0.14)]">
                  <div className="overflow-hidden rounded-[1.25rem] bg-stone-100">
                    {previewUrls[0] ? (
                      <img src={previewUrls[0]} alt="Primary preview" className="h-64 w-full object-cover" />
                    ) : (
                      <div className="flex h-64 items-center justify-center bg-[linear-gradient(145deg,_#f3cf99_0%,_#d48834_100%)] text-center text-white">
                        <div className="px-6">
                          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">Hero shot</p>
                          <p className="mt-3 text-lg font-semibold">Your lead product image will appear here</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-stone-700">Featured Product</p>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-amber-700">
                        {selectedImages.length} image{selectedImages.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <h2 className="mt-3 font-serif text-2xl text-stone-900">
                      {formData.title.trim() || 'Your product title'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-stone-800">
                      {formData.description.trim() || 'A refined product story helps buyers trust quality faster.'}
                    </p>
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-stone-700">Price</p>
                        <p className="mt-2 text-3xl font-semibold text-stone-950">
                          Rs. {formatPrice(formData.price)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/95 px-4 py-3 text-right shadow-[0_16px_30px_rgba(52,27,8,0.1)]">
                        <p className="text-xs uppercase tracking-[0.22em] text-stone-600">Status</p>
                        <p className="mt-1 text-sm font-semibold text-stone-900">Ready to publish</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.5rem] border border-white/10 bg-white/95 p-6 text-stone-900 shadow-[0_16px_30px_rgba(52,27,8,0.14)]">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-600">Listing Notes</p>
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl border border-stone-200/80 bg-white p-4">
                    <p className="text-sm font-semibold text-stone-900">Use a title that scans quickly</p>
                    <p className="mt-1 text-sm leading-6 text-stone-800">
                      Lead with material, shape, or category so buyers understand the item in one glance.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200/80 bg-white p-4">
                    <p className="text-sm font-semibold text-stone-900">Tell the product story visually</p>
                    <p className="mt-1 text-sm leading-6 text-stone-800">
                      Start with a crisp hero image, then follow with angle, detail, and scale shots.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200/80 bg-white p-4">
                    <p className="text-sm font-semibold text-stone-900">Keep the description specific</p>
                    <p className="mt-1 text-sm leading-6 text-stone-800">
                      Mention finish, texture, usage, or standout value instead of generic marketing lines.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
        </div>
    </section>
  )
}

export default CreateProduct
