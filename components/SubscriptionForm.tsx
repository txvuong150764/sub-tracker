'use client';

import { FormData } from '@/app/dashboard/page';
import { useAuth } from '@/context/AuthContext';

interface SubscriptionFormProps {
  closeInput: () => void;
  handleChangeInput: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleResetForm: () => void;
  setIsEditEntry: (val: boolean) => void;
  setEditedIndex: (index: number) => void;
  isEditEntry: boolean;
  editedIndex: number;
  formData: FormData;
}

export default function SubsctiptionForm(props: SubscriptionFormProps) {
  const { handleAddSubscription, handleEditSubscriptionContext, userData } =
    useAuth();
  const {
    closeInput,
    handleChangeInput,
    handleResetForm,
    formData,
    isEditEntry,
    setIsEditEntry,
    setEditedIndex,
    editedIndex,
  } = props;
  const category = [
    'Entertainment',
    'Music',
    'Software',
    'Web Services',
    'Health & Fitness',
    'Other',
  ];
  const currency = ['USD', 'EUR', 'GBP', 'NZD', 'AUD', 'Other'];
  const billingFrequency = ['Monthly', 'Yearly', 'Quarterly', 'One-time'];
  const paymentMethod = [
    'Credit Card',
    'Debit Card',
    'Paypal',
    'Bank Transfer',
    'Other',
  ];
  const status = ['Active', 'Paused', 'Cancelled'];

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isEditEntry) {
      handleEditSubscriptionContext(editedIndex, {
        ...formData,
        id: userData.subscriptions[editedIndex].id,
        cost: +formData.cost,
      });
      setEditedIndex(-1);
      setIsEditEntry(false);
    } else {
      handleAddSubscription({
        ...formData,
        id: userData.subscriptions.length + 1,
        cost: +formData.cost,
      });
    }
    handleResetForm();
    setIsEditEntry(false);
    closeInput();
  }

  return (
    <section>
      <h2>{isEditEntry ? 'Edit subscription' : 'Add a new subscription'}</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <span>Subscription Name</span>
          <input
            value={formData.name}
            onChange={handleChangeInput}
            type="text"
            name="name"
            placeholder="e.g. Netflix, Spotify, AWS Hosting"
            required
          />
        </label>

        <label>
          <span>Category</span>
          <select
            value={formData.category}
            onChange={handleChangeInput}
            name="category"
          >
            {category.map((cat, catIndex) => {
              return <option key={catIndex}>{cat}</option>;
            })}
          </select>
        </label>

        <label>
          <span>Cost</span>
          <input
            value={formData.cost}
            onChange={handleChangeInput}
            type="number"
            name="cost"
            step="0.01"
            placeholder="e.g. 12.00"
            required
          />
        </label>

        <label>
          <span>Currency</span>
          <select
            value={formData.currency}
            onChange={handleChangeInput}
            name="currency"
          >
            {currency.map((cur, curIndex) => {
              return <option key={curIndex}>{cur}</option>;
            })}
          </select>
        </label>

        <label>
          <span>Billing Frequency</span>
          <select
            value={formData.billingFrequency}
            onChange={handleChangeInput}
            name="billingFrequency"
          >
            {billingFrequency.map((cur, curIndex) => {
              return <option key={curIndex}>{cur}</option>;
            })}
          </select>
        </label>

        <label>
          <span>Payment Method</span>
          <select
            value={formData.paymentMethod}
            onChange={handleChangeInput}
            name="paymentMethod"
          >
            {paymentMethod.map((cur, curIndex) => {
              return <option key={curIndex}>{cur}</option>;
            })}
          </select>
        </label>

        <label>
          <span>Subscription Start Date</span>
          <input
            value={formData.startDate}
            onChange={handleChangeInput}
            type="date"
            name="startDate"
            required
          />
        </label>

        <label>
          <span>Status</span>
          <select
            value={formData.status}
            onChange={handleChangeInput}
            name="status"
          >
            {status.map((cur, curIndex) => {
              return <option key={curIndex}>{cur}</option>;
            })}
          </select>
        </label>

        <label className="fat-column">
          <span>Notes</span>
          <textarea
            value={formData.notes}
            onChange={handleChangeInput}
            name="notes"
            placeholder="e.g. Shared with family, includes cloud storage"
          />
        </label>

        <div className="fat-column form-submit-btns">
          <button onClick={closeInput}>Cancel</button>
          <button type="submit">
            {isEditEntry ? 'Update Subscription' : 'Add Subscription'}
          </button>
        </div>
      </form>
    </section>
  );
}
