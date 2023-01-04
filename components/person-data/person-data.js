import Link from 'next/link';
import React, { useState } from 'react';
import Button from '../ui/button';
import Card from '../ui/card';
import classes from './person-data.module.css';
import editIcon from '../../public/icons/edit-icon.svg';
import deleteIcon from '../../public/icons/delete-icon.svg';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const PersonData = ({ person }) => {
  const [lends, setLends] = useState(person.lends);
  const router = useRouter();

  const NumberFormat = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigit: 0,
    minimumFractionDigits: 0,
  });
  const DateFormat = new Intl.DateTimeFormat('en-IN');
  const remainingAmount = lends.reduce((a, b) => a + b.amount, 0);
  lends.sort((a, b) => new Date(b.date) - new Date(a.date));

  const deletePaymentHandler = async (lendId) => {
    if (!window.confirm('Are you sure you want to Delete')) return;
    const toastId = toast.loading('Deleting Payment');
    const response = await fetch('/api/delete-expense', {
      method: 'DELETE',
      body: JSON.stringify({ lendId, personId: person.personId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const deletedPayment = await response.json();
    if (deletedPayment.message === 'Success') {
      setLends((prevLends) => prevLends.filter((lend) => lend._id !== lendId));
      toast.update(toastId, {
        render: 'Payment deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 2000,
      });
    } else {
      toast.update(toastId, {
        render: deletedPayment.message,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  const deleteAccountHandler = async () => {
    if (!window.confirm('Are you sure you want to Delete this Account')) return;
    const toastId = toast.loading('Deleting Payment');
    const response = await fetch('/api/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ personId: person.personId }),
      headers: { 'Content-Type': 'application/json' },
    });
    const deletedAccount = await response.json();
    if (deletedAccount.message === 'Success') {
      toast.update(toastId, {
        render: 'Account deleted successfully',
        type: 'success',
        isLoading: false,
        autoClose: 1000,
      });
      setTimeout(() => router.replace('/dashboard'), 900);
    } else {
      toast.update(toastId, {
        render: deletedPayment.message,
        type: 'error',
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <section className={classes.person}>
      <Card
        style={{
          background: 'linear-gradient(to right, #70e1f5, #ffd194)',
        }}
      >
        <div className={classes.amount}>
          <h1>{person.name}</h1>
          <p>Remaining: {NumberFormat.format(remainingAmount)}</p>
        </div>
      </Card>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Payment</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lends.map((lend) => (
            <tr
              key={lend._id}
              className={
                lend.amount > 0 ? `${classes.plus}` : `${classes.minus}`
              }
            >
              <td>{DateFormat.format(new Date(lend.date))}</td>
              <td>{lend.description.substr(0, 15)}</td>
              <td>{lend.paymentType === '0' ? 'Sent' : 'Recieved'}</td>
              <td>{NumberFormat.format(lend.amount)}</td>
              <td>
                <div>
                  <Link href={`/add-expense/${person.name}/${lend._id}`}>
                    <Image src={editIcon} alt="edit" height={25} width={25} />
                  </Link>
                  <div
                    style={{ cursor: 'pointer' }}
                    onClick={deletePaymentHandler.bind(null, lend._id)}
                  >
                    <Image
                      src={deleteIcon}
                      alt="delete"
                      height={25}
                      width={25}
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button>
        <Link href={`/add-expense?name=${person.name}`}>Add New Payment</Link>
      </Button>
      <div className={classes.actions}>
        <Button
          style={{
            backgroundColor: 'black',
          }}
        >
          <Link href="/dashboard">Go Back</Link>
        </Button>
        <Button
          style={{ backgroundColor: 'red' }}
          onClick={deleteAccountHandler}
        >
          Delete Account
        </Button>
      </div>
      <ToastContainer
        position="bottom-right"
        closeOnClick
        draggable
        pauseOnFocusLoss={false}
      />
    </section>
  );
};

export default PersonData;
