import clsx from 'clsx'
import Link from 'next/link'
import React from 'react'
import { Avatar } from '../Avatar'

import styles from './Header.module.scss'

export const Header: React.FC = () => {
  return (
    <div className={styles.header}>
      <div className="container d-flex align-items-center justify-content-between">
        <Link href="/rooms">
          <div className={clsx(styles.headerLogo, 'd-flex align-items-center cup')}>
            <img src="/static/hand-wave.png" alt="Logo" className="mr-5" />
            <h4>Clubhouse</h4>
          </div>
        </Link>
        <Link href="/profile/1">
          <div className="d-flex align-items-center cup">
            <b className="mr-10">Sviridow Vlad</b>
            <Avatar
              src="https://sun9-42.userapi.com/impf/c837737/v837737799/2b977/eRmA60iM_p0.jpg?size=2052x2030&quality=96&sign=e1d123cf5de1b980fbb14ebc067d9d38&type=album"
              width="50px"
              height="50px"
            />
          </div>
        </Link>
      </div>
    </div>
  )
}
