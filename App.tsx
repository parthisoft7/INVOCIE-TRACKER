
import React, { useState, useEffect, useCallback } from 'react';
import type { Customer, Invoice, Settings as SettingsType } from './types';
import { Page } from './types';
import * as api from './services/mockApi';
import Dashboard from './components/Dashboard';
import InvoicesList from './components/InvoicesList';
import CustomersList from './components/CustomersList';
import Settings from './components/Settings';
import Sidebar from './components/Sidebar';
import { MenuIcon, InvoiceIcon } from './components/icons/Icons';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Dashboard);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [settings, setSettings] = useState<SettingsType>({
    businessName: 'My Awesome Inc.',
    whatsappApiKey: '',
    whatsappProvider: 'meta',
    autoReminderDaysBefore: 3,
    autoReminderDaysAfter: 5,
  });
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [invoicesData, customersData] = await Promise.all([
        api.getInvoices(),
        api.getCustomers(),
      ]);
      setInvoices(invoicesData);
      setCustomers(customersData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSettings = (newSettings: SettingsType) => {
    setSettings(newSettings);
    // In a real app, you would save this to a persistent store
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard invoices={invoices} />;
      case Page.Invoices:
        return <InvoicesList invoices={invoices} customers={customers} onNewInvoice={() => {}} settings={settings} />;
      case Page.Customers:
        return <CustomersList customers={customers} onNewCustomer={() => {}} />;
      case Page.Settings:
        return <Settings settings={settings} onSave={handleSaveSettings} />;
      default:
        return <Dashboard invoices={invoices} />;
    }
  };

  return (
    <div>
      <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-controls="logo-sidebar"
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <MenuIcon />
              </button>
              <a href="#" className="flex ml-2 md:mr-24">
                <InvoiceIcon className="h-8 w-8 mr-3 text-blue-600 dark:text-blue-400" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">SmartInvoice</span>
              </a>
            </div>
          </div>
        </div>
      </nav>

      <Sidebar 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
      />

      <div className="p-4 md:ml-64">
        <div className="mt-14">
            {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default App;
