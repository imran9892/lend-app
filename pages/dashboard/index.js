import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import React from 'react';
import Dashboard from '../../components/dashboard/dashboard';
import Layout from '../../components/layout/layout';
import { getUserData, getUserId } from '../../lib/userId-util';
import { authOptions } from '../api/auth/[...nextauth]';

const DashboardPage = ({ payments }) => {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading</p>;
  }

  return (
    <Layout title="Dashboard">
      <Dashboard payments={payments} />
    </Layout>
  );
};
DashboardPage.auth = true;

export default DashboardPage;

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return { redirect: { destination: '/sign-in' } };

  const { email } = session.user;

  try {
    const userId = await getUserId(email);
    const payments = await getUserData({ userId });
    return {
      props: {
        session,
        payments,
      },
    };
  } catch (err) {
    console.log(err);
    return { props: { session } };
  }
}
