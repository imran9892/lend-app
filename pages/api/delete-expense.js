import { unstable_getServerSession } from 'next-auth';
import { deletePayment, getUserId } from '../../lib/userId-util';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'DELETE') return;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Login again', data: null });
    return;
  }
  const email = session.user.email;
  const { lendId, personId } = req.body;

  try {
    const userId = await getUserId(email);
    const deleted = await deletePayment({ userId, lendId, personId });
    // console.log(deleted);
    if (deleted === 0) {
      throw new Error('Something went wrong. Try Again');
    }
    res.status(200).json({ message: 'Success', data: deleted });
  } catch (err) {
    res.status(400).json({ message: err, data: null });
  }
}
