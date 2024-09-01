import React, { useEffect, useState } from 'react';
import { fetchPayments } from '../services/api';
import { Payment } from '../types';

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPayments();
      console.log('payment object', response.data);
      setPayments(response.data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl">Payments</h1>
      <table className="min-w-full">
        <thead>
          <tr>
            <th>Client ID</th>
            <th>Amount</th>
            <th>Series</th>
            <th>Season</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(payment => (
            <tr key={payment.id}>
              <td>{payment.userId}</td>
              <td>{payment.amount}</td>
              <td>{payment.season.title}</td>
              <td>
                <button>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;
