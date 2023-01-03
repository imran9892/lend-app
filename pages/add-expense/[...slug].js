import { unstable_getServerSession } from 'next-auth';
import React from 'react';
import AddExpense from '../../components/add-expense/add-expense';
import Layout from '../../components/layout/layout';
import { getOnePayment, getUserId } from '../../lib/userId-util';
import { authOptions } from '../api/auth/[...nextauth]';

const EditExpense = ({ lend }) => {
  return (
    <Layout title="Edit">
      <AddExpense edit={true} lend={lend} />
    </Layout>
  );
};

export default EditExpense;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return { redirect: { destination: '/sign-in' } };

  const { email } = session.user;
  const [personName, lendId] = query.slug;

  if (query.slug.length === 1) return { notFound: true };

  try {
    const userId = await getUserId(email);
    const lend = await getOnePayment({ userId, personName, lendId });

    return { props: { lend, session } };
  } catch (err) {
    return { props: { session } };
  }
}
