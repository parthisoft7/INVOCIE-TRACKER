
export enum InvoiceStatus {
  Pending = 'pending',
  Paid = 'paid',
  Overdue = 'overdue',
}

export interface InvoiceItem {
  id: string;
  description: string;
  qty: number;
  rate: number;
  tax: number; // as a percentage, e.g., 18 for 18%
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  gst_no?: string;
  address: string;
  createdAt: Date;
}

export interface Invoice {
  id: string;
  customerId: string;
  invoice_number: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  totalAmount: number;
  status: InvoiceStatus;
  paymentReceivedDate?: Date;
  pdfUrl?: string;
  createdAt: Date;
}

export interface Settings {
  businessName: string;
  whatsappApiKey: string;
  whatsappProvider: 'ultramsg' | 'greenapi' | 'meta';
  autoReminderDaysBefore: number;
  autoReminderDaysAfter: number;
}

export enum Page {
  Dashboard = 'Dashboard',
  Invoices = 'Invoices',
  Customers = 'Customers',
  Settings = 'Settings',
}
