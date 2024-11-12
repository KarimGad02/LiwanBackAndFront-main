"use client";

import { Sidebar } from "@/app/components/ui/sidebar";
import { useState, useEffect } from "react";
import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";

// Separate the personal information form into its own component
const PersonalInformationForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [extension, setExtension] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeTokenPayload = (token) => {
    try {
      const base64Payload = token.split(".")[1];
      const decodedPayload = atob(base64Payload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error("Failed to decode token payload:", error);
      return null;
    }
  };

  // useEffect(() => {
  //   const fetchEmployeeData = async () => {
  //     try {
  //       setLoading(true);
  //       const token = document.cookie
  //         .split("; ")
  //         .find((row) => row.startsWith("accessToken="))
  //         ?.split("=")[1];

  //       if (!token) {
  //         setError("No authentication token found");
  //         return;
  //       }

  //       const payload = decodeTokenPayload(token);
  //       const employeeId = payload?.id;

  //       if (!employeeId) {
  //         setError("No employee ID found in token");
  //         return;
  //       }

  //       const response = await fetch("https://liwan-back.vercel.app/api/v1/employees/", {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //           "Cache-Control": "no-cache",
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       const employee = data.data.employees.find(
  //         (emp) => emp._id === employeeId
  //       );

  //       if (employee) {
  //         setName(employee.fullName);
  //         setPhone(employee.phone || "");
  //         setEmail(employee.email);
  //         setExtension(employee.extensionsnumber || "");
  //       } else {
  //         setError("Employee not found");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching employee:", error);
  //       setError("Failed to fetch employee data");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchEmployeeData();
  // }, []);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <form className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="form-control flex flex-col">
          <label className="mb-2 font-medium">Employee Name</label>
          <input
            className="p-2 rounded-md bg-white dark:bg-neutral-800"
            id="name"
            type="text"
            value={name}
            disabled
          />
        </div>
        <div className="form-control flex flex-col">
          <label className="mb-2 font-medium">Employee Phone</label>
          <input
            className="p-2 rounded-md bg-white dark:bg-neutral-800"
            id="phone"
            type="tel"
            value={phone}
            disabled
          />
        </div>
        <div className="form-control flex flex-col">
          <label className="mb-2 font-medium">Employee Email</label>
          <input
            className="p-2 rounded-md bg-white dark:bg-neutral-800"
            id="email"
            type="email"
            value={email}
            disabled
          />
        </div>
        <div className="form-control flex flex-col">
          <label className="mb-2 font-medium">Employee Extension</label>
          <input
            className="p-2 rounded-md bg-white dark:bg-neutral-800"
            id="extension"
            type="text"
            value={extension}
            disabled
          />
        </div>
      </div>
    </form>
  );
};

// Main component
export default function PersonalInformationPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider attribute="class">
      <div className="flex h-screen bg-Primary">
        <Sidebar />
        <div className="flex-1 relative">
          <main
            className={`flex-1 p-8 overflow-auto dark:bg-neutral-950 bg-neutral-200 text-Primary dark:text-neutral-200 transition-all duration-300 ease-in-out ${
              isExpanded ? "ml-[150px]" : "ml-[30px]"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8">Personal Information</h1>
              <AnimatePresence mode="wait">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PersonalInformationForm />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="fixed bottom-4 left-4 p-2 rounded-full bg-Primary text-neutral-200 hover:bg-primary-foreground hover:text-Primary transition-colors duration-300"
          >
            {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}