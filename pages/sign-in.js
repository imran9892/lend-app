import { getProviders, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Layout from '../components/layout/layout';
import SignIn from '../components/sign-in/sign-in';

export default function SignInPage({ providers }) {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.replace('/dashboard');
    }
  }, [session, router]);

  return (
    <>
      <Layout title="SignIn">
        <SignIn providers={providers} />
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
