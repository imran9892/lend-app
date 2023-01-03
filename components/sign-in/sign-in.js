import { signIn } from 'next-auth/react';
import React from 'react';
import Button from '../ui/button';
import Card from '../ui/card';
import classes from './sign-in.module.css';
import GoogleIcon from '../../public/icons/google-icon.svg';
import GithubIcon from '../../public/icons/github-icon.svg';
import Image from 'next/image';

const icons = {
  google: GoogleIcon,
  github: GithubIcon,
};

const SignIn = ({ providers }) => {
  return (
    <section className={classes.signin}>
      <Card style={{ height: '90%' }}>
        <div className={classes.form}>
          <h1>Sign In</h1>
          <div>
            {Object.values(providers).map((provider) => (
              <div key={provider.name}>
                <Button
                  onClick={() =>
                    signIn(provider.id, { callbackUrl: '/dashboard' })
                  }
                >
                  <Image src={icons[provider.id]} alt={provider.name} />
                  Sign in with {provider.name}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
};

export default SignIn;
