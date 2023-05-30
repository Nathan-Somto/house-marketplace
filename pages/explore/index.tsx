import AuthLayout from '@/components/AuthLayout';
import React from 'react'

function ExplorePage() {
  return (
    <div>ExplorePage</div>
  )
}

ExplorePage.getLayout = function getLayout(page:JSX.Element) {
    return (
      <AuthLayout>
        {page}
      </AuthLayout>
    )
  }
export default ExplorePage;