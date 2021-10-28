import { useRouter } from 'next/router'
import React from 'react'
import { Header } from '../../components/Header'
import { Profile } from '../../components/Profile'
import { wrapper } from "../../redux/store";
import { checkAuth } from "../../helpers/checkAuth";
import { Api } from "../../api";

export default function ProfilePage() {
  const router = useRouter()
  const { id } = router.query

  return (
    <>
      <Header />
      <div className="container mt-30">
        <Profile
          avatarUrl="https://sun9-4.userapi.com/impf/c841135/v841135725/35825/7IY8mBeEMFE.jpg?size=960x720&quality=96&sign=1e35dd7dfbb370af138d03786337fbf7&type=album"
          fullname="Artem Averyannov"
          username="Denvell"
          about="My NextJS"
        />
      </div>
    </>
  )
}

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  try {
    const user = await checkAuth(ctx, store);

    if (!user) {
      return {
        props: {},
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }
  } catch (error) {
  }
})
