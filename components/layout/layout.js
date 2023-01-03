import Head from 'next/head';
import React from 'react';
import MainNavigation from './main-navigation';

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title ? title + ' - Lend App' : 'Lend App'}</title>
        <meta
          name="description"
          content="Your go to place for managing all your Lends to friends and family"
        />
      </Head>
      <MainNavigation />
      <main>{children}</main>
    </>
  );
};

export default Layout;
