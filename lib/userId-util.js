import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export async function getUserId(email) {
  try {
    const client = await clientPromise;
    const usersCollection = client.db().collection('users');
    const user = await usersCollection.find({ email }).toArray();
    const userId = user[0]._id;

    return userId;
  } catch (err) {
    throw new Error(err);
  }
}

export async function addExpense({ userId, data }) {
  const name = data.name;
  delete data.name;
  const client = await clientPromise;
  const paymentsCollection = client.db().collection('payments');
  const existingUser = await paymentsCollection.findOne({ _id: userId });
  if (!existingUser) {
    await paymentsCollection.insertOne({
      _id: userId,
      person: [
        {
          personId: new ObjectId(),
          name: name,
          lends: [{ _id: new ObjectId(), ...data }],
        },
      ],
    });
  } else {
    const existingPerson = await paymentsCollection
      .aggregate([
        {
          $match: { _id: userId },
        },
        {
          $unwind: '$person',
        },
        {
          $match: { 'person.name': name },
        },
      ])
      .toArray();

    if (existingPerson.length === 0) {
      await paymentsCollection.updateOne(
        { _id: userId },
        {
          $push: {
            person: {
              personId: new ObjectId(),
              name: name,
              lends: [{ _id: new ObjectId(), ...data }],
            },
          },
        }
      );
    } else {
      const personId = existingPerson[0].person.personId;
      await paymentsCollection.updateOne(
        { _id: userId },
        { $push: { 'person.$[i].lends': { _id: new ObjectId(), ...data } } },
        { arrayFilters: [{ 'i.personId': personId }] }
      );
    }
  }

  return data;
}

export async function getUserData({ userId }) {
  const client = await clientPromise;
  const paymentsCollection = client.db().collection('payments');
  const lends = await paymentsCollection.findOne({ _id: userId });
  if (!lends) {
    throw new Error('Cannot find User');
  }
  const transfered_lender = lends.person.map((lender) => {
    lender.personId = lender.personId.toString();
    const transfered_lends = lender.lends.map((lend) => {
      lend._id = lend._id.toString();
      return lend;
    });
    lender.lends = transfered_lends;
    return lender;
  });
  // console.log(transfered_lender);
  return transfered_lender;
}

export async function getPersonData({ userId, personName }) {
  const client = await clientPromise;
  const paymentsCollection = client.db().collection('payments');
  const personArray = await paymentsCollection
    .aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: '$person',
      },
      {
        $match: { 'person.name': personName },
      },
    ])
    .toArray();
  const person = personArray[0].person;
  person.personId = person.personId.toString();
  const lends = person.lends.map((lend) => {
    lend._id = lend._id.toString();
    return lend;
  });
  person.lends = lends;
  return person;
}

export async function deletePayment({ userId, personId, lendId }) {
  const client = await clientPromise;
  const paymentsCollection = client.db().collection('payments');
  const deleted = await paymentsCollection.updateOne(
    { _id: userId },
    { $pull: { 'person.$[i].lends': { _id: ObjectId(lendId) } } },
    { arrayFilters: [{ 'i.personId': ObjectId(personId) }] }
  );
  console.log(deleted);
  return deleted.modifiedCount;
}

export async function getOnePayment({ userId, personName, lendId }) {
  const client = await clientPromise;
  const paymentsCollection = client.db().collection('payments');

  const person = await paymentsCollection
    .aggregate([
      {
        $match: { _id: userId },
      },
      {
        $unwind: '$person',
      },
      {
        $match: { 'person.name': personName },
      },
    ])
    .toArray();
  const lend = person[0].person.lends.find((lend) => {
    lend._id = lend._id.toString();
    return lend._id === lendId;
  });
  lend.name = person[0].person.name;
  // console.log(ObjectId(lendId));
  // console.log(lend);
  // console.log(person[0].person.lends);

  return lend;
}

export async function updatePayment({ userId, personName, lendId, data }) {
  const client = await clientPromise;
  const paymentsCollection = client.db().collection('payments');
  const updated = await paymentsCollection.updateOne(
    { _id: userId, 'person.name': personName },
    { $set: { 'person.$[i].lends.$[j]': { _id: ObjectId(lendId), ...data } } },
    { arrayFilters: [{ 'i.name': personName }, { 'j._id': ObjectId(lendId) }] }
  );
  // console.log(updated);
  return updated.modifiedCount;
}
