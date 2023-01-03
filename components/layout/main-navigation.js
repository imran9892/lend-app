import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from '../../public/lend-logo.png';
import Button from '../ui/button';
import classes from './main-navigation.module.css';

const MainNavigation = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const logoutHandler = async () => {
    signOut({ callbackUrl: '/', redirect: true });
    // router.push(data.url);
  };

  return (
    <header className={classes.header}>
      <Link href={session ? '/dashboard' : '/'}>
        <Image src={Logo} alt="Lend" />
        <h1>Lend</h1>
      </Link>
      {status === 'unauthenticated' && (
        <Link
          href="/sign-in"
          className={router.pathname === '/sign-in' ? classes.active : null}
        >
          <p>Login</p>
        </Link>
      )}
      {status === 'authenticated' && (
        <div style={{ cursor: 'pointer' }} onClick={logoutHandler}>
          Logout
        </div>
      )}
    </header>
  );
};

export default MainNavigation;
