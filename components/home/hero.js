import Link from 'next/link';
import React from 'react';
import Button from '../ui/button';
import classes from './hero.module.css';

const Hero = () => {
  return (
    <div className={classes.hero}>
      <h1>Welcome To Lend</h1>
      <h3>Check and Manage all your lending to friends and family here!</h3>
      <Link href="/sign-in">
        <Button>Login to Continue</Button>
      </Link>
    </div>
  );
};

export default Hero;
