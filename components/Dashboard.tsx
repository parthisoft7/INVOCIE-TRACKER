
import React from 'react';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { InvoiceIcon } from './icons/Icons';
import type { Invoice } from '../types';
import { InvoiceStatus } from '../types';

interface DashboardProps {
  invoices: Invoice[];
}

const Dashboard: React.FC<DashboardProps> = ({ invoices }) => {
  const stats = {
    total: invoices.length,
    paid: invoices.filter(inv => inv.status === InvoiceStatus.Paid).length,
    pending: invoices.filter(inv => inv.status === InvoiceStatus.Pending).length,
    overdue: invoices.filter(inv => inv.status === InvoiceStatus.Overdue).length,
    totalRevenue: invoices.filter(inv => inv.status === InvoiceStatus.Paid).reduce((sum, inv) => sum + inv.totalAmount, 0),
    outstanding: invoices.filter(inv => inv.status !== InvoiceStatus.Paid).reduce((sum, inv) => sum + inv.totalAmount, 0),
  };
  
  const chartData = [
    { name: 'Paid', count: stats.paid, fill: '#34D399' },
    { name: 'Pending', count: stats.pending, fill: '#FBBF24' },
    { name: 'Overdue', count: stats.overdue, fill: '#F87171' },
  ];

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex items-center space-x-4">
        <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full p-3">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} icon={<InvoiceIcon className="w-6 h-6" />} />
        <StatCard title="Outstanding" value={`₹${stats.outstanding.toFixed(2)}`} icon={<InvoiceIcon className="w-6 h-6" />} />
        <StatCard title="Total Invoices" value={stats.total} icon={<InvoiceIcon className="w-6 h-6" />} />
        <StatCard title="Overdue Invoices" value={stats.overdue} icon={<InvoiceIcon className="w-6 h-6" />} />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Invoice Status Overview</h2>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
              <XAxis dataKey="name" stroke="#9CA3AF"/>
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ 
                    backgroundColor: 'rgba(31, 41, 55, 0.8)', 
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#FFF'
                }} 
              />
              <Legend />
              <Bar dataKey="count" name="Invoices" fill="#8884d8" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
