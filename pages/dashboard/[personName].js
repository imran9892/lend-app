import { unstable_getServerSession } from 'next-auth';
import React from 'react';
import Layout from '../../components/layout/layout';
import PersonData from '../../components/person-data/person-data';
import { getPersonData, getUserId } from '../../lib/userId-util';
import { authOptions } from '../api/auth/[...nextauth]';

const PersonDashboard = ({ person }) => {
  return (
    <Layout title={person.name}>
      <PersonData person={person} />
    </Layout>
  );
};

export default PersonDashboard;

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) return { redirect: { destination: '/sign-in' } };
  const { email } = session.user;

  const { personName } = context.query;
  const userId = await getUserId(email);

  const person = await getPersonData({ userId, personName });

  return {
    props: { person },
  };
}
