import {
    Building2Icon,
    LockIcon,
    MapPinIcon,
    PencilIcon,
    SaveIcon,
    UserIcon,
    UsersIcon
} from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { dummyProfileData } from '../assets/assets'
import ChangePasswordModal from './ChangePasswordModal'
import DocumentsSection from './DocumentsSection'

const TABS = ["Resume", "Private Info", "Security"]

const Field = ({ label, value, onChange, type = "text", disabled = false }) => (
    <div>
        <label className='block text-xs text-slate-500 mb-1.5'>{label}</label>
        <input
            type={type}
            value={value || ""}
            disabled={disabled}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full bg-transparent border-0 border-b-2 rounded-none px-0 py-1.5 text-sm focus:ring-0 focus:outline-none ${
                disabled
                    ? "border-slate-800 text-slate-500 cursor-not-allowed"
                    : "border-slate-700 focus:border-indigo-500 text-slate-900"
            }`}
        />
    </div>
)

const ProfileForm = () => {
    const [profile, setProfile] = useState(dummyProfileData)
    const [photoPreview, setPhotoPreview] = useState(profile.image)
    const [activeTab, setActiveTab] = useState("Private Info")
    const [showPasswordModal, setShowPasswordModal] = useState(false)

    const [isEditing, setIsEditing] = useState(false)

    const updateField = (field) => (value) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handlePhotoChange = (e) => {
        if (!isEditing) return

        const file = e.target.files?.[0]
        if (!file) return

        setPhotoPreview(URL.createObjectURL(file))
    }

    const handleSave = () => {
        const savedDataArray = [
            {
                ...profile,
                image: photoPreview
            }
        ]

        console.log("Updated Profile Data Array:", savedDataArray)

        toast.success("Profile updated successfully")
        setIsEditing(false)
    }

    return (
        <div className='card shadow-lg p-5 sm:p-8 mb-6'>

            <div className='grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 md:gap-10 pb-6 mb-6 border-b-2 border-slate-800'>

                <div className='relative w-24 h-24 shrink-0 mx-auto md:mx-0'>
                    {photoPreview ? (
                        <img
                            src={photoPreview}
                            alt='Profile'
                            className='w-24 h-24 rounded-full object-cover border-2 border-indigo-600'
                        />
                    ) : (
                        <div className='w-24 h-24 rounded-full bg-slate-100 border-2 border-indigo-600 flex items-center justify-center'>
                            <UserIcon className='w-10 h-10 text-slate-500' />
                        </div>
                    )}

                    {isEditing && (
                        <label className='absolute bottom-0 right-0 p-1.5 bg-indigo-600 border-2 border-[#121212] rounded-full cursor-pointer hover:bg-indigo-700'>
                            <PencilIcon className='w-3.5 h-3.5 text-slate-950' />
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={handlePhotoChange}
                            />
                        </label>
                    )}
                </div>

                <div className='min-w-0'>
                    {isEditing ? (
                        <div className='grid grid-cols-2 gap-4 max-w-xs mb-4'>
                            <Field
                                label='First Name'
                                value={profile.firstName}
                                onChange={updateField("firstName")}
                                disabled={profile.isDeleted}
                            />
                            <Field
                                label='Last Name'
                                value={profile.lastName}
                                onChange={updateField("lastName")}
                                disabled={profile.isDeleted}
                            />
                        </div>
                    ) : (
                        <h2 className='text-lg font-medium text-slate-900 mb-4'>
                            {profile.firstName} {profile.lastName}
                        </h2>
                    )}

                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl'>
                        <Field
                            label='Job Position'
                            value={profile.position}
                            onChange={updateField("position")}
                            disabled={profile.isDeleted || !isEditing}
                        />

                        <Field
                            label='Email'
                            value={profile.email}
                            onChange={updateField("email")}
                            type='email'
                            disabled={profile.isDeleted || !isEditing}
                        />

                        <Field
                            label='Mobile'
                            value={profile.mobile}
                            onChange={updateField("mobile")}
                            disabled={profile.isDeleted || !isEditing}
                        />
                    </div>
                </div>

                <div className='space-y-3 md:min-w-48'>
                    <div className='flex items-start gap-2'>
                        <Building2Icon className='w-4 h-4 text-slate-500 mt-0.5 shrink-0' />
                        <div>
                            <p className='text-xs text-slate-500'>Company</p>
                            <p className='text-sm text-slate-800'>{profile.company}</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-2'>
                        <UsersIcon className='w-4 h-4 text-slate-500 mt-0.5 shrink-0' />
                        <div>
                            <p className='text-xs text-slate-500'>Department</p>
                            <p className='text-sm text-slate-800'>{profile.department}</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-2'>
                        <UserIcon className='w-4 h-4 text-slate-500 mt-0.5 shrink-0' />
                        <div>
                            <p className='text-xs text-slate-500'>Manager</p>
                            <p className='text-sm text-slate-800'>{profile.manager}</p>
                        </div>
                    </div>

                    <div className='flex items-start gap-2'>
                        <MapPinIcon className='w-4 h-4 text-slate-500 mt-0.5 shrink-0' />
                        <div>
                            <p className='text-xs text-slate-500'>Location</p>
                            <p className='text-sm text-slate-800'>{profile.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            {profile.isDeleted && (
                <div className='mb-6 p-4 bg-rose-50 border-2 border-rose-200 text-center'>
                    <p className='text-rose-600 font-medium tracking-tight'>
                        Account Deactivated
                    </p>
                    <p className='text-sm text-rose-500 mt-0.5'>
                        You can no longer update your profile.
                    </p>
                </div>
            )}

            <div className='flex flex-wrap gap-2 mb-6'>
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        type='button'
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-xs font-medium border-2 ${
                            activeTab === tab
                                ? "bg-indigo-600 border-indigo-600 text-slate-950"
                                : "border-slate-700 text-slate-500 hover:border-indigo-500 hover:text-indigo-400"
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {activeTab === "Resume" && <DocumentsSection />}

            {activeTab === "Private Info" && (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-5'>
                    <Field
                        label='Date of Birth'
                        type='date'
                        value={profile.dob}
                        onChange={updateField("dob")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Residing Address'
                        value={profile.address}
                        onChange={updateField("address")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Nationality'
                        value={profile.nationality}
                        onChange={updateField("nationality")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Personal Email'
                        type='email'
                        value={profile.personalEmail}
                        onChange={updateField("personalEmail")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Gender'
                        value={profile.gender}
                        onChange={updateField("gender")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Marital Status'
                        value={profile.maritalStatus}
                        onChange={updateField("maritalStatus")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Date of Joining'
                        type='date'
                        value={profile.dateOfJoining}
                        onChange={updateField("dateOfJoining")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Emp Code'
                        value={profile.empCode}
                        disabled
                    />

                    <Field
                        label='PF Rate (%)'
                        type='number'
                        value={profile.pfRate}
                        onChange={updateField("pfRate")}
                        disabled={profile.isDeleted || !isEditing}
                    />

                    <Field
                        label='Professional Tax'
                        type='number'
                        value={profile.professionalTax}
                        onChange={updateField("professionalTax")}
                        disabled={profile.isDeleted || !isEditing}
                    />
                </div>
            )}

            {activeTab === "Security" && (
                <div className='card max-w-md p-5 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2.5 bg-slate-100'>
                            <LockIcon className='w-5 h-5 text-slate-600' />
                        </div>

                        <div>
                            <p className='font-medium text-slate-900'>Password</p>
                            <p className='text-sm text-slate-500'>
                                Update your account password
                            </p>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={() => setShowPasswordModal(true)}
                        className='btn-secondary text-sm'
                    >
                        Change
                    </button>
                </div>
            )}

            {!profile.isDeleted && activeTab !== "Resume" && activeTab !== "Security" && (
                <div className='flex justify-end pt-6 mt-6 border-t-2 border-slate-800'>
                    {isEditing ? (
                        <button
                            type='button'
                            onClick={handleSave}
                            className='btn-primary flex items-center gap-2 justify-center w-full sm:w-auto'
                        >
                            <SaveIcon className='w-4 h-4' />
                            Save Updates
                        </button>
                    ) : (
                        <button
                            type='button'
                            onClick={() => setIsEditing(true)}
                            className='btn-secondary flex items-center gap-2 justify-center w-full sm:w-auto'
                        >
                            <PencilIcon className='w-4 h-4' />
                            Edit
                        </button>
                    )}
                </div>
            )}

            <ChangePasswordModal
                open={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
            />

        </div>
    )
}

export default ProfileForm