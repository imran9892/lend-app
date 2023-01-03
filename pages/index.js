import { unstable_getServerSession } from 'next-auth';
import Hero from '../components/home/hero';
import Layout from '../components/layout/layout';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home() {
  return (
    <>
      <Layout>
        <Hero />
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (session) {
    return {
      redirect: {
        destination: '/dashboard',
      },
    };
  }
  return {
    props: { session },
  };
}
