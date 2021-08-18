import React, {useEffect} from 'react'
import { Header } from '../../components/Header'
import {Button} from "../../components/Button";
import ConversionCard from "../../components/ConversionCard";
import Link from 'next/link';
import {GetServerSideProps} from "next";
import clsx from "clsx";
import styles from './Styles.module.scss'
import axios from "axios";
export type RoomsTypes = {
  id: string;
  avatars: string[];
  guestsCount: number;
  speakersCount: number;
  title: string;
  guests: string[];
}

export default function RoomsPage({ rooms = [] }: { rooms: RoomsTypes[]}) {
  return (
    <>
      <Header />
      <div className="container">
        <div className='mt-40 d-flex align-items-center justify-content-between'>
          <h1>All conversations</h1>
          <Button color='green' onClick={() => {}}>+ Start room </Button>
        </div>
        <div className={clsx(styles.grid, 'mt-20')}>
          {rooms.map(room => (
            <Link key={room.id} href={`/rooms/${room.id}`}>
              <a>
                <ConversionCard
                  speakersCount={room.speakersCount}
                  guestsCount={room.guestsCount}
                  users={room.guests}
                  title={room.title} avatars={room.avatars}
                />
              </a>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const { data } = await axios.get('/rooms.json')
    return {
      props: {
        rooms: data,
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
