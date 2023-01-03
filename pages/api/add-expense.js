import { unstable_getServerSession } from 'next-auth';
import { addExpense, getUserId } from '../../lib/userId-util';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'POST') return;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Login again', data: null });
    return;
  }
  const data = req.body;
  const email = session.user.email;
  try {
    const userId = await getUserId(email);

    const expenseData = await addExpense({ userId, data });

    res.status(200).json({ message: 'Success', data: expenseData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Something went wrong', data: null });
  }
}
