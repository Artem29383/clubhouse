import React from 'react';
import {useRouter} from "next/router";
import {Header} from "../../components/Header";
import BackButton from "../../components/BackButton";
import RoomComponent from './../../components/Room';
import {GetServerSideProps} from "next";
import { Axios } from "../../core/axios";

const Room = ({ room }) => {
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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { data } = await Axios.get('/rooms.json')
    const roomId = ctx.query.id
    const room = data.find((obj) => obj.id === roomId)
    return {
      props: {
        room,
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
}