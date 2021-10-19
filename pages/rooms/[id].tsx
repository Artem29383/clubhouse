import React, { useEffect, useRef } from 'react';
import { useRouter } from "next/router";
import { Header } from "../../components/Header";
import BackButton from "../../components/BackButton";
import RoomComponent from './../../components/Room';
import { Api } from "../../api";
import { wrapper } from "../../redux/store";
import { checkAuth } from "../../helpers/checkAuth";
import { useSocket } from "../../hooks/useSocket";
import { io, Socket } from "socket.io-client";


const Room = ({ room }) => {
  // const socket = useSocket();
  const router = useRouter()
  const { id } = router.query


  return (
    <>
      <Header />
      <div className='container mt-40'>
        <BackButton href='/rooms' title='All rooms' />
      </div>
      <RoomComponent title={room.title} />
    </>
  );
};

export default Room;

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

    const roomId = ctx.query.id

    const room = await Api(ctx).getRoom(roomId as string);

    return {
      props: {
        room,
      },
    }
  } catch (error) {
    return {
      props: {},
      redirect: {
        destination: '/rooms',
        permanent: false,
      }
    }
  }
})
