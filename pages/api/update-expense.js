import { unstable_getServerSession } from 'next-auth';
import { addExpense, getUserId, updatePayment } from '../../lib/userId-util';
import { authOptions } from './auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return;

  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401).json({ message: 'Login again', data: null });
    return;
  }
  const allData = req.body;
  const { name: personName, _id: lendId, ...data } = allData;
  const email = session.user.email;
  try {
    const userId = await getUserId(email);

    const updateData = await updatePayment({
      userId,
      personName,
      lendId,
      data,
    });
    if (updateData === 0) {
      throw new Error('Something went wrong. Try again.');
    }
    res.status(200).json({ message: 'Success', data: updateData });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err, data: null });
  }
}
