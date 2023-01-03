import { unstable_getServerSession } from 'next-auth';
import React from 'react';
import AddExpense from '../../components/add-expense/add-expense';
import Layout from '../../components/layout/layout';
import { getUserData, getUserId } from '../../lib/userId-util';
import { authOptions } from '../api/auth/[...nextauth]';

const AddExpensePage = ({ people, nameQuery }) => {
  return (
    <Layout title="Add Expense">
      <AddExpense edit={false} nameQuery={nameQuery} people={people} />
    </Layout>
  );
};

export default AddExpensePage;

export async function getServerSideProps(context) {
  const { req, res, query } = context;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return { redirect: { destination: '/sign-in' } };

  const { email } = session.user;
  let nameQuery = null;
  if (query.name) nameQuery = query.name;

  try {
    const userId = await getUserId(email);
    const payments = await getUserData({ userId });
    const people = payments.map((person) => ({
      id: person.personId,
      name: person.name,
    }));
    return {
      props: { people, nameQuery, session },
    };
  } catch (err) {
    console.log(err);
    return { props: { session } };
  }
}
