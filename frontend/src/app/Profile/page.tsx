import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from '@/app/components/ui/sidebar';

// Types for better type safety
type Employee = {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  extensionsnumber: string;
};

const LoadingState = () => (
  <div className="space-y-6">
    <div className="grid gap-6 md:grid-cols-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded" />
          <div className="h-10 w-full bg-neutral-300 dark:bg-neutral-700 animate-pulse rounded" />
        </div>
      ))}
    </div>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded relative my-4">
    <div className="flex items-center justify-between">
      <span>{error}</span>
      <button 
        onClick={onRetry}
        className="ml-4 px-4 py-2 bg-neutral-200 dark:bg-neutral-800 rounded hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

const PersonalInformationForm = ({ employee }: { employee: Employee }) => (
  <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800">
    <div className="p-6">
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { label: 'Employee Name', value: employee.fullName, type: 'text' },
          { label: 'Employee Phone', value: employee.phone, type: 'tel' },
          { label: 'Employee Email', value: employee.email, type: 'email' },
          { label: 'Employee Extension', value: employee.extensionsnumber, type: 'text' }
        ].map(({ label, value, type }) => (
          <div key={label} className="form-control flex flex-col">
            <label className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">
              {label}
            </label>
            <input
              className="p-2 rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100"
              type={type}
              value={value || ''}
              disabled
              aria-label={label}
            />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PersonalInformationPage = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const fetchEmployeeData = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      setLoading(true);
      setError(null);
      
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('accessToken='))
        ?.split('=')[1];

      if (!token) throw new Error('No authentication token found');

      const response = await fetch('https://liwan-back.vercel.app/api/v1/employees/', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch employee data');

      const data = await response.json();
      const employeeId = JSON.parse(atob(token.split('.')[1])).id;
      const employeeData = data.data.employees.find((emp: Employee) => emp._id === employeeId);

      if (!employeeData) throw new Error('Employee not found');
      
      setEmployee(employeeData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeeData();
  }, [pathname]);

  if (!pathname.includes('profile')) return null;

  return (
    <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
      <Sidebar />
      <div className="flex-1 relative">
        <main className={`
          flex-1 p-8 overflow-auto
          transition-all duration-300 ease-in-out
          ${isExpanded ? 'ml-[150px]' : 'ml-[30px]'}
        `}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
                Personal Information
              </h1>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg"
              >
                {loading ? (
                  <LoadingState />
                ) : error ? (
                  <ErrorState error={error} onRetry={fetchEmployeeData} />
                ) : employee ? (
                  <PersonalInformationForm employee={employee} />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="fixed bottom-4 left-4 p-2 rounded-full bg-neutral-800 dark:bg-neutral-200 text-neutral-200 dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-300"
          aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
    </div>
  );
};

export default PersonalInformationPage;