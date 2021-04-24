import React from 'react';
import Link from "next/link";

const BackButton = ({ title, href }: {title: string; href: string}) => {
  return (
        <Link href={href}>
          <div className="d-flex mb-30 cup">
          <img src="/static/back-arrow.svg" alt="Back" className="mr-10" />
            <h3>{title}</h3>
          </div>
        </Link>
  );
};

export default BackButton;