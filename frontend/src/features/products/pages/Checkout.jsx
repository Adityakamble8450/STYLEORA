import { useState } from 'react'
import { useNavigate } from 'react-router'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'
import {
  MapPin, Phone, Mail, ChevronRight, Check, Lock,
  CreditCard, Smartphone, Building2, CheckCircle2,
  ShoppingBag, Tag, Truck, Shield,
} from 'lucide-react'

const savedAddresses = [
  {
    id: 1,
    name: 'Home',
    line1: '42 Bandra West',
    line2: 'Near Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    phone: '98765 43210',
  },
  {
    id: 2,
    name: 'Office',
    line1: '14th Floor, BKC Complex',
    line2: 'Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    phone: '91234 56789',
  },
]

const mockCartItems = [
  {
    id: 1,
    title: 'Linen Blazer Set',
    image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&w=200&q=80',
    qty: 1,
    size: 'M',
    price: 1699,
  },
  {
    id: 2,
    title: 'Silk Slip Dress',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=200&q=80',
    qty: 1,
    size: 'S',
    price: 1599,
  },
  {
    id: 3,
    title: 'Cashmere Blend Turtleneck',
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=200&q=80',
    qty: 1,
    size: 'L',
    price: 1001,
  },
]

const orderSummary = {
  subtotal: 4299,
  discount: 645,
  shipping: 0,
  total: 3654,
}

const steps = [
  { id: 1, label: 'Address' },
  { id: 2, label: 'Review' },
  { id: 3, label: 'Payment' },
  { id: 4, label: 'Confirm' },
]

const ORDER_ID = 'SML2025' + Math.floor(10000 + Math.random() * 90000)

export default function Checkout() {
  const navigate = useNavigate()
  const addToast = useToast()

  const [currentStep, setCurrentStep] = useState(1)
  const [selectedAddress, setSelectedAddress] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('upi')
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '',
    address1: '', address2: '', city: '', state: '', pincode: '',
  })

  const handleNextStep = () => {
    if (currentStep === 1 && selectedAddress === null && !form.fullName) {
      addToast('Please select or enter a delivery address.', 'error')
      return
    }
    if (currentStep === 3) {
      addToast('Payment successful! Order placed.', 'success')
    }
    setCurrentStep(prev => Math.min(prev + 1, 4))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  return (
    <div className='min-h-screen page-bg'>
      <StorefrontHeader />

      <main className='container-luxury px-4 py-8 md:py-12'>
        {/* Progress Stepper */}
        <div className='mb-10'>
          <div className='flex items-center justify-between relative max-w-2xl mx-auto'>
            {/* Connecting line */}
            <div className='absolute top-5 left-0 right-0 h-0.5 bg-stone-200 z-0' />
            <div
              className='absolute top-5 left-0 h-0.5 bg-amber-500 z-0 transition-all duration-500'
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map(step => (
              <div key={step.id} className='relative z-10 flex flex-col items-center gap-2'>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 border-2
                    ${currentStep > step.id
                      ? 'bg-amber-500 border-amber-500 text-white'
                      : currentStep === step.id
                        ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200'
                        : 'bg-white border-stone-300 text-stone-400'
                    }`}
                >
                  {currentStep > step.id ? <Check size={16} /> : step.id}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${currentStep >= step.id ? 'text-amber-600' : 'text-stone-400'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto'>
          {/* Main Content */}
          <div className='lg:col-span-2'>
            {/* STEP 1 — DELIVERY ADDRESS */}
            {currentStep === 1 && (
              <div className='animate-fade-in-up'>
                <h2 className='section-heading mb-6'>Delivery Address</h2>

                {/* Saved Addresses */}
                <div className='mb-8'>
                  <p className='label-overline mb-4'>Saved Addresses</p>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={addr.id}
                        onClick={() => setSelectedAddress(idx)}
                        className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${selectedAddress === idx
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 bg-white hover:border-amber-300'}`}
                      >
                        <div className='flex items-center justify-between mb-2'>
                          <span className='badge-gold text-xs'>{addr.name}</span>
                          {selectedAddress === idx && (
                            <div className='w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center'>
                              <Check size={12} className='text-white' />
                            </div>
                          )}
                        </div>
                        <p className='font-medium text-[#1a1411] text-sm'>{addr.line1}</p>
                        <p className='text-stone-500 text-xs mt-0.5'>{addr.line2}</p>
                        <p className='text-stone-500 text-xs'>{addr.city}, {addr.state} — {addr.pincode}</p>
                        <div className='flex items-center gap-1 mt-2 text-stone-400 text-xs'>
                          <Phone size={10} /> {addr.phone}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* New Address Form */}
                <div>
                  <p className='label-overline mb-4'>Or Enter a New Address</p>
                  <div className='card-luxury p-6 rounded-2xl space-y-4'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                      <div>
                        <label className='text-xs text-stone-500 mb-1 block'>Full Name</label>
                        <input className='input-luxury w-full' name='fullName' placeholder='Anjali Mehta'
                          value={form.fullName} onChange={handleFormChange} />
                      </div>
                      <div>
                        <label className='text-xs text-stone-500 mb-1 block'>Phone Number</label>
                        <input className='input-luxury w-full' name='phone' placeholder='+91 98765 43210'
                          value={form.phone} onChange={handleFormChange} />
                      </div>
                    </div>
                    <div>
                      <label className='text-xs text-stone-500 mb-1 block'>Email Address</label>
                      <input className='input-luxury w-full' name='email' placeholder='anjali@email.com'
                        value={form.email} onChange={handleFormChange} />
                    </div>
                    <div>
                      <label className='text-xs text-stone-500 mb-1 block'>Address Line 1</label>
                      <input className='input-luxury w-full' name='address1' placeholder='House / Flat No., Street'
                        value={form.address1} onChange={handleFormChange} />
                    </div>
                    <div>
                      <label className='text-xs text-stone-500 mb-1 block'>Address Line 2 <span className='text-stone-400'>(Optional)</span></label>
                      <input className='input-luxury w-full' name='address2' placeholder='Landmark, Area'
                        value={form.address2} onChange={handleFormChange} />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                      <div>
                        <label className='text-xs text-stone-500 mb-1 block'>City</label>
                        <input className='input-luxury w-full' name='city' placeholder='Mumbai'
                          value={form.city} onChange={handleFormChange} />
                      </div>
                      <div>
                        <label className='text-xs text-stone-500 mb-1 block'>State</label>
                        <input className='input-luxury w-full' name='state' placeholder='Maharashtra'
                          value={form.state} onChange={handleFormChange} />
                      </div>
                      <div>
                        <label className='text-xs text-stone-500 mb-1 block'>Pincode</label>
                        <input className='input-luxury w-full' name='pincode' placeholder='400001'
                          value={form.pincode} onChange={handleFormChange} />
                      </div>
                    </div>
                  </div>
                </div>

                <button onClick={handleNextStep} className='btn-gold w-full mt-6 flex items-center justify-center gap-2'>
                  Continue to Review <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 2 — ORDER REVIEW */}
            {currentStep === 2 && (
              <div className='animate-fade-in-up'>
                <h2 className='section-heading mb-6'>Review Your Order</h2>

                <div className='space-y-4 mb-6'>
                  {mockCartItems.map(item => (
                    <div key={item.id} className='card-luxury rounded-xl p-4 flex items-center gap-4'>
                      <img src={item.image} alt={item.title}
                        className='w-20 h-20 object-cover rounded-lg flex-shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <p className='font-medium text-[#1a1411] font-serif text-sm md:text-base truncate'>{item.title}</p>
                        <p className='text-stone-400 text-xs mt-0.5'>Size: {item.size} &nbsp;·&nbsp; Qty: {item.qty}</p>
                      </div>
                      <p className='font-semibold text-[#1a1411] text-sm'>₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                {/* Delivery Info */}
                {selectedAddress !== null && (
                  <div className='card-luxury rounded-xl p-4 mb-6 flex items-start gap-3'>
                    <MapPin size={18} className='text-amber-500 mt-0.5 flex-shrink-0' />
                    <div>
                      <p className='text-xs text-stone-400 mb-0.5'>Delivering to</p>
                      <p className='font-medium text-[#1a1411] text-sm'>
                        {savedAddresses[selectedAddress].line1}, {savedAddresses[selectedAddress].city}
                      </p>
                      <p className='text-stone-400 text-xs'>{savedAddresses[selectedAddress].state} — {savedAddresses[selectedAddress].pincode}</p>
                    </div>
                    <button onClick={() => setCurrentStep(1)}
                      className='ml-auto text-amber-600 text-xs hover:underline font-medium'>
                      Change
                    </button>
                  </div>
                )}

                <button onClick={handleNextStep} className='btn-gold w-full flex items-center justify-center gap-2'>
                  Proceed to Payment <ChevronRight size={16} />
                </button>
              </div>
            )}

            {/* STEP 3 — PAYMENT */}
            {currentStep === 3 && (
              <div className='animate-fade-in-up'>
                <h2 className='section-heading mb-6'>Payment Method</h2>

                <div className='space-y-3 mb-6'>
                  {/* UPI */}
                  <label className={`card-luxury rounded-xl p-4 flex items-center gap-3 cursor-pointer border-2 transition-all
                    ${paymentMethod === 'upi' ? 'border-amber-500 bg-amber-50' : 'border-transparent'}`}>
                    <input type='radio' name='payment' value='upi'
                      checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')}
                      className='accent-amber-500' />
                    <Smartphone size={20} className='text-amber-600' />
                    <div>
                      <p className='font-medium text-[#1a1411] text-sm'>UPI</p>
                      <p className='text-stone-400 text-xs'>Pay via Google Pay, PhonePe, Paytm & more</p>
                    </div>
                  </label>

                  {/* Net Banking */}
                  <label className={`card-luxury rounded-xl p-4 flex items-center gap-3 cursor-pointer border-2 transition-all
                    ${paymentMethod === 'netbanking' ? 'border-amber-500 bg-amber-50' : 'border-transparent'}`}>
                    <input type='radio' name='payment' value='netbanking'
                      checked={paymentMethod === 'netbanking'} onChange={() => setPaymentMethod('netbanking')}
                      className='accent-amber-500' />
                    <Building2 size={20} className='text-amber-600' />
                    <div>
                      <p className='font-medium text-[#1a1411] text-sm'>Net Banking</p>
                      <p className='text-stone-400 text-xs'>All major banks supported</p>
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className={`card-luxury rounded-xl p-4 flex items-start gap-3 cursor-pointer border-2 transition-all
                    ${paymentMethod === 'card' ? 'border-amber-500 bg-amber-50' : 'border-transparent'}`}>
                    <input type='radio' name='payment' value='card'
                      checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')}
                      className='accent-amber-500 mt-0.5' />
                    <CreditCard size={20} className='text-amber-600 flex-shrink-0' />
                    <div className='flex-1'>
                      <p className='font-medium text-[#1a1411] text-sm'>Credit / Debit Card</p>
                      <p className='text-stone-400 text-xs mb-3'>Visa, Mastercard, RuPay accepted</p>
                      {paymentMethod === 'card' && (
                        <div className='space-y-3 mt-2'>
                          <input className='input-luxury w-full text-sm' placeholder='Card Number' maxLength={19} />
                          <div className='grid grid-cols-2 gap-3'>
                            <input className='input-luxury w-full text-sm' placeholder='MM / YY' />
                            <input className='input-luxury w-full text-sm' placeholder='CVV' maxLength={3} type='password' />
                          </div>
                          <input className='input-luxury w-full text-sm' placeholder='Name on Card' />
                        </div>
                      )}
                    </div>
                  </label>

                  {/* EMI */}
                  <label className={`card-luxury rounded-xl p-4 flex items-center gap-3 cursor-pointer border-2 transition-all
                    ${paymentMethod === 'emi' ? 'border-amber-500 bg-amber-50' : 'border-transparent'}`}>
                    <input type='radio' name='payment' value='emi'
                      checked={paymentMethod === 'emi'} onChange={() => setPaymentMethod('emi')}
                      className='accent-amber-500' />
                    <Tag size={20} className='text-amber-600' />
                    <div>
                      <p className='font-medium text-[#1a1411] text-sm'>EMI</p>
                      <p className='text-stone-400 text-xs'>0% EMI available on select cards</p>
                    </div>
                  </label>
                </div>

                <button onClick={handleNextStep}
                  className='btn-gold w-full flex items-center justify-center gap-2 text-base'>
                  <Lock size={16} /> Pay ₹{orderSummary.total.toLocaleString()} Securely
                </button>

                <div className='flex items-center justify-center gap-2 mt-4 text-stone-400 text-xs'>
                  <Shield size={12} /> 256-bit SSL encrypted & 100% secure payment
                </div>
              </div>
            )}

            {/* STEP 4 — CONFIRMATION */}
            {currentStep === 4 && (
              <div className='animate-scale-in flex flex-col items-center text-center py-12'>
                <div className='w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6'>
                  <CheckCircle2 size={52} className='text-green-500' />
                </div>
                <span className='label-overline mb-2'>Thank you!</span>
                <h2 className='font-serif text-3xl md:text-4xl font-bold text-[#1a1411] mb-3'>
                  Order Placed Successfully!
                </h2>
                <p className='text-stone-400 mb-2'>
                  Your order <span className='font-semibold text-[#1a1411]'>#{ORDER_ID}</span> has been confirmed.
                </p>
                <p className='text-stone-400 mb-8'>
                  Estimated delivery: <span className='font-semibold text-amber-600'>28 – 30 May 2025</span>
                </p>

                <div className='card-luxury rounded-2xl p-6 w-full max-w-sm mb-8'>
                  <div className='flex items-center gap-3 mb-4'>
                    <Truck size={18} className='text-amber-500' />
                    <span className='text-sm font-medium text-[#1a1411]'>Shipping to</span>
                  </div>
                  <p className='text-stone-600 text-sm'>{savedAddresses[selectedAddress]?.line1 || 'Your saved address'}</p>
                  <p className='text-stone-400 text-xs'>{savedAddresses[selectedAddress]?.city}, {savedAddresses[selectedAddress]?.state}</p>
                </div>

                <div className='flex flex-col sm:flex-row gap-3 w-full max-w-sm'>
                  <button onClick={() => navigate('/orders')} className='btn-gold flex-1 flex items-center justify-center gap-2'>
                    <ShoppingBag size={16} /> View Orders
                  </button>
                  <button onClick={() => navigate('/')} className='btn-outline flex-1'>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar (hidden on step 4) */}
          {currentStep !== 4 && (
            <div className='lg:col-span-1'>
              <div className='card-luxury rounded-2xl p-6 sticky top-24'>
                <h3 className='font-serif text-lg font-semibold text-[#1a1411] mb-5'>Order Summary</h3>

                {/* Items preview */}
                <div className='space-y-3 mb-5'>
                  {mockCartItems.map(item => (
                    <div key={item.id} className='flex items-center gap-3'>
                      <img src={item.image} alt={item.title} className='w-12 h-12 object-cover rounded-lg' />
                      <div className='flex-1 min-w-0'>
                        <p className='text-xs font-medium text-[#1a1411] truncate'>{item.title}</p>
                        <p className='text-stone-400 text-xs'>Qty: {item.qty}</p>
                      </div>
                      <p className='text-xs font-semibold text-[#1a1411]'>₹{item.price.toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className='border-t border-stone-100 pt-4 space-y-3'>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-stone-500'>Subtotal</span>
                    <span className='font-medium text-[#1a1411]'>₹{orderSummary.subtotal.toLocaleString()}</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-stone-500'>Discount (15%)</span>
                    <span className='font-medium text-green-600'>−₹{orderSummary.discount.toLocaleString()}</span>
                  </div>
                  <div className='flex items-center justify-between text-sm'>
                    <span className='text-stone-500'>Shipping</span>
                    <span className='font-medium text-green-600 flex items-center gap-1'>
                      <Truck size={12} /> FREE
                    </span>
                  </div>
                  <div className='border-t border-stone-100 pt-3 flex items-center justify-between'>
                    <span className='font-semibold text-[#1a1411]'>Total</span>
                    <span className='font-bold text-lg text-[#1a1411]'>₹{orderSummary.total.toLocaleString()}</span>
                  </div>
                </div>

                <div className='mt-5 flex items-center gap-2 bg-green-50 rounded-lg px-3 py-2 text-green-700 text-xs'>
                  <Tag size={12} /> You save ₹{orderSummary.discount.toLocaleString()} on this order!
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
