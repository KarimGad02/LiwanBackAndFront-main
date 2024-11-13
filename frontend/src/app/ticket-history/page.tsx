"use client"

import { API_URL } from "../../../config"
import { Sidebar } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Moon, Sun, Home, History, ChevronUp, ChevronDown, X, LayoutDashboard, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ThemeProvider, useTheme } from "next-themes"
import { useRouter } from "next/navigation"

export default function TicketHistory() {
  return (
    <ThemeProvider attribute="class">
      <div className="flex h-screen">
        <Sidebar className="shrink-0" />
        <main className="flex-1 overflow-y-auto bg-neutral-300 dark:bg-Primary">
          <TicketManagement />
        </main>
      </div>
    </ThemeProvider>
  )
}

function TicketManagement() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showPending, setShowPending] = useState(true)
  const ticketsPerPage = 4
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  const [isAdmin, setIsAdmin] = useState(false)
  const [view, setView] = useState("all")
  const [employeeData, setEmployeeData] = useState(null)
  const [ticketsData, setTicketsData] = useState([])
  const [filteredTickets, setFilteredTickets] = useState([])
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [showCompleted, setShowCompleted] = useState(false)
  const [sortByDate, setSortByDate] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleClosePopup = () => {
    setIsPopupOpen(false)
    setSelectedTicket(null)
  }

  const handleViewTicket = (ticket) => {
    setSelectedTicket(ticket)
    setIsPopupOpen(true)
  }

  const getButtonText = () => {
    if (view === "all") return "Show Pending"
    if (view === "pending") return "Show Completed"
    return "Show All Tickets"
  }

  const toggleView = () => {
    setView((prevView) => {
      if (prevView === "all") return "pending"
      if (prevView === "pending") return "completed"
      return "all"
    })
  }

  const decodeTokenPayload = (token) => {
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
    const accessToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("accessToken"))
      ?.split("=")[1]

    if (accessToken) {
      const payload = decodeTokenPayload(accessToken)
      const employeeId = payload?.id

      if (employeeId) {
        fetch(`${API_URL}/api/v1/employees/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const employees = data?.data?.employees || []
            const employee = employees.find((emp) => emp._id === employeeId)

            if (employee) {
              setEmployeeData(employee)
              setIsAdmin(employee.role === "admin")

              if (employee.role === "admin") {
                fetch(`${API_URL}/api/v1/tickets`, {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                  },
                })
                  .then((response) => response.json())
                  .then((ticketData) => {
                    setTicketsData(ticketData?.data?.tickets || [])
                  })
                  .catch((error) =>
                    console.error("Error fetching tickets data:", error)
                  )
              }
            } else {
              console.error("Employee not found.")
            }
          })
          .catch((error) =>
            console.error("Error fetching employee data:", error)
          )
      } else {
        console.error("Invalid token payload. No employee ID found.")
      }
    } else {
      console.log("No access token found.")
    }
  }, [])

  const departments = Array.from(
    new Set(ticketsData.map((ticket) => ticket.assignedTo.name))
  )

  useEffect(() => {
    if (isAdmin) {
      const filtered = ticketsData.filter((ticket) => {
        const statusMatch =
          view === "all" ||
          (view === "completed" && ticket.status === "completed") ||
          (view === "pending" && ticket.status === "pending")
        const departmentMatch =
          selectedDepartment === "All" ||
          ticket.assignedTo.name === selectedDepartment
        return statusMatch && departmentMatch
      })

      const sortedTickets = filtered.sort((a, b) => {
        const dateA = new Date(a.createdAt)
        const dateB = new Date(b.createdAt)
        return sortByDate ? dateA - dateB : dateB - dateA
      })

      setFilteredTickets(sortedTickets)
    }
  }, [view, selectedDepartment, ticketsData, isAdmin, sortByDate])

  if (!isAdmin) {
    return (
      <div className="flex h-screen justify-center items-center text-center text-xl">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 overflow-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">History</h1>
          <button
            onClick={toggleView}
            className="px-4 py-2 bg-Primary hover:bg-opacity-80 text-neutral-200 rounded transition-colors duration-300"
          >
            {getButtonText()}
          </button>
        </div>

        <div className="mb-4">
          <select
            className="p-2 rounded bg-Primary text-neutral-200"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortByDate((prev) => !prev)}
            className="p-2 rounded bg-Primary text-neutral-200 ml-4 hover:bg-opacity-80 transition-colors duration-300"
          >
            {sortByDate
              ? "Sort by Date: Oldest First"
              : "Sort by Date: Newest First"}
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={showCompleted ? "completed" : "all"}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <TicketItem
                  key={ticket.id}
                  ticket={ticket}
                  onView={() => handleViewTicket(ticket)}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isPopupOpen && selectedTicket && (
          <TicketDetailsPopup
            ticket={selectedTicket}
            onClose={() => setIsPopupOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

function TicketItem({ ticket, onView }) {
  const { title, description, createdBy, createdAt, assignedTo, status } = ticket
  const createdDate = new Date(createdAt).toLocaleDateString()

  return (
    <div className="p-4 rounded-lg bg-Primary shadow-lg hover:shadow-2xl shadow-black/50 hover:shadow-black text-neutral-200 duration-300">
      <div className="flex items-start space-x-4">
        <img
          src="/Sidebar-Icon.jpg"
          alt={createdBy?.fullName}
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{title}</h3>
              <p className="text-sm opacity-80">{createdBy?.fullName}</p>
            </div>
            <span className="text-sm opacity-80 font-semibold">
              {createdDate}
            </span>
          </div>
          <p className="mt-2 text-sm">{description}</p>
          <p className="mt-1 text-sm">Assigned to: {assignedTo?.name}</p>
          <span
            className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
              status === "pending"
                ? "bg-yellow-200 text-yellow-800"
                : "bg-green-200 text-green-800"
            }`}
          >
            {status}
          </span>
        </div>
      </div>
      <div className="flex justify-end">
        <button
          onClick={() => onView(ticket)}
          className="mt-4 px-3 py-1 bg-primary-foreground text-neutral-200 hover:text-Primary hover:bg-neutral-200 font-semibold rounded text-sm transition-colors duration-300"
        >
          View
        </button>
      </div>
    </div>
  )
}

function TicketDetailsPopup({ ticket, onClose }) {
  const {
    title,
    description,
    createdBy,
    createdAt,
    assignedTo,
    status,
    response,
  } = ticket
  const createdDate = new Date(createdAt).toLocaleDateString()
  const router = useRouter()
  
  const handleRespond = () => {
    router.push(`/${ticket._id}`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-Primary p-6 rounded-lg shadow-xl max-w-md w-full m-4 text-neutral-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-start space-x-4">
            <img
              src="/Sidebar-Icon.jpg"
              alt={createdBy?.fullName || "User"}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <h2 className="font-semibold text-xl">{title}</h2>
              <p className="text-sm opacity-80">
                {createdBy?.fullName || "Unknown User"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="mb-6 space-y-4">
          <div>
            <p className="text-sm opacity-80 font-semibold">{createdDate}</p>
            <p className="mt-2 text-sm">{description}</p>
          </div>

          <div>
            <p className="text-sm">Assigned to: {assignedTo?.name}</p>
            <span
              className={`mt-2 inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                status === "pending"
                  ? "bg-yellow-200 text-yellow-800"
                  : "bg-green-200 text-green-800"
              }`}
            >
              {status}
            </span>
          </div>

          <div className="mt-4 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Response</h3>
            {response ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">
                    {response.createdBy.fullName}
                  </p>
                  <p className="text-xs opacity-80">
                    {new Date(response.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-sm">{response.description}</p>
              </div>
            ) : (
              <p className="text-sm">No response yet.</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {status === "pending" && (
            <button
              onClick={handleRespond}
              className="px-4 py-2 bg-primary-foreground text-neutral-200 hover:text-Primary hover:bg-neutral-200 font-semibold rounded text-sm transition-colors duration-300"
            >
              Respond
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}