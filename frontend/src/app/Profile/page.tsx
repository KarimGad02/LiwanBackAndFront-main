'use client'

import { useState, useEffect } from "react"
import { Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ThemeProvider, useTheme } from "next-themes"
import { Sidebar } from "../components/ui/sidebar"

const PersonalInformationForm = () => {
  const [employee, setEmployee] = useState({
    fullName: "",
    email: "",
    extensionsnumber: "",
  })

  const decodeTokenPayload = (token: string) => {
    try {
      const base64Payload = token.split(".")[1]
      const decodedPayload = atob(base64Payload)
      return JSON.parse(decodedPayload)
    } catch (error) {
      console.error("Failed to decode token payload:", error)
      return null
    }
  }

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken="))
      ?.split("=")[1]

    if (!token) return

    const payload = decodeTokenPayload(token)
    const employeeId = payload?.id

    if (!employeeId) return

    fetchEmployeeData(token, employeeId)
  }, [])

  const fetchEmployeeData = async (token: string, employeeId: string) => {
    try {
      const response = await fetch(`https://liwan-back.vercel.app/api/v1/employees/${employeeId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()
      setEmployee(data.data.employee)
    } catch (error) {
      console.error("Error fetching employee:", error)
    }
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
            value={employee.fullName}
            disabled
          />
        </div>
        <div className="form-control flex flex-col">
          <label className="mb-2 font-medium">Employee Email</label>
          <input
            className="p-2 rounded-md bg-white dark:bg-neutral-800"
            id="email"
            type="email"
            value={employee.email}
            disabled
          />
        </div>
        <div className="form-control flex flex-col">
          <label className="mb-2 font-medium">Employee Extension</label>
          <input
            className="p-2 rounded-md bg-white dark:bg-neutral-800"
            id="extension"
            type="text"
            value={employee.extensionsnumber}
            disabled
          />
        </div>
      </div>
    </form>
  )
}

export default function PersonalInformationPage() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
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

          {mounted && (
            <button
              onClick={toggleTheme}
              className="fixed top-4 right-4 p-2 rounded-full bg-Primary text-neutral-200 hover:bg-primary-foreground hover:text-Primary transition-colors duration-300"
            >
              {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          )}
        </div>
      </div>
    </ThemeProvider>
  )
}