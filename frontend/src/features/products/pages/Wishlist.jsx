import { useState } from 'react'
import { useNavigate } from 'react-router'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'
import {
  Heart, Star, X, ShoppingBag, Eye, ChevronDown,
  ArrowRight, Sparkles,
} from 'lucide-react'

const mockWishlist = [
  {
    id: 1,
    title: 'Linen Blazer Set',
    price: 3499,
    originalPrice: 4999,
    rating: 4.8,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 2,
    title: 'Silk Slip Dress',
    price: 2899,
    originalPrice: 3999,
    rating: 4.6,
    reviews: 94,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 3,
    title: 'Tailored Wide-Leg Trousers',
    price: 1999,
    originalPrice: 2499,
    rating: 4.7,
    reviews: 76,
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b2ee7?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 4,
    title: 'Cashmere Blend Turtleneck',
    price: 4299,
    originalPrice: 5999,
    rating: 4.9,
    reviews: 211,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 5,
    title: 'Leather Crossbody Bag',
    price: 3999,
    originalPrice: 5499,
    rating: 4.5,
    reviews: 59,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=600&q=80',
  },
]

function StarRating({ rating }) {
  return (
    <div className='flex items-center gap-0.5'>
      {[1, 2, 3, 4, 5].map(s => (
        <Star
          key={s}
          size={12}
          className={s <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}
        />
      ))}
    </div>
  )
}

export default function Wishlist() {
  const navigate = useNavigate()
  const addToast = useToast()
  const [wishlistItems, setWishlistItems] = useState(mockWishlist)
  const [sortBy, setSortBy] = useState('default')
  const [sortOpen, setSortOpen] = useState(false)

  const removeItem = (id) => {
    setWishlistItems(prev => prev.filter(item => item.id !== id))
    addToast('Item removed from wishlist', 'info')
  }

  const addToCart = (item) => {
    addToast(`${item.title} added to cart!`, 'success')
  }

  const moveAllToCart = () => {
    if (wishlistItems.length === 0) return
    addToast(`${wishlistItems.length} items added to cart!`, 'success')
    setWishlistItems([])
  }

  const sortedItems = [...wishlistItems].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price
    if (sortBy === 'price-desc') return b.price - a.price
    if (sortBy === 'newest') return b.id - a.id
    return 0
  })

  const discount = (orig, price) => Math.round(((orig - price) / orig) * 100)

  return (
    <div className='min-h-screen page-bg'>
      <StorefrontHeader />

      <main className='container-luxury px-4 py-10 md:py-14'>
        {/* Page Header */}
        <div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-10'>
          <div>
            <span className='label-overline block mb-2'>Your Curated Edit</span>
            <h1 className='font-serif text-3xl md:text-4xl font-bold text-[#1a1411] flex items-center gap-3'>
              Wishlist
              {wishlistItems.length > 0 && (
                <span className='badge-gold text-sm font-semibold'>
                  {wishlistItems.length}
                </span>
              )}
            </h1>
          </div>

          {wishlistItems.length > 0 && (
            <div className='flex items-center gap-3'>
              {/* Sort Dropdown */}
              <div className='relative'>
                <button
                  onClick={() => setSortOpen(p => !p)}
                  className='btn-outline flex items-center gap-2 text-sm py-2 px-4'
                >
                  Sort By <ChevronDown size={14} className={`transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
                </button>
                {sortOpen && (
                  <div className='absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-stone-100 z-20 overflow-hidden animate-slide-down'>
                    {[
                      { value: 'default', label: 'Default' },
                      { value: 'price-asc', label: 'Price: Low → High' },
                      { value: 'price-desc', label: 'Price: High → Low' },
                      { value: 'newest', label: 'Newest First' },
                    ].map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors
                          ${sortBy === opt.value ? 'text-amber-600 font-medium bg-amber-50' : 'text-[#1a1411]'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={moveAllToCart} className='btn-outline flex items-center gap-2 text-sm py-2 px-4'>
                <ShoppingBag size={14} /> Move All to Cart
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {wishlistItems.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-24 text-center animate-fade-in-up'>
            <div className='w-24 h-24 rounded-full bg-rose-50 flex items-center justify-center mb-6'>
              <Heart size={44} className='text-rose-300' />
            </div>
            <h2 className='font-serif text-2xl font-bold text-[#1a1411] mb-3'>Your wishlist is empty</h2>
            <p className='text-stone-400 max-w-xs mb-8'>
              Save pieces you love and come back to them anytime. Your curated collection starts here.
            </p>
            <button onClick={() => navigate('/')} className='btn-gold flex items-center gap-2'>
              <Sparkles size={16} /> Start Shopping <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* Product Grid */
          <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
            {sortedItems.map(item => (
              <div
                key={item.id}
                className='group card-luxury rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up'
              >
                {/* Image */}
                <div className='relative h-64 overflow-hidden bg-stone-100'>
                  <img
                    src={item.image}
                    alt={item.title}
                    className='w-full h-full object-cover img-zoom'
                  />
                  {/* Discount badge */}
                  <span className='absolute top-3 left-3 bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>
                    -{discount(item.originalPrice, item.price)}%
                  </span>
                  {/* Remove button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className='absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md
                      text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200
                      opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0'
                    title='Remove from wishlist'
                  >
                    <X size={14} />
                  </button>
                  {/* Heart overlay */}
                  <div className='absolute bottom-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md'>
                    <Heart size={14} className='text-rose-500 fill-rose-500' />
                  </div>
                </div>

                {/* Card Body */}
                <div className='p-4'>
                  <h3 className='font-medium text-[#1a1411] text-sm leading-tight line-clamp-1 font-serif mb-1.5'>
                    {item.title}
                  </h3>

                  {/* Rating */}
                  <div className='flex items-center gap-1.5 mb-2'>
                    <StarRating rating={item.rating} />
                    <span className='text-xs text-stone-400'>({item.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className='flex items-baseline gap-2 mb-3'>
                    <span className='font-bold text-[#1a1411] text-base'>₹{item.price.toLocaleString()}</span>
                    <span className='text-stone-400 text-xs line-through'>₹{item.originalPrice.toLocaleString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex gap-2'>
                    <button
                      onClick={() => addToCart(item)}
                      className='btn-gold flex-1 flex items-center justify-center gap-1 text-xs py-2 px-3'
                    >
                      <ShoppingBag size={12} /> Add to Cart
                    </button>
                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className='btn-outline flex items-center justify-center gap-1 text-xs py-2 px-3'
                    >
                      <Eye size={12} /> View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
