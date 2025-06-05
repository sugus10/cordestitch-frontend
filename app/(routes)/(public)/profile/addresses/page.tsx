import React from 'react'
import ProfileContainer from '@/components/ProfileLayout'
import ManageAddress from './Addresses'

function page() {
  return (
    <ProfileContainer>
    <ManageAddress />
    </ProfileContainer>
  )
}

export default page