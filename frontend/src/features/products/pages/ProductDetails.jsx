import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import Useproduct from '../hook/Useproduct'
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Star,
  Truck,
  RotateCcw,
  ZoomIn,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'

const ProductDetails = () => {
  const { productId } = useParams()
  const { handleGetprodcutById, error, loading, products } = Useproduct()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [selectedSize, setSelectedSize] = useState('M')
  const [quantity, setQuantity] = useState(1)
  const [openAccordion, setOpenAccordion] = useState(null)
  const [wishlist, setWishlist] = useState(false)

  useEffect(() => {
    handleGetprodcutById(productId)
  }, [productId])

  useEffect(() => {
    if (products && products.length > 0) {
      setProduct(products[0])
    }
  }, [products])

  const toggleAccordion = (section) => {
    setOpenAccordion(openAccordion === section ? null : section)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF8F3] via-[#F5F1EB] to-[#FBF9F7] gap-4 text-lg text-gray-600">
        <div className="w-12 h-12 border-3 border-gray-300 border-t-yellow-600 rounded-full animate-spin"></div>
        <p>Loading product details...</p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF8F3] via-[#F5F1EB] to-[#FBF9F7] gap-4 text-lg text-gray-600">
        <p>Unable to load product details</p>
      </div>
    )
  }

  const colors = [
    { name: 'Olive Green', hex: '#6B8B3C' },
    { name: 'White', hex: '#F5F5F5' },
    { name: 'Blue', hex: '#4A90E2' },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Navy', hex: '#2C3E50' },
  ]

  const sizes = ['S', 'M', 'L', 'XL', 'XXL']

  const highlights = [
    { icon: '🧵', label: '100% Cotton', desc: 'Fabric' },
    { icon: '💨', label: 'Breathable', desc: 'Material' },
    { icon: '✂️', label: 'Regular Fit', desc: 'Comfort' },
    { icon: '🧺', label: 'Machine Wash', desc: 'Care' },
    { icon: '👑', label: 'Premium', desc: 'Quality' },
  ]

  const productImages = product.images?.length > 0
    ? product.images.map(img => img.url)
    : [
        'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop',
        'https://images.unsplash.com/photo-1559070956-49caadb0e357?w=600&h=800&fit=crop',
      ]

  const relatedProducts = [
    { name: 'Classic Cotton Shirt', price: 1499, image: 'https://images.unsplash.com/photo-1521887852-b72b27e84530?w=300&h=400&fit=crop' },
    { name: 'Casual Oxford Shirt', price: 1799, image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=400&fit=crop' },
    { name: 'Premium Linen Shirt', price: 2299, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=300&h=400&fit=crop' },
    { name: 'Elegant Formal Shirt', price: 1999, image: 'https://images.unsplash.com/photo-1559070956-49caadb0e357?w=300&h=400&fit=crop' },
    { name: 'Urban Style Shirt', price: 1599, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F3] via-[#F5F1EB] to-[#FBF9F7]">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-[#8B7355] to-[#A0826D] text-white py-2 px-4">
        <div className="flex justify-around items-center gap-4 text-sm font-medium flex-wrap">
          <span className="cursor-pointer hover:translate-y-[-2px] transition">📦 Free Shipping on Orders Above ₹999</span>
          <span className="cursor-pointer hover:translate-y-[-2px] transition">↩️ Easy Returns & Exchanges</span>
          <span className="cursor-pointer hover:translate-y-[-2px] transition">📱 Download App</span>
          <span className="cursor-pointer hover:translate-y-[-2px] transition">🏪 Sell on Stylore Maki</span>
        </div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-100 bg-white border-b border-gray-200 p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-12 flex-1">
            <div className="text-xl font-bold bg-gradient-to-r from-[#8B7355] to-[#D4AF37] bg-clip-text text-transparent whitespace-nowrap">STYLORE MAKI</div>
            <div className="hidden lg:flex items-center gap-8 text-sm font-medium">
              <a href="#" className="text-gray-900 relative pb-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-yellow-700 after:transition-all after:duration-300 hover:after:w-full">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">Men</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">Women</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">Kids</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">New Arrivals</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">Collections</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition">Offers</a>
            </div>
          </div>

          <div className="flex items-center gap-4 flex-1 justify-center">
            <div className="flex items-center gap-3 bg-[#F5F1EB] px-5 py-2 rounded-full border border-gray-200 flex-1 max-w-xs">
              <Search size={18} className="text-gray-600" />
              <input type="text" placeholder="Search for products..." className="bg-transparent outline-none flex-1 text-sm" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:text-yellow-600 transition"><Heart size={20} /></button>
            <button className="relative p-2 hover:text-yellow-600 transition">
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">0</span>
            </button>
            <button className="p-2 hover:text-yellow-600 transition"><User size={20} /></button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-600">
        <a href="#" className="text-yellow-700 hover:text-yellow-600">Home</a>
        <ChevronRight size={16} />
        <a href="#" className="text-yellow-700 hover:text-yellow-600">Men</a>
        <ChevronRight size={16} />
        <a href="#" className="text-yellow-700 hover:text-yellow-600">Shirts</a>
        <ChevronRight size={16} />
        <span>Premium Cotton Shirt</span>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left - Product Images */}
        <div className="flex flex-col gap-6">
          <div className="relative bg-[#F5F1EB] rounded-3xl overflow-hidden aspect-[3/4] flex items-center justify-center shadow-lg group">
            <div className="absolute top-6 left-6 bg-yellow-600 text-white font-bold text-lg px-4 py-2 rounded-full z-10">-20%</div>
            <button className="absolute bottom-6 right-6 bg-white w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg text-gray-900 hover:bg-yellow-600 hover:text-white transition z-10">
              <ZoomIn size={20} />
            </button>
            <img src={productImages[selectedImage]} alt="Product" className="w-full h-full object-cover" />
          </div>

          <div className="flex gap-4 overflow-x-auto">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                className={`w-20 h-24 rounded-2xl overflow-hidden border-2 flex-shrink-0 transition ${selectedImage === idx ? 'border-yellow-600 shadow-md' : 'border-transparent hover:border-yellow-600'}`}
                onClick={() => setSelectedImage(idx)}
              >
                <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right - Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wide">Men's Collection</p>
            <h1 className="text-4xl font-bold mt-2 text-gray-900">{product.title || product.name || 'Premium Cotton Shirt'}</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#D4AF37" color="#D4AF37" />
              ))}
            </div>
            <span className="font-semibold text-gray-900">4.8 (128 Reviews)</span>
            <span className="text-gray-600">| 2K+ Sold</span>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-4xl font-bold text-gray-900">₹{typeof product.price === 'object' ? product.price.amount : (product.price || 1599)}</span>
              <span className="text-lg text-gray-500 line-through">₹{Math.round((typeof product.price === 'object' ? product.price.amount : (product.price || 1599)) * 1.25)}</span>
              <span className="text-red-600 font-bold text-lg bg-red-100 px-3 py-1 rounded">20% OFF</span>
            </div>
            <p className="text-sm text-gray-600">Inclusive of all taxes</p>
          </div>

          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
            {product.description || 'Crafted from premium cotton fabric, this shirt offers unbeatable comfort and timeless style. Perfect for casual outings, office wear, or evening plans. Experience luxury in every wear with our meticulously curated collection.'}
          </p>

          {/* Color Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-900 flex justify-between items-center">
              Color: <span className="text-yellow-700 font-bold">{colors[selectedColor].name}</span>
            </label>
            <div className="flex gap-4 mt-3 flex-wrap">
              {colors.map((color, idx) => (
                <button
                  key={idx}
                  className={`w-11 h-11 rounded-full border-2 transition ${selectedColor === idx ? 'border-yellow-600 shadow-lg ring-2 ring-yellow-200' : 'border-gray-300 hover:border-yellow-600'}`}
                  style={{ backgroundColor: color.hex }}
                  onClick={() => setSelectedColor(idx)}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-900 flex justify-between items-center">
              <span>Size: <span className="text-yellow-700 ml-2">{selectedSize}</span></span>
              <a href="#" className="text-yellow-700 text-sm underline hover:text-yellow-600">Size Guide</a>
            </label>
            <div className="flex gap-2 mt-3 flex-wrap">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`w-12 h-12 rounded-xl border-2 font-bold transition ${selectedSize === size ? 'bg-yellow-600 text-white border-yellow-600 shadow-md' : 'border-gray-300 text-gray-900 hover:border-yellow-600'}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="text-sm font-semibold text-gray-900">Quantity</label>
            <div className="flex items-center border-2 border-gray-200 rounded-2xl w-fit mt-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-100">−</button>
              <input type="number" value={quantity} readOnly className="w-16 h-12 border-l border-r border-gray-200 text-center font-bold outline-none" />
              <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-lg hover:bg-gray-100">+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 items-center pt-4">
            <button className="flex-1 h-14 rounded-2xl border-2 border-gray-800 text-gray-900 font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="flex-1 h-14 rounded-2xl bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-bold text-lg flex items-center justify-center shadow-lg hover:shadow-xl transition">
              Buy Now
            </button>
            <button
              className={`w-14 h-14 rounded-2xl border-2 flex items-center justify-center transition ${wishlist ? 'bg-yellow-100 border-yellow-600' : 'border-gray-300 hover:border-yellow-600'}`}
              onClick={() => setWishlist(!wishlist)}
            >
              <Heart size={20} fill={wishlist ? '#D4AF37' : 'none'} color={wishlist ? '#D4AF37' : '#9CA3AF'} />
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-4 bg-[#FBF9F7] rounded-2xl p-6 mt-6">
            <div className="flex gap-3 items-start">
              <Truck size={24} className="text-yellow-800 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Estimated Delivery</p>
                <p className="text-xs text-gray-600">23 - 25 May, 2024</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <RotateCcw size={24} className="text-yellow-800 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Easy Returns</p>
                <p className="text-xs text-gray-600">Within 7 days of delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Highlights */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">Product Highlights</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {highlights.map((highlight, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-gray-200 text-center hover:border-yellow-600 hover:shadow-lg transition">
              <p className="text-3xl mb-3">{highlight.icon}</p>
              <p className="font-bold text-gray-900 text-sm">{highlight.label}</p>
              <p className="text-xs text-gray-600 mt-1">{highlight.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="space-y-3">
          {[
            { key: 'details', title: 'Product Details', content: 'This premium cotton shirt is crafted from 100% pure cotton, ensuring maximum comfort and breathability. The shirt features a regular fit design that works for various body types and occasions. With its timeless design and premium fabric, it\'s perfect for both casual and professional settings.' },
            { key: 'fabric', title: 'Fabric & Care', content: 'Material: 100% Cotton\nWeight: 150 GSM\nCare Instructions: Machine wash in cold water, tumble dry low, iron on medium heat\nFit: Regular Fit' },
            { key: 'size', title: 'Size & Fit', content: 'Our size guide is based on standard measurements. Please refer to the size chart for accurate sizing. If you\'re between sizes, we recommend going up for comfort. The shirt has a comfortable fit that\'s suitable for layering.' },
            { key: 'shipping', title: 'Shipping & Returns', content: 'Shipping: Free shipping on orders above ₹999. Standard delivery takes 3-5 business days.\nReturns: Easy 7-day returns policy. Products must be unused and in original condition.\nExchanges: Hassle-free exchanges available for different sizes or colors.' },
          ].map(({ key, title, content }) => (
            <div key={key} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-yellow-600 hover:shadow-md transition">
              <button
                className={`w-full px-6 py-4 flex justify-between items-center font-bold transition ${openAccordion === key ? 'bg-[#FBF9F7] text-yellow-600' : 'text-gray-900 hover:bg-gray-50'}`}
                onClick={() => toggleAccordion(key)}
              >
                <span>{title}</span>
                <ChevronDown size={20} style={{ transform: openAccordion === key ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }} />
              </button>
              {openAccordion === key && (
                <div className="px-6 py-4 bg-[#FBF9F7] border-t border-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">You may also like</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {relatedProducts.map((related, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl hover:-translate-y-2 transition group">
              <div className="relative bg-gray-200 overflow-hidden aspect-[3/4]">
                <img src={related.image} alt={related.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition hover:bg-yellow-600 hover:text-white">
                  <Heart size={20} />
                </button>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-900 line-clamp-2 text-sm">{related.name}</p>
                <p className="text-xl font-bold text-yellow-700 mt-2">₹{related.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
