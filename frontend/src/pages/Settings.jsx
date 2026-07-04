import ProfileForm from "../components/ProfileForm"

const Settings = () => {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-orange-100">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences</p>
      </div>

      <ProfileForm/>
    </div>
  )
}

export default Settings
