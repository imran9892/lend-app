import { unstable_getServerSession } from 'next-auth';
import { deleteAccount, deletePayment, getUserId } from '../../lib/userId-util';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Login again', data: null });
    return;
  }
  const email = session.user.email;
  const { personId } = req.body;

  try {
    const userId = await getUserId(email);
    const deletedAccount = await deleteAccount({ userId, personId });
    // console.log(deletedAccount);
    if (deletedAccount === 0) {
      throw new Error('Something went wrong. Try Again');
    }
    res.status(200).json({ message: 'Success', data: deletedAccount });
  } catch (err) {
    res.status(400).json({ message: err, data: null });
  }
}
