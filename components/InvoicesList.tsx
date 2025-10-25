
import React, { useState, useMemo, useCallback } from 'react';
import type { Invoice, Customer } from '../types';
import { InvoiceStatus } from '../types';
import { getCustomerById } from '../services/mockApi';
import { generateWhatsAppReminder } from '../services/geminiService';
import { PlusIcon, WhatsAppIcon, SparklesIcon, XCircleIcon, CheckCircleIcon } from './icons/Icons';
import StatusBadge from './StatusBadge';

interface InvoicesListProps {
  invoices: Invoice[];
  customers: Customer[];
  onNewInvoice: () => void;
  settings: { businessName: string };
}

const ReminderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  invoice: Invoice;
  customer?: Customer;
  businessName: string;
}> = ({ isOpen, onClose, invoice, customer, businessName }) => {
  const [message, setMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleGenerate = useCallback(async () => {
    if (!customer) return;
    setIsGenerating(true);
    const generatedMessage = await generateWhatsAppReminder(invoice, customer, businessName);
    setMessage(generatedMessage);
    setIsGenerating(false);
  }, [invoice, customer, businessName]);
  
  const handleSend = () => {
      // Mock sending logic
      console.log('Sending message:', message);
      setIsSent(true);
      setTimeout(() => {
          onClose();
          setIsSent(false);
      }, 2000);
  }

  React.useEffect(() => {
      setMessage('');
      setIsSent(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Send Reminder</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">&times;</button>
        </div>
        {isSent ? (
            <div className="text-center py-10">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">Reminder Sent Successfully!</p>
            </div>
        ) : (
            <>
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>Customer:</strong> {customer?.name}</p>
                    <p><strong>Invoice:</strong> {invoice.invoice_number}</p>
                    <p><strong>Amount:</strong> ₹{invoice.totalAmount.toFixed(2)}</p>
                </div>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-32 p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Reminder message..."
                ></textarea>
                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                    <button onClick={handleGenerate} disabled={isGenerating} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-purple-300 transition">
                        <SparklesIcon className="mr-2" />
                        {isGenerating ? 'Generating...' : 'Generate with AI'}
                    </button>
                    <button onClick={handleSend} className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 disabled:bg-green-300 transition">
                        <WhatsAppIcon className="mr-2" />
                        Send via WhatsApp
                    </button>
                </div>
            </>
        )}
      </div>
    </div>
  );
};


const InvoicesList: React.FC<InvoicesListProps> = ({ invoices, customers, onNewInvoice, settings }) => {
  const [filter, setFilter] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const customerMap = useMemo(() => new Map(customers.map(c => [c.id, c.name])), [customers]);

  const filteredInvoices = useMemo(() => {
    return invoices
      .filter(invoice => filter === 'all' || invoice.status === filter)
      .sort((a, b) => b.issueDate.getTime() - a.issueDate.getTime());
  }, [invoices, filter]);

  const handleOpenReminder = (invoice: Invoice) => {
      setSelectedInvoice(invoice);
      setIsModalOpen(true);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Invoices</h1>
        <button onClick={onNewInvoice} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
          <PlusIcon className="mr-2" /> New Invoice
        </button>
      </div>

      <div className="flex space-x-2 mb-4 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {(['all', ...Object.values(InvoiceStatus)] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition ${filter === status ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-700/50'}`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.map(invoice => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{customerMap.get(invoice.customerId) || 'Unknown'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">₹{invoice.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={invoice.status} /></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {invoice.status !== InvoiceStatus.Paid && (
                      <button onClick={() => handleOpenReminder(invoice)} className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title="Send Reminder">
                        <WhatsAppIcon />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <ReminderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        invoice={selectedInvoice!}
        customer={customers.find(c => c.id === selectedInvoice?.customerId)}
        businessName={settings.businessName}
      />
    </div>
  );
};

export default InvoicesList;
