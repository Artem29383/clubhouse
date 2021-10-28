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
import Peer from 'simple-peer';
import { useSocket } from "../../hooks/useSocket";

interface RoomProps {
  title: string
}

let peers = [];

const Room: React.FC<RoomProps> = ({ title }) => {
  const router = useRouter();
  const user = useSelector(selectUserData);
  const [users, setUsers] = React.useState<UserData[]>([]);
  const roomId = router.query.id;
  const socket = useSocket();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
        })
        .then((stream) => {
          socket.emit('CLIENT@ROOMS:JOIN', {
            user,
            roomId,
          });

          socket.on('SERVER@ROOMS:JOIN', (allUsers: UserData[]) => {
            console.log(allUsers);

            setUsers(allUsers);

            allUsers.forEach((speaker) => {
              if (user.id !== speaker.id && !peers.find((obj) => obj.id !== speaker.id)) {
                const incomePeer = new Peer({
                  initiator: true,
                  trickle: false,
                  stream,
                });

                incomePeer.on('signal', (signal) => {

                  socket.emit('CLIENT@ROOMS:CALL', {
                    targetUserId: speaker.id,
                    callerUserId: user.id,
                    roomId,
                    signal,
                  });
                  peers.push({
                    peer: incomePeer,
                    id: speaker.id,
                  });
                });

                socket.on(
                  'SERVER@ROOMS:CALL',
                  ({ targetUserId, callerUserId, signal: callerSignal }) => {

                    const outcomePeer = new Peer({
                      initiator: false,
                      trickle: false,
                      stream,
                    });

                    outcomePeer.signal(callerSignal);

                    outcomePeer

                      .on('signal', (outSignal) => {

                        socket.emit('CLIENT@ROOMS:ANSWER', {
                          targetUserId: callerUserId,
                          callerUserId: targetUserId,
                          roomId,
                          signal: outSignal,
                        });
                      })


                      .on('stream', (stream) => {
                        document.querySelector('audio').srcObject = stream;
                        document.querySelector('audio').play();
                      });
                  },
                );

                socket.on('SERVER@ROOMS:ANSWER', ({ callerUserId, signal }) => {
                  const obj = peers.find((obj) => Number(obj.id) === Number(callerUserId));
                  if (obj) {
                    obj.peer.signal(signal);
                  }
                });
              }
            });
          });

          socket.on('SERVER@ROOMS:LEAVE', (leaveUser: UserData) => {
            console.log(leaveUser.id, peers);
            setUsers((prev) =>
              prev.filter((prevUser) => {
                const peerUser = peers.find((obj) => Number(obj.id) === Number(leaveUser.id));
                if (peerUser) {
                  peerUser.peer.destroy();
                }
                return prevUser.id !== leaveUser.id;
              }),
            );
          });
        })
        .catch(() => {
          console.error('Доступ к микрофону запрещен');
        });
    }

    return () => {
      peers.forEach((obj) => {
        obj.peer.destroy();
      });
    };
  }, []);
  console.log('users', users)
  return (
    <div className={styles.wrapper}>
      <audio controls
             // style={{ opacity: 0, width: '1px', height: '1px', pointerEvents: 'none' }}
      />
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
