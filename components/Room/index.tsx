import clsx from 'clsx'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'

import styles from './Room.module.scss'
import { Button } from "../Button";
import { UserData } from "../../pages";
import { selectUserData } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { Speaker } from "../Speaker";
import { useRouter } from "next/router";
import { io, Socket } from "socket.io-client";

interface RoomProps {
  title: string
}

const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUserData);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const roomId = router.query.id;
  // const socket = useSocket();

  const socketRef = useRef<Socket>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.info('IN')
      socketRef.current = io('http://localhost:4000');

      socketRef.current.emit('CLIENT@ROOMS:JOIN', { user, roomId });

      socketRef.current.on('SERVER@ROOMS:LEAVE', (user: UserData) => {
        setUsers((prev) => prev.filter((obj) => obj.id !== user.id));
      });

      socketRef.current.on('SERVER@ROOMS:JOIN', allUsers => {
        setUsers(allUsers);
      })
    }
    return () => {
      socketRef.current.disconnect();
    }
  }, [])
  console.log('users', users)
  return (
    <div className={styles.wrapper}>
      <div className='d-flex align-items-center justify-content-between'>
        <h2 className={styles.title}>{title}</h2>
        <div className={clsx('d-flex align-items-center', styles.actionButtons)}>
          <Link href='/rooms'>
            <Button onClick={() => {
            }} color='gray' className={styles.leaveButton}>
              <img width={18} height={18} src='/static/peace.png' alt='Hand black' />
              Leave quietly
            </Button>
          </Link>
        </div>
      </div>

      <div className='users'>
        {/* {isLoading && <div className="loader"></div>} */}
        {users.map((obj, iun) => (
          <Speaker key={`${obj.fullName}${obj.id}`} {...obj} />
        ))}
      </div>
    </div>
  )
}

export default Room;
