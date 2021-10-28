import React, { useEffect, useState } from 'react'
import { Header } from '../../components/Header'
import { Button } from "../../components/Button";
import ConversionCard from "../../components/ConversionCard";
import Link from 'next/link';
import { NextPage } from "next";
import clsx from "clsx";
import Head from 'next/head'
import styles from './Styles.module.scss'
import { checkAuth } from "../../helpers/checkAuth";
import { StartRoomModal } from "../../components/StartRoomModal";
import { Api } from "../../api";
import { wrapper } from "../../redux/store";
import { setRooms, setRoomSpeakers } from "../../redux/slices/roomsSlice";
import { useSelector } from "react-redux";
import { selectRooms } from "../../redux/selectors";
import { useSocket } from "../../hooks/useSocket";
import { useActionWithPayload } from "../../hooks/useAction";


const RoomsPage: NextPage = () => {
  const [visibleModal, setVisibleModal] = useState(false);
  const rooms = useSelector(selectRooms);
  const setRoomDispatch = useActionWithPayload(setRoomSpeakers);
  const socket = useSocket();

  useEffect(() => {
    socket.on('SERVER@ROOMS:HOME', ({ roomId, speakers }) => {
      setRoomDispatch({
        roomId, speakers
      });
    })
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Clubhouse: Drop-in audio chat</title>
      </Head>
      <Header />
      <div className="container">
        <div className='mt-40 d-flex align-items-center justify-content-between'>
          <h1>All conversations</h1>
          <Button
            onClick={() => setVisibleModal(true)}
            color="green">
            + Start room
          </Button>
        </div>
        {visibleModal && <StartRoomModal onClose={() => setVisibleModal(false)} />}
        <div className={clsx(styles.grid, 'mt-20')}>
          {rooms.map(room => (
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <a>
                <ConversionCard
                  title={room.title}
                  speakers={room.speakers || []}
                  listenersCount={room.listenersCount}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export default RoomsPage;

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

    const rooms = await Api(ctx).getRooms();
    store.dispatch(setRooms(rooms));

    return {
      props: {
        // user,
        // rooms,
      },
    }
  } catch (error) {
    console.log('ERROR!')
    return {
      props: {
        rooms: [],
      },
    }
  }
})
