
import React, { useState } from 'react';
import type { Settings as SettingsType } from '../types';

interface SettingsProps {
  settings: SettingsType;
  onSave: (newSettings: SettingsType) => void;
}

const Settings: React.FC<SettingsProps> = ({ settings, onSave }) => {
  const [formState, setFormState] = useState<SettingsType>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: name.includes('Days') ? parseInt(value) : value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };
  
  const InputField: React.FC<{label: string; name: string; value: string | number; onChange: (e: any) => void; type?: string;}> = ({label, name, value, onChange, type='text'}) => (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
  );

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Settings</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Business Information</h2>
        <InputField label="Business Name" name="businessName" value={formState.businessName} onChange={handleChange} />

        <hr className="dark:border-gray-600"/>

        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">WhatsApp Integration</h2>
        <div>
          <label htmlFor="whatsappProvider" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            WhatsApp Provider
          </label>
          <select
            name="whatsappProvider"
            id="whatsappProvider"
            value={formState.whatsappProvider}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="ultramsg">Ultramsg</option>
            <option value="greenapi">GreenAPI</option>
            <option value="meta">Meta Cloud API</option>
          </select>
        </div>
        <InputField label="WhatsApp API Key" name="whatsappApiKey" value={formState.whatsappApiKey} onChange={handleChange} type="password" />

        <hr className="dark:border-gray-600"/>
        
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Automation Rules</h2>
        <InputField label="Auto Reminder Before Due Date (days)" name="autoReminderDaysBefore" value={formState.autoReminderDaysBefore} onChange={handleChange} type="number" />
        <InputField label="Auto Reminder After Due Date (days)" name="autoReminderDaysAfter" value={formState.autoReminderDaysAfter} onChange={handleChange} type="number" />

        <div className="flex items-center justify-end">
          {isSaved && <p className="text-sm text-green-600 dark:text-green-400 mr-4">Settings saved!</p>}
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
