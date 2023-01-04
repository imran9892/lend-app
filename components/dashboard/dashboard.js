import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Button from '../ui/button';
import Card from '../ui/card';
import classes from './dashboard.module.css';

const Dashboard = ({ payments }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const lends = payments?.map((person) => {
    const remainingAmount = person.lends.reduce((a, b) => a + b.amount, 0);
    return {
      personId: person.personId,
      name: person.name,
      remainingAmount,
    };
  });

  const numberFormat = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigit: 0,
    minimumFractionDigits: 0,
  });

  let totalToGive = 0;
  let totalToRecieve = 0;
  lends?.map((lend) => {
    lend.remainingAmount > 0
      ? (totalToGive += lend.remainingAmount)
      : (totalToRecieve -= lend.remainingAmount);
  });

  return (
    <section className={classes.dashboard}>
      <Card
        style={{ background: 'linear-gradient(to right, #70e1f5, #ffd194)' }}
      >
        <div className={classes.hero}>
          <div>
            <Image
              src={session.user.image}
              alt={session.user.name}
              width={50}
              height={50}
            />
            <h3>{session.user.name}</h3>
          </div>
          <div>
            <p>To Give: {numberFormat.format(totalToGive)}</p>
            <p>To Recieve: {numberFormat.format(totalToRecieve)}</p>
          </div>
        </div>
      </Card>
      <div className={classes.expenseList}>
        {lends ? (
          lends.map((lend) => (
            <Card
              style={{
                background:
                  lend.remainingAmount > 0
                    ? 'linear-gradient(to right, #00c6ff, #0072ff)'
                    : 'linear-gradient(to right, #ed213a, #93291e)',
              }}
              key={lend.personId}
              onClick={() => router.push(`/dashboard/${lend.name}`)}
            >
              <div className={classes.lenders}>
                <p>{lend.name}</p>
                <p>Remaining: {numberFormat.format(lend.remainingAmount)}</p>
              </div>
            </Card>
          ))
        ) : (
          <p style={{ textAlign: 'center' }}>Add a Payment in your Dashboard</p>
        )}
      </div>
      <Button>
        <Link href="/add-expense">Add New Payment</Link>
      </Button>
    </section>
  );
};

export default Dashboard;
