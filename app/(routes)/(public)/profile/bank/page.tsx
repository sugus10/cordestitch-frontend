import React from 'react'
import BankDetails from './BankDetails'
import ProfileContainer from '@/components/ProfileLayout'

function page() {
  return (
    <ProfileContainer>
    <BankDetails />
    </ProfileContainer>
  )
}

export default page