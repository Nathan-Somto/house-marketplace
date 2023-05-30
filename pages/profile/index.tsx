import AuthLayout from "@/components/AuthLayout"

function ProfilePage() {
  return (
    <div>ProfilePage</div>
  )
}
ProfilePage.getLayout = function getLayout(page:JSX.Element) {
    return (
      <AuthLayout>
        {page}
      </AuthLayout>
    )
  }
export default ProfilePage