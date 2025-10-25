
import type { Customer, Invoice, InvoiceItem } from '../types';
import { InvoiceStatus } from '../types';

const today = new Date();
const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

let mockCustomers: Customer[] = [
  { id: 'cust_1', name: 'Innovate Corp', phone: '+1234567890', email: 'contact@innovate.com', address: '123 Tech Street, Silicon Valley, CA', gst_no: 'GSTIN123', createdAt: new Date() },
  { id: 'cust_2', name: 'Quantum Solutions', phone: '+0987654321', email: 'info@quantum.com', address: '456 Logic Lane, Boston, MA', createdAt: new Date() },
];

let mockInvoices: Invoice[] = [
  {
    id: 'inv_1', customerId: 'cust_1', invoice_number: 'INV-001', issueDate: addDays(today, -35), dueDate: addDays(today, -5), status: InvoiceStatus.Overdue, totalAmount: 1500.00, items: [{id: 'item_1', description: 'Web Development Services', qty: 10, rate: 120, tax: 18}], createdAt: addDays(today, -35), paymentReceivedDate: undefined,
  },
  {
    id: 'inv_2', customerId: 'cust_2', invoice_number: 'INV-002', issueDate: addDays(today, -20), dueDate: addDays(today, 10), status: InvoiceStatus.Pending, totalAmount: 350.50, items: [{id: 'item_2', description: 'UI/UX Design Mockups', qty: 5, rate: 60, tax: 10}], createdAt: addDays(today, -20),
  },
  {
    id: 'inv_3', customerId: 'cust_1', invoice_number: 'INV-003', issueDate: addDays(today, -60), dueDate: addDays(today, -30), status: InvoiceStatus.Paid, totalAmount: 2500.00, items: [{id: 'item_3', description: 'Cloud Migration Consulting', qty: 1, rate: 2000, tax: 20}], createdAt: addDays(today, -60), paymentReceivedDate: addDays(today, -25),
  },
   {
    id: 'inv_4', customerId: 'cust_2', invoice_number: 'INV-004', issueDate: addDays(today, -5), dueDate: addDays(today, 25), status: InvoiceStatus.Pending, totalAmount: 850.00, items: [{id: 'item_4', description: 'Backend API Development', qty: 20, rate: 40, tax: 5}], createdAt: addDays(today, -5),
  },
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));

const updateInvoiceStatus = (invoice: Invoice): Invoice => {
  if (invoice.status !== InvoiceStatus.Paid && new Date(invoice.dueDate) < new Date()) {
    return { ...invoice, status: InvoiceStatus.Overdue };
  }
  return invoice;
};

export const getInvoices = async (): Promise<Invoice[]> => {
    const updatedInvoices = mockInvoices.map(updateInvoiceStatus);
    return simulateDelay(updatedInvoices);
};

export const getCustomers = async (): Promise<Customer[]> => simulateDelay(mockCustomers);

export const getCustomerById = async (id: string): Promise<Customer | undefined> => simulateDelay(mockCustomers.find(c => c.id === id));

export const saveInvoice = async (invoice: Omit<Invoice, 'id' | 'createdAt' | 'totalAmount' | 'invoice_number'> & { id?: string }): Promise<Invoice> => {
    const totalAmount = invoice.items.reduce((sum, item) => {
        const itemTotal = item.qty * item.rate;
        const taxAmount = itemTotal * (item.tax / 100);
        return sum + itemTotal + taxAmount;
    }, 0);

    if (invoice.id) {
        const index = mockInvoices.findIndex(i => i.id === invoice.id);
        if (index > -1) {
            mockInvoices[index] = { ...mockInvoices[index], ...invoice, totalAmount };
            return simulateDelay(mockInvoices[index]);
        }
    }
    
    const newInvoice: Invoice = {
        id: `inv_${Date.now()}`,
        createdAt: new Date(),
        invoice_number: `INV-${String(mockInvoices.length + 1).padStart(3, '0')}`,
        ...invoice,
        totalAmount,
    };
    mockInvoices.push(newInvoice);
    return simulateDelay(newInvoice);
}

export const saveCustomer = async (customer: Omit<Customer, 'id' | 'createdAt'> & { id?: string }): Promise<Customer> => {
     if (customer.id) {
        const index = mockCustomers.findIndex(c => c.id === customer.id);
        if (index > -1) {
            mockCustomers[index] = { ...mockCustomers[index], ...customer };
            return simulateDelay(mockCustomers[index]);
        }
    }
    
    const newCustomer: Customer = {
        id: `cust_${Date.now()}`,
        createdAt: new Date(),
        ...customer,
    };
    mockCustomers.push(newCustomer);
    return simulateDelay(newCustomer);
}
