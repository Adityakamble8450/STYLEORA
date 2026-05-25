import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useSelector, useDispatch } from 'react-redux'
import StorefrontHeader from '../components/StorefrontHeader'
import Footer from '../../../componants/Footer'
import { useToast } from '../../../componants/Toast'
import { clearAuthState } from '../../auth/state/auth.slice'
import { clearAuthSession } from '../../auth/services/auth.session'
import { clearCartState } from '../state/cart.slice'
import {
  User, ShoppingBag, Heart, MapPin, CreditCard,
  Bell, Shield, LogOut, Edit2, Trash2, Plus,
  CheckCircle2, ChevronRight, Package,
} from 'lucide-react'

const navItems = [
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: ShoppingBag },
  { id: 'wishlist', label: 'Wishlist', icon: Heart },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'payment', label: 'Payment Methods', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
]

const mockAddresses = [
  {
    id: 1,
    label: 'Home',
    line1: '42 Bandra West',
    line2: 'Near Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  },
  {
    id: 2,
    label: 'Office',
    line1: '14th Floor, BKC Complex',
    line2: 'Bandra Kurla Complex',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
  },
]

function Toggle({ checked, onChange }) {
  return (
    <button
      role='switch'
      aria-checked={checked}
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none
        ${checked ? 'bg-amber-500' : 'bg-stone-200'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200
          ${checked ? 'translate-x-5' : 'translate-x-0'}`}
      />
    </button>
  )
}

export default function UserProfile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { addToast } = useToast()
  const user = useSelector((state) => state.auth.user)

  const [activeNav, setActiveNav] = useState('profile')
  const [addresses, setAddresses] = useState(mockAddresses)
  const [gender, setGender] = useState('female')
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
  })
  const [form, setForm] = useState({
    fullName: user?.fullname || 'Anjali Mehta',
    email: user?.email || 'anjali@stylore.com',
    phone: user?.phone || '+91 98765 43210',
    dob: '1995-08-14',
  })

  const handleLogout = () => {
    clearAuthSession()
    dispatch(clearAuthState())
    dispatch(clearCartState())
    navigate('/login', { replace: true })
  }

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSave = () => {
    addToast('Profile updated successfully!', 'success')
  }

  const removeAddress = (id) => {
    setAddresses(prev => prev.filter(a => a.id !== id))
    addToast('Address removed.', 'info')
  }

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const initials = (user?.fullname || form.fullName || 'U').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className='min-h-screen page-bg'>
      <StorefrontHeader />

      <main className='container-luxury px-4 py-10 md:py-14'>
        {/* Page Header */}
        <div className='mb-8'>
          <span className='label-overline block mb-2'>Account</span>
          <h1 className='font-serif text-3xl md:text-4xl font-bold text-[#1a1411]'>My Profile</h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* ─── SIDEBAR ─── */}
          <aside className='lg:col-span-1'>
            <div className='card-luxury rounded-2xl p-6 sticky top-24'>
              {/* Avatar */}
              <div className='flex flex-col items-center text-center mb-6 pb-6 border-b border-stone-100'>
                <div className='w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3
                  bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-200'>
                  {initials}
                </div>
                <h3 className='font-serif text-lg font-semibold text-[#1a1411]'>{form.fullName}</h3>
                <span className='badge-gold text-xs mt-1'>Premium Member</span>
              </div>

              {/* Quick Stats */}
              <div className='grid grid-cols-3 gap-2 mb-6'>
                {[
                  { icon: Package, label: 'Orders', value: 4 },
                  { icon: Heart, label: 'Wishlist', value: 5 },
                  { icon: CreditCard, label: 'Cards', value: 2 },
                ].map(stat => (
                  <div key={stat.label} className='flex flex-col items-center bg-stone-50 rounded-xl p-2 text-center'>
                    <stat.icon size={14} className='text-amber-500 mb-1' />
                    <p className='font-bold text-[#1a1411] text-base leading-none'>{stat.value}</p>
                    <p className='text-stone-400 text-xs mt-0.5'>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Navigation */}
              <nav className='space-y-1 mb-6'>
                {navItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'orders') navigate('/orders')
                      else if (item.id === 'wishlist') navigate('/wishlist')
                      else setActiveNav(item.id)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                      ${activeNav === item.id
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'text-stone-600 hover:bg-amber-50 hover:text-amber-600'
                      }`}
                  >
                    <item.icon size={16} className={activeNav === item.id ? 'text-amber-600' : 'text-stone-400'} />
                    {item.label}
                    {activeNav === item.id && <ChevronRight size={14} className='ml-auto text-amber-400' />}
                  </button>
                ))}
              </nav>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className='w-full flex items-center justify-center gap-2 border-2 border-red-200 text-red-500
                  rounded-xl py-2.5 text-sm font-medium hover:bg-red-50 transition-all duration-200'
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <div className='lg:col-span-3 space-y-6'>
            {/* Personal Information */}
            <section className='card-luxury rounded-2xl p-6 md:p-8 animate-fade-in-up'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='font-serif text-xl font-semibold text-[#1a1411]'>Personal Information</h2>
                <span className='label-overline text-xs'>Edit Profile</span>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>
                <div>
                  <label className='text-xs text-stone-400 mb-1 block'>Full Name</label>
                  <input
                    className='input-luxury w-full'
                    name='fullName'
                    value={form.fullName}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className='text-xs text-stone-400 mb-1 block'>Phone Number</label>
                  <input
                    className='input-luxury w-full'
                    name='phone'
                    value={form.phone}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className='text-xs text-stone-400 mb-1 block'>Email Address</label>
                  <input
                    className='input-luxury w-full'
                    name='email'
                    value={form.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className='text-xs text-stone-400 mb-1 block'>Date of Birth</label>
                  <input
                    type='date'
                    className='input-luxury w-full'
                    name='dob'
                    value={form.dob}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              {/* Gender */}
              <div className='mb-6'>
                <label className='text-xs text-stone-400 mb-2 block'>Gender</label>
                <div className='flex items-center gap-2 flex-wrap'>
                  {['male', 'female', 'other'].map(g => (
                    <button
                      key={g}
                      onClick={() => setGender(g)}
                      className={`px-4 py-2 rounded-full text-sm font-medium border-2 capitalize transition-all duration-200
                        ${gender === g
                          ? 'bg-amber-500 border-amber-500 text-white'
                          : 'border-stone-200 text-stone-500 hover:border-amber-300'
                        }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} className='btn-gold flex items-center gap-2'>
                Save Changes
              </button>
            </section>

            {/* Saved Addresses */}
            <section className='card-luxury rounded-2xl p-6 md:p-8 animate-fade-in-up'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='font-serif text-xl font-semibold text-[#1a1411]'>Saved Addresses</h2>
                <button
                  onClick={() => addToast('Add address form coming soon!', 'info')}
                  className='btn-outline flex items-center gap-1.5 text-sm py-1.5 px-3'
                >
                  <Plus size={14} /> Add New
                </button>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                {addresses.map(addr => (
                  <div key={addr.id} className='border border-stone-200 rounded-xl p-4 relative group
                    hover:border-amber-300 transition-colors duration-200'>
                    <div className='flex items-center justify-between mb-2'>
                      <span className='badge-gold text-xs'>{addr.label}</span>
                      <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <button
                          onClick={() => addToast('Edit address form coming soon!', 'info')}
                          className='w-7 h-7 rounded-lg flex items-center justify-center hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors'
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => removeAddress(addr.id)}
                          className='w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 text-stone-400 hover:text-red-500 transition-colors'
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <p className='font-medium text-[#1a1411] text-sm'>{addr.line1}</p>
                    <p className='text-stone-400 text-xs mt-0.5'>{addr.line2}</p>
                    <p className='text-stone-400 text-xs'>{addr.city}, {addr.state} — {addr.pincode}</p>
                  </div>
                ))}

                {/* Add new card placeholder */}
                <button
                  onClick={() => addToast('Add address form coming soon!', 'info')}
                  className='border-2 border-dashed border-stone-200 rounded-xl p-4 flex flex-col items-center justify-center
                    gap-2 text-stone-300 hover:border-amber-300 hover:text-amber-400 transition-colors duration-200 min-h-[120px]'
                >
                  <Plus size={20} />
                  <span className='text-xs font-medium'>Add New Address</span>
                </button>
              </div>
            </section>

            {/* Notification Preferences */}
            <section className='card-luxury rounded-2xl p-6 md:p-8 animate-fade-in-up'>
              <h2 className='font-serif text-xl font-semibold text-[#1a1411] mb-6'>Notification Preferences</h2>

              <div className='space-y-4'>
                {[
                  { key: 'orderUpdates', label: 'Order Updates', desc: 'Status updates, tracking & delivery notifications' },
                  { key: 'promotions', label: 'Promotions & Offers', desc: 'Exclusive deals, sale alerts & special discounts' },
                  { key: 'newArrivals', label: 'New Arrivals', desc: 'Be the first to know about new collections' },
                ].map(item => (
                  <div key={item.key} className='flex items-center justify-between py-3 border-b border-stone-50 last:border-0'>
                    <div>
                      <p className='font-medium text-[#1a1411] text-sm'>{item.label}</p>
                      <p className='text-stone-400 text-xs mt-0.5'>{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[item.key]}
                      onChange={() => toggleNotif(item.key)}
                    />
                  </div>
                ))}
              </div>
            </section>

            {/* Linked Accounts */}
            <section className='card-luxury rounded-2xl p-6 md:p-8 animate-fade-in-up'>
              <h2 className='font-serif text-xl font-semibold text-[#1a1411] mb-6'>Linked Accounts</h2>

              <div className='flex items-center justify-between py-3 border border-stone-100 rounded-xl px-4'>
                <div className='flex items-center gap-3'>
                  {/* Google logo substitute */}
                  <div className='w-9 h-9 rounded-full bg-white border border-stone-200 flex items-center justify-center shadow-sm'>
                    <span className='text-sm font-bold bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent'>G</span>
                  </div>
                  <div>
                    <p className='font-medium text-[#1a1411] text-sm'>Google Account</p>
                    <p className='text-stone-400 text-xs'>{form.email}</p>
                  </div>
                </div>
                <span className='flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full'>
                  <CheckCircle2 size={11} /> Connected
                </span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
