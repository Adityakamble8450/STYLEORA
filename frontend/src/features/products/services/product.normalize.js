const normalizeImageList = (images) => {
  if (!Array.isArray(images)) return []

  return images
    .map((image) => {
      if (!image) return null
      if (typeof image === 'string') return { url: image }
      if (typeof image.url === 'string' && image.url.trim()) return { url: image.url.trim() }
      return null
    })
    .filter(Boolean)
}

const mergeImageLists = (...lists) => {
  const seen = new Set()

  return lists
    .flat()
    .filter((image) => {
      if (!image?.url || seen.has(image.url)) return false
      seen.add(image.url)
      return true
    })
}

const normalizePrice = (price, fallbackPrice = {}) => {
  if (typeof price === 'number') {
    return {
      amount: price,
      currency: fallbackPrice.currency || 'INR',
    }
  }

  return {
    amount: Number(price?.amount ?? fallbackPrice.amount ?? 0),
    currency: price?.currency || price?.curruncy || fallbackPrice.currency || 'INR',
  }
}

const normalizeAttributes = (attributes) => {
  if (!attributes) return {}

  if (attributes instanceof Map) {
    return Object.fromEntries(attributes.entries())
  }

  if (typeof attributes === 'object' && !Array.isArray(attributes)) {
    return Object.entries(attributes).reduce((result, [key, value]) => {
      if (value == null || value === '') return result
      result[String(key)] = String(value)
      return result
    }, {})
  }

  return {}
}

export const getVariantLabel = (variant, index = 0) => {
  const attributeValues = Object.values(variant?.attributes || {}).filter(Boolean)
  if (attributeValues.length) return attributeValues.join(' / ')
  if (variant?.sku) return variant.sku
  return `Variant ${index + 1}`
}

export const normalizeVariant = (variant, index = 0, baseProduct = {}) => {
  const normalized = {
    ...variant,
    _id: variant?._id || variant?.sku || `variant-${index + 1}`,
    sku: variant?.sku || '',
    attributes: normalizeAttributes(variant?.attributes || variant?.attribute),
    price: normalizePrice(variant?.price, baseProduct.price),
    stock: Number(variant?.stock ?? 0),
    images: normalizeImageList(variant?.images || variant?.imeges),
    isActive: variant?.isActive !== false,
  }

  normalized.label = getVariantLabel(normalized, index)
  return normalized
}

export const normalizeProduct = (product = {}) => {
  const normalized = {
    ...product,
    title: product?.title || product?.name || 'Untitled Product',
    description: product?.description || '',
    images: normalizeImageList(product?.images),
    price: normalizePrice(product?.price),
    variants: [],
  }

  normalized.variants = Array.isArray(product?.variants)
    ? product.variants.map((variant, index) => normalizeVariant(variant, index, normalized))
    : []

  return normalized
}

export const getVariantGroups = (variants = []) => {
  return variants.reduce((groups, variant) => {
    Object.entries(variant.attributes || {}).forEach(([key, value]) => {
      if (!groups[key]) {
        groups[key] = []
      }

      if (!groups[key].includes(value)) {
        groups[key].push(value)
      }
    })

    return groups
  }, {})
}

export const findMatchingVariant = (variants = [], selection = {}) => {
  const entries = Object.entries(selection).filter(([, value]) => Boolean(value))
  if (!entries.length) return null

  return (
    variants.find((variant) =>
      entries.every(([key, value]) => variant.attributes?.[key] === value),
    ) || null
  )
}

export const getDisplayProduct = (product, variant) => {
  const normalizedProduct = normalizeProduct(product)
  if (!variant) {
    return {
      ...normalizedProduct,
      activeVariant: null,
      displayImages: normalizedProduct.images,
      displayPrice: normalizedProduct.price,
      displayStock: null,
    }
  }

  const mergedImages = mergeImageLists(variant.images, normalizedProduct.images)

  return {
    ...normalizedProduct,
    activeVariant: variant,
    displayImages: mergedImages.length ? mergedImages : normalizedProduct.images,
    displayPrice: variant.price.amount ? variant.price : normalizedProduct.price,
    displayStock: variant.stock,
  }
}
