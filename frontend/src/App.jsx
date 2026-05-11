import './App.css'
import EmployeeTable from './components/EmployeeTable'
import EmployeeForm from './components/EmployeeForm'
import SearchBar from './components/SearchBar'
import api from './service/api'
import { useState, useEffect } from 'react'




function App() {

  const [employees, setEmployees] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const fetchEmployees = async () => {
  const response = await api.get('/employees', {
    params: { q: searchQuery }
  })
  setEmployees(response.data.data)
}

useEffect(() => {
  fetchEmployees()
}, [searchQuery])

const handleAddEmployee = async (employeeData) => {
  await api.post(`/employees`,employeeData)
  fetchEmployees()
  setShowForm(false)
}
const handleUpdate =async (employeeData)=> {
  await api.patch(`/employees/${editingEmployee.id}`, employeeData)
  fetchEmployees()
  setEditingEmployee(null)
  setShowForm(false)

}
const handleDelete =async (id)=> {
  await api.delete(`/employees/${id}`)
  fetchEmployees()
}
const handleEdit = employee => {
  setEditingEmployee(employee)
  setShowForm(true)
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employees</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your team members and their information
              </p>
            </div>
            <button onClick={() => {setEditingEmployee(null); setShowForm(true)}} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Stats */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <SearchBar query={searchQuery} onChange={setSearchQuery} />
          <div className="text-sm text-gray-500">
            5 of 5 employees
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <EmployeeForm
                employee={editingEmployee}
                onSubmit={editingEmployee ? handleUpdate : handleAddEmployee}
                onCancel={() => { setEditingEmployee(null); setShowForm(false) }}
              />
            </div>
          </div>
        )}

        {/* Table */}
        <EmployeeTable employees={employees}
        onEdit={handleEdit}
        onDelete={handleDelete}
         />
      </main>
    </div>
  )
}

export default App
