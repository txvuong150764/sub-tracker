'use client';

import { Login } from '@/components/Login';
import SubsctiptionDisplay from '@/components/SubscriptionDisplay';
import SubsctiptionForm from '@/components/SubscriptionForm';
import SubsctiptionSummary from '@/components/SubscriptionSummary';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export type FormData = {
  name: string;
  category: string;
  cost: string;
  currency: string;
  billingFrequency: string;
  paymentMethod: string;
  startDate: string;
  renewalType: string;
  notes: string;
  status: string;
};

const blankSubscription = {
  name: '',
  category: 'Web Services',
  cost: '',
  currency: 'USD',
  billingFrequency: 'Monthly',
  nextBillingData: '',
  paymentMethod: 'Credit Card',
  startDate: '',
  renewalType: '',
  notes: '',
  status: 'Active',
};

export default function Dashboard() {
  const [isAddEntry, setIsAddEntry] = useState(false);
  const [isEditEntry, setIsEditEntry] = useState(false);
  const [editedIndex, setEditedIndex] = useState<number>(-1);
  const [formData, setFormData] = useState<FormData>(blankSubscription);
  const { userData, currentUser, isLoading } =
    useAuth();

  const isAuthenticated = !!currentUser;

  function handleResetForm() {
    setFormData(blankSubscription);
  }

  function handleChangeInput(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value,
    };

    setFormData(newData);
  }

  function handleEditSubscription(index: number) {
    const data = userData.subscriptions.find((val, idx) => {
      return idx === index;
    });
    if (data) {
      setFormData({
        name: data.name,
        category: data.category,
        cost: data.cost.toString(),
        currency: data.currency,
        billingFrequency: data.billingFrequency,
        paymentMethod: data.paymentMethod,
        startDate: data.startDate,
        renewalType: data.renewalType,
        notes: data.notes,
        status: data.status,
      });
      setIsAddEntry(true);
      setIsEditEntry(true);
      setEditedIndex(index);
    }
  }

  function handleAddEntry() {
    setIsAddEntry(!isAddEntry);
    setIsEditEntry(false);
    setFormData(blankSubscription);
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <>
      <SubsctiptionSummary />
      <SubsctiptionDisplay
        handleShowInput={handleAddEntry}
        handleEditSubscription={handleEditSubscription}
        isEditEntry={isEditEntry}
        setIsEditEntry={setIsEditEntry}
      />
      {isAddEntry && (
        <SubsctiptionForm
          closeInput={handleAddEntry}
          handleChangeInput={handleChangeInput}
          handleResetForm={handleResetForm}
          setIsEditEntry={setIsEditEntry}
          setEditedIndex={setEditedIndex}
          isEditEntry={isEditEntry}
          editedIndex={editedIndex}
          formData={formData}
        />
      )}
    </>
  );
}
