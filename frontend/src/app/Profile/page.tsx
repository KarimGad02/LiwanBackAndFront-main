// 'use client'

// import { useState, useEffect } from "react"
// import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react"
// import { motion, AnimatePresence } from "framer-motion"
// import { useTheme } from "next-themes"
// import { Sidebar } from "../components/ui/sidebar"
// import { Button } from "../components/ui/button"
// import { Input } from "../components/ui/input"
// import { Label } from "../components/ui/label"

// interface Employee {
//   _id: string
//   fullName: string
//   email: string
//   extensionsnumber: string
// }

// const PersonalInformationForm = ({ employee }: { employee: Employee | null }) => {
//   if (!employee) return null

//   return (
//     <form className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="form-control flex flex-col">
//           <Label htmlFor="name" className="mb-2 font-medium">
//             Employee Name
//           </Label>
//           <Input
//             id="name"
//             type="text"
//             value={employee.fullName}
//             disabled
//             aria-readonly="true"
//           />
//         </div>
//         <div className="form-control flex flex-col">
//           <Label htmlFor="email" className="mb-2 font-medium">
//             Employee Email
//           </Label>
//           <Input
//             id="email"
//             type="email"
//             value={employee.email}
//             disabled
//             aria-readonly="true"
//           />
//         </div>
//         <div className="form-control flex flex-col">
//           <Label htmlFor="extension" className="mb-2 font-medium">
//             Employee Extension
//           </Label>
//           <Input
//             id="extension"
//             type="text"
//             value={employee.extensionsnumber}
//             disabled
//             aria-readonly="true"
//           />
//         </div>
//       </div>
//     </form>
//   )
// }

// export default function ProfilePage() {
//   const [isExpanded, setIsExpanded] = useState(false)
//   const { theme, setTheme } = useTheme()
//   const [employee, setEmployee] = useState<Employee | null>(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   const toggleTheme = () => {
//     setTheme(theme === "dark" ? "light" : "dark")
//   }

//   return (
//     <div className="flex h-screen bg-background">
//       <Sidebar />
//       <div className="flex-1 relative">
//         <main
//           className={`flex-1 p-8 overflow-auto transition-all duration-300 ease-in-out ${
//             isExpanded ? "ml-[150px]" : "ml-[30px]"
//           }`}
//         >
//           <div className="max-w-4xl mx-auto">
//             <h1 className="text-3xl font-bold mb-8">Personal Information</h1>
//             <AnimatePresence mode="wait">
//               {isLoading ? (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <p>Loading...</p>
//                 </motion.div>
//               ) : error ? (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   <p className="text-red-500">{error}</p>
//                 </motion.div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -20 }}
//                   transition={{ duration: 0.3 }}
//                 >
//                   <PersonalInformationForm employee={employee} />
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </main>

//         <Button
//           onClick={() => setIsExpanded(!isExpanded)}
//           className="fixed bottom-4 left-4 p-2 rounded-full"
//           aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
//         >
//           {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
//         </Button>

//         <Button
//           onClick={toggleTheme}
//           className="fixed top-4 right-4 p-2 rounded-full"
//           aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
//         >
//           {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
//         </Button>
//       </div>
//     </div>
//   )
// }