import AuthLayout from '@/components/AuthLayout'
import React from 'react'

function OffersPage() {
  return (
    <div>OffersPage</div>
  )
}
OffersPage.getLayout = function getLayout(page:JSX.Element) {
    return (
      <AuthLayout>
        {page}
      </AuthLayout>
    )
  }
export default OffersPage