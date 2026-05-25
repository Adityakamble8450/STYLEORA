import React from 'react'
import StorefrontHeader from '../features/products/components/StorefrontHeader'
import Footer from './Footer'

/**
 * PageWrapper — wraps a page with the shared StorefrontHeader and Footer.
 * Use `noFooter` prop to skip the Footer (e.g. checkout flows).
 */
const PageWrapper = ({ children, noFooter = false, className = '' }) => {
  return (
    <div className={`min-h-screen page-bg flex flex-col ${className}`}>
      <StorefrontHeader />
      <main className="flex-1">
        {children}
      </main>
      {!noFooter && <Footer />}
    </div>
  )
}

export default PageWrapper
