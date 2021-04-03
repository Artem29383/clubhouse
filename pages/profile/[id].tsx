import { useRouter } from 'next/router'
import React from 'react'
import { Header } from '../../components/Header'
import { Profile } from '../../components/Profile'

export default function ProfilePage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Header />
      <div className="container mt-30">
        <Profile
          avatarUrl="https://sun9-42.userapi.com/impf/c837737/v837737799/2b977/eRmA60iM_p0.jpg?size=2052x2030&quality=96&sign=e1d123cf5de1b980fbb14ebc067d9d38&type=album"
          fullname="Artem Averyannov"
          username="Denvell"
          about="My NextJS"
        />
      </div>
    </>
  )
}
