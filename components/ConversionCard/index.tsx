import React from 'react';
import styles from './ConversionCard.module.scss';
import whiteBlockStyles from '../WhiteBlock/WhiteBlock.module.scss';
import clsx from "clsx";
import {Avatar} from "../Avatar";

type Props = {
  title: string,
  users: string[],
  avatars: string[],
  guestsCount: number,
  speakersCount: number
}


const ConversionCard = ({title, users = [], avatars = [], guestsCount, speakersCount}: Props) => {
  return (
    <div className={clsx(whiteBlockStyles.block, styles.card, 'mb-30')}>
      <h4 className={styles.title}>{title}</h4>
      <div className={clsx('d-flex mt-10', styles.content)}>
        <div className={styles.avatars}>
          {avatars.map((obj, i) => (
            <Avatar key={obj} src={obj} width='55px' height='55px'
                    className={avatars.length > 1 && i === avatars.length - 1 ? 'lastAvatar' : ''} />
          ))}
        </div>
        <div className={clsx(styles.info, 'ml-10')}>
          <ul className={styles.users}>
            {users.map((user, index) => (
              <li key={index }>
                {user}
                <img src="/static/cloud.png" alt="Cloud" width={14} height={14} />
              </li>
            ))}
          </ul>
          <ul className={styles.details}>
            <li>
              {guestsCount}
              <img src="/static/user.svg" alt="count" width={12} height={12} />
            </li>
            <li>
              {speakersCount}
              <img src="/static/message.svg" alt="" height={12} width={12} className='ml-5' />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ConversionCard;