import { useState } from 'react'
import { useNavigate } from 'react-router'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'
import {
  Package, Truck, CheckCircle2, XCircle, Clock,
  MapPin, Star, RotateCcw, Eye, ChevronRight,
} from 'lucide-react'

const mockOrders = [
  {
    id: 'SML2025001234',
    date: '22 May 2025',
    status: 'Delivered',
    items: [
      {
        title: 'Linen Blazer Set',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=120&q=80',
        variant: 'Size M / Beige',
        qty: 1,
        price: 3499,
      },
      {
        title: 'Silk Slip Dress',
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=120&q=80',
        variant: 'Size S / Ivory',
        qty: 1,
        price: 2899,
      },
    ],
    total: 5754,
    deliveryDate: 'Delivered on 25 May 2025',
  },
  {
    id: 'SML2025001189',
    date: '18 May 2025',
    status: 'Shipped',
    items: [
      {
        title: 'Cashmere Blend Turtleneck',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=120&q=80',
        variant: 'Size L / Camel',
        qty: 2,
        price: 8598,
      },
    ],
    total: 7308,
    deliveryDate: 'Expected by 28 May 2025',
  },
  {
    id: 'SML2025001052',
    date: '10 May 2025',
    status: 'Processing',
    items: [
      {
        title: 'Leather Crossbody Bag',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=120&q=80',
        variant: 'Cognac Brown',
        qty: 1,
        price: 3999,
      },
    ],
    total: 3399,
    deliveryDate: 'Estimated 30 May 2025',
  },
  {
    id: 'SML2025000987',
    date: '2 May 2025',
    status: 'Cancelled',
    items: [
      {
        title: 'Tailored Wide-Leg Trousers',
        image: 'https://images.unsplash.com/photo-1594938298603-c8148c4b2ee7?auto=format&fit=crop&w=120&q=80',
        variant: 'Size M / Charcoal',
        qty: 1,
        price: 1999,
      },
    ],
    total: 1699,
    deliveryDate: 'Cancelled on 3 May 2025',
  },
]

const tabs = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

const statusConfig = {
  Processing: {
    icon: Clock,
    badgeClass: 'bg-amber-100 text-amber-700 border border-amber-200',
    iconClass: 'text-amber-500',
  },
  Shipped: {
    icon: Truck,
    badgeClass: 'bg-blue-100 text-blue-700 border border-blue-200',
    iconClass: 'text-blue-500',
  },
  Delivered: {
    icon: CheckCircle2,
    badgeClass: 'bg-green-100 text-green-700 border border-green-200',
    iconClass: 'text-green-500',
  },
  Cancelled: {
    icon: XCircle,
    badgeClass: 'bg-red-100 text-red-700 border border-red-200',
    iconClass: 'text-red-400',
  },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status]
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.badgeClass}`}>
      <Icon size={11} /> {status}
    </span>
  )
}

export default function Orders() {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All'
    ? mockOrders
    : mockOrders.filter(o => o.status === activeTab)

  const handleTrack = (id) => addToast(`Tracking order #${id}`, 'info')
  const handleReview = (title) => addToast(`Write a review for ${title}`, 'info')
  const handleReturn = (id) => addToast(`Return/Exchange initiated for #${id}`, 'info')

  return (
    <div className='min-h-screen page-bg'>
      <StorefrontHeader />

      <main className='container-luxury px-4 py-10 md:py-14'>
        {/* Header */}
        <div className='mb-8'>
          <span className='label-overline block mb-2'>Order History</span>
          <h1 className='font-serif text-3xl md:text-4xl font-bold text-[#1a1411]'>My Orders</h1>
        </div>

        {/* Filter Tabs */}
        <div className='flex items-center gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide'>
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                ${activeTab === tab
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'bg-white text-stone-500 border border-stone-200 hover:border-amber-300 hover:text-amber-600'
                }`}
            >
              {tab}
              {tab !== 'All' && (
                <span className={`ml-1.5 text-xs ${activeTab === tab ? 'text-amber-100' : 'text-stone-400'}`}>
                  ({mockOrders.filter(o => o.status === tab).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-20 text-center animate-fade-in-up'>
            <div className='w-20 h-20 rounded-full bg-stone-100 flex items-center justify-center mb-5'>
              <Package size={38} className='text-stone-300' />
            </div>
            <h3 className='font-serif text-xl font-semibold text-[#1a1411] mb-2'>No orders here</h3>
            <p className='text-stone-400 text-sm mb-6'>You don't have any {activeTab.toLowerCase()} orders yet.</p>
            <button onClick={() => navigate('/')} className='btn-gold'>Start Shopping</button>
          </div>
        ) : (
          <div className='space-y-5'>
            {filtered.map(order => {
              const cfg = statusConfig[order.status]
              const StatusIcon = cfg.icon
              const firstItem = order.items[0]
              const extraCount = order.items.length - 1

              return (
                <div
                  key={order.id}
                  className='card-luxury rounded-2xl overflow-hidden animate-fade-in-up'
                >
                  {/* Order Header */}
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-stone-100'>
                    <div className='flex flex-wrap items-center gap-3'>
                      <span className='font-mono text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded'>
                        #{order.id}
                      </span>
                      <span className='text-xs text-stone-400'>Placed on {order.date}</span>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>

                  {/* Product Row */}
                  <div className='px-5 py-4'>
                    <div className='flex items-start gap-4'>
                      {/* First item image */}
                      <div className='relative flex-shrink-0'>
                        <img
                          src={firstItem.image}
                          alt={firstItem.title}
                          className='w-16 h-16 object-cover rounded-xl border border-stone-100'
                        />
                        {extraCount > 0 && (
                          <div className='absolute -bottom-1 -right-1 w-6 h-6 bg-amber-500 rounded-full
                            flex items-center justify-center text-white text-xs font-bold shadow-sm'>
                            +{extraCount}
                          </div>
                        )}
                      </div>

                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-[#1a1411] text-sm font-serif leading-tight'>
                          {firstItem.title}
                        </p>
                        <p className='text-stone-400 text-xs mt-0.5'>{firstItem.variant}</p>
                        <p className='text-stone-400 text-xs'>Qty: {firstItem.qty}</p>
                        {extraCount > 0 && (
                          <p className='text-amber-600 text-xs mt-1 font-medium'>
                            +{extraCount} more item{extraCount > 1 ? 's' : ''}
                          </p>
                        )}
                      </div>

                      <div className='text-right flex-shrink-0'>
                        <p className='font-bold text-[#1a1411] text-base'>₹{order.total.toLocaleString()}</p>
                        <p className='text-stone-400 text-xs mt-0.5'>Total</p>
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className={`flex items-center gap-2 mt-3 text-xs rounded-lg px-3 py-2 w-fit
                      ${order.status === 'Delivered' ? 'bg-green-50 text-green-700'
                        : order.status === 'Cancelled' ? 'bg-red-50 text-red-500'
                          : 'bg-blue-50 text-blue-600'}`}
                    >
                      <StatusIcon size={12} />
                      {order.deliveryDate}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className='flex flex-wrap items-center gap-2 px-5 py-3 bg-stone-50 border-t border-stone-100'>
                    {order.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleTrack(order.id)}
                        className='btn-outline flex items-center gap-1.5 text-xs py-1.5 px-3'
                      >
                        <MapPin size={12} /> Track Order
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className={`flex items-center gap-1.5 text-xs py-1.5 px-3 rounded-lg font-medium transition-all duration-200
                        ${order.status === 'Delivered'
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'btn-outline'
                        }`}
                    >
                      <Eye size={12} /> View Details
                    </button>

                    {order.status === 'Delivered' && (
                      <>
                        <button
                          onClick={() => handleReturn(order.id)}
                          className='btn-outline flex items-center gap-1.5 text-xs py-1.5 px-3 text-stone-500'
                        >
                          <RotateCcw size={12} /> Return / Exchange
                        </button>
                        <button
                          onClick={() => handleReview(firstItem.title)}
                          className='btn-outline flex items-center gap-1.5 text-xs py-1.5 px-3 text-amber-600 border-amber-300 hover:bg-amber-50'
                        >
                          <Star size={12} /> Leave a Review
                        </button>
                      </>
                    )}

                    <div className='ml-auto'>
                      <ChevronRight size={16} className='text-stone-300' />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
