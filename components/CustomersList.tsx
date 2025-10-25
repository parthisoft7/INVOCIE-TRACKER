
import React from 'react';
import type { Customer } from '../types';
import { PlusIcon } from './icons/Icons';

interface CustomersListProps {
  customers: Customer[];
  onNewCustomer: () => void;
}

const CustomersList: React.FC<CustomersListProps> = ({ customers, onNewCustomer }) => {
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Customers</h1>
        <button onClick={onNewCustomer} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
          <PlusIcon className="mr-2" /> New Customer
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{customer.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{customer.email}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{customer.address}</p>
            {customer.gst_no && <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">GST: {customer.gst_no}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersList;
