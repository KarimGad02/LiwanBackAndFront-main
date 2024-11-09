import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeProvider, useTheme } from "next-themes";
import { Sidebar } from "@/app/components/ui/sidebar";

const PersonalInformationForm = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [extension, setExtension] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const fetchEmployeeData = async (token, employeeId) => {
    try {
      const response = await fetch("https://liwan-back.vercel.app/api/v1/employees/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const employee = data.data.employees.find(
        (emp) => emp._id === employeeId
      );

      if (employee) {
        setName(employee.fullName);
        setPhone(employee.phone || "");
        setEmail(employee.email);
        setExtension(employee.extensionsnumber || "");
      } else {
        throw new Error("Employee not found");
      }
    } catch (error) {
      console.error("Error fetching employee:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadEmployeeData = async () => {
      if (typeof window === "undefined") return;

      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("accessToken="))
        ?.split("=")[1];

      if (!token) {
        setError("No access token found");
        setLoading(false);
        return;
      }

      const payload = decodeTokenPayload(token);
      const employeeId = payload?.id;

      if (!employeeId) {
        setError("Invalid token payload");
        setLoading(false);
        return;
      }

      await fetchEmployeeData(token, employeeId);
    };

    loadEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-md" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <form className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { id: "name", label: "Employee Name", value: name, type: "text" },
          { id: "phone", label: "Employee Phone", value: phone, type: "tel" },
          { id: "email", label: "Employee Email", value: email, type: "email" },
          { id: "extension", label: "Employee Extension", value: extension, type: "text" }
        ].map(({ id, label, value, type }) => (
          <div key={id} className="form-control flex flex-col">
            <label htmlFor={id} className="mb-2 font-medium text-neutral-700 dark:text-neutral-300">
              {label}
            </label>
            <input
              id={id}
              className="p-2 rounded-md bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600"
              type={type}
              value={value}
              disabled
              aria-label={label}
            />
          </div>
        ))}
      </div>
    </form>
  );
};

export default function PersonalInformationPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class">
      <div className="flex h-screen bg-neutral-100 dark:bg-neutral-900">
        <Sidebar />
        <div className="flex-1 relative">
          <main
            className={`
              flex-1 p-8 overflow-auto
              bg-neutral-100 dark:bg-neutral-900
              text-neutral-900 dark:text-neutral-100
              transition-all duration-300 ease-in-out
              ${isExpanded ? "ml-[150px]" : "ml-[30px]"}
            `}
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
            className="fixed bottom-4 left-4 p-2 rounded-full bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-800 hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors duration-300"
            aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
          </button>
        </div>
      </div>
    </ThemeProvider>
  );
}