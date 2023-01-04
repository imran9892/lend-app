import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../ui/button';
import Card from '../ui/card';
import classes from './add-expense.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddExpense = (props) => {
  const router = useRouter();
  const { people, nameQuery, edit, lend } = props;
  const wrapperRef = useRef(null);
  const [displaySuggestions, setDisplaySuggestions] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm({
    defaultValues: edit
      ? {
          name: lend.name,
          paymentType: lend.paymentType,
          date: lend.date,
          description: lend.description,
          amount: lend.amount < 0 ? lend.amount * -1 : lend.amount,
        }
      : { name: nameQuery, date: new Date().toISOString().split('T')[0] },
  });

  useEffect(() => {
    window.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  });

  const handleClickOutside = (event) => {
    const { current: wrap } = wrapperRef;
    if (wrap && !wrap.contains(event.target)) {
      setDisplaySuggestions(false);
    }
  };

  const regex = new RegExp(`^${watch('name')?.replace('\\', '')}`, 'i');
  const suggestions = people?.filter(({ name }) => regex.test(name));
  //   console.log(suggestions);

  function updateSuggestion(value) {
    setValue('name', value);
    setDisplaySuggestions(false);
  }

  const onSubmitHandler = async (data) => {
    data.amount = +data.amount;
    if (data.paymentType === '0') {
      data.amount *= -1;
    }
    if (!edit) {
      const toastId = toast.loading('Adding your Payment');
      const response = await fetch('/api/add-expense', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      if (responseData.message === 'Success') {
        toast.update(toastId, {
          render: 'Payment added successfully',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => router.back(), 3000);
      } else {
        toast.update(toastId, {
          render: responseData.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        console.log(responseData);
      }
    } else {
      data._id = lend._id;
      const toastId = toast.loading('Updating your Payment');
      const response = await fetch('/api/update-expense', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
      });
      const responseData = await response.json();
      if (responseData.message === 'Success') {
        toast.update(toastId, {
          render: 'Payment updated successfully',
          type: 'success',
          isLoading: false,
          autoClose: 2000,
        });
        setTimeout(() => router.back(), 1800);
      } else {
        toast.update(toastId, {
          render: responseData.message,
          type: 'error',
          isLoading: false,
          autoClose: 5000,
        });
        console.log(responseData);
      }
    }
  };

  function CancelHandler() {
    if (isDirty) {
      if (
        window.confirm('Changes made will not be saved. Are you sure to Leave?')
      ) {
        router.back();
      } else return;
    } else router.back();
  }

  return (
    <section className={classes.form}>
      {edit ? <h1>Update Payment</h1> : <h1>Add Payment</h1>}
      <Card>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className={classes.controls}
        >
          <div
            ref={wrapperRef}
            className={`${classes.control} ${classes['pos-rel']}`}
          >
            <label htmlFor="name">Name*</label>
            <input
              id="name"
              type="text"
              placeholder="Name of Lender"
              {...register('name', { required: true, minLength: 3 })}
              onFocus={() => setDisplaySuggestions(true)}
              autoComplete="off"
              disabled={edit ? true : false}
            />
            {displaySuggestions && suggestions && suggestions.length > 0 && (
              <div className={classes.autoContainer}>
                {suggestions.map((value) => (
                  <div
                    key={value.id}
                    className={classes.option}
                    onClick={() => updateSuggestion(value.name)}
                  >
                    <span>{value.name}</span>
                  </div>
                ))}
              </div>
            )}

            {errors.name && <p className={classes.error}>Enter a valid name</p>}
          </div>
          <div className={classes.control}>
            <label>Payment Type*</label>
            <select
              required
              defaultValue=""
              {...register('paymentType', { required: true })}
            >
              <option value="" disabled>
                Select Payment Type
              </option>
              <option value={0}>Sent</option>
              <option value={1}>Recieved</option>
            </select>
            {errors.paymentType && (
              <p className={classes.error}>Please select a Payment Type</p>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="date">Date*</label>
            <input
              id="date"
              type="date"
              {...register('date', { required: true })}
            />
            {errors.date && <p className={classes.error}>Select the Date</p>}
          </div>
          <div className={classes.control}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              {...register('description', { required: false, minLength: 3 })}
              placeholder="Remarks"
            />
            {errors.description && (
              <p className={classes.error}>Enter a valid description</p>
            )}
          </div>
          <div className={classes.control}>
            <label htmlFor="amount">Amount*</label>
            <input
              type="number"
              id="amount"
              {...register('amount', { required: true, min: 1 })}
              placeholder="Enter the Total Amount"
            />
            {errors.amount && (
              <p className={classes.error}>Enter a valid Amount</p>
            )}
          </div>
          <div className={classes.actions}>
            <Button
              style={{ backgroundColor: 'black' }}
              onClick={CancelHandler}
            >
              Cancel
            </Button>
            <Button type="submit">{edit ? 'Update' : 'Submit'}</Button>
          </div>
        </form>
      </Card>
      <ToastContainer
        position="bottom-right"
        closeOnClick
        draggable
        pauseOnFocusLoss={false}
      />
    </section>
  );
};

export default AddExpense;
