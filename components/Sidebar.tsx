
import React from 'react';
import { Page } from '../types';
import { DashboardIcon, InvoiceIcon, CustomerIcon, SettingsIcon, XIcon } from './icons/Icons';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
        isActive
          ? 'bg-blue-100 text-blue-700 dark:bg-gray-700 dark:text-white'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, setIsOpen }) => {
  const navItems = [
    { page: Page.Dashboard, icon: <DashboardIcon />, label: 'Dashboard' },
    { page: Page.Invoices, icon: <InvoiceIcon />, label: 'Invoices' },
    { page: Page.Customers, icon: <CustomerIcon />, label: 'Customers' },
    { page: Page.Settings, icon: <SettingsIcon />, label: 'Settings' },
  ];

  const handleNavigation = (page: Page) => {
    onNavigate(page);
    if(window.innerWidth < 768) { // close on mobile
      setIsOpen(false);
    }
  }

  return (
    <>
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } bg-white border-r border-gray-200 md:translate-x-0 dark:bg-gray-800 dark:border-gray-700`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {navItems.map((item) => (
              <NavItem
                key={item.page}
                icon={item.icon}
                label={item.label}
                isActive={currentPage === item.page}
                onClick={() => handleNavigation(item.page)}
              />
            ))}
          </ul>
        </div>
      </aside>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"></div>}
    </>
  );
};

export default Sidebar;
