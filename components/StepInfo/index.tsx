import clsx from 'clsx';
import styles from './StepInfo.module.scss';
import React from "react";

type Props = {
  icon: string;
  description?: string;
  title: string;
}

export const StepInfo: React.FC<Props> = ({ title, description, icon }) => {
  return (
    <div className={clsx(styles.block, 'text-center')}>
      <div>
        <img className={styles.img} src={icon} alt="Step picture" />
      </div>
      <b className={styles.title}>{title}</b>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  );
};
