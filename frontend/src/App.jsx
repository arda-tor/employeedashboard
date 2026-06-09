import './App.css'
import EmployeeTable from './components/EmployeeTable'
import EmployeeForm from './components/EmployeeForm'
import SearchBar from './components/SearchBar'
import SocialBenefitTable from './components/SocialBenefitTable'
import EmployeeBenefitForm from './components/EmployeeBenefitForm'
import api from './service/api'
import { useState, useEffect } from 'react'

const getErrorMessage = (error) => {
  const errors = error.response?.data?.errors

  if (errors) {
    return Object.values(errors).flat().join(' ')
  }

  return error.response?.data?.message || error.message || 'Something went wrong.'
}

function App() {
  const [employees, setEmployees] = useState([])
  const [socialBenefits, setSocialBenefits] = useState([])
  const [employeeSocialBenefits, setEmployeeSocialBenefits] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [benefitSearchQuery, setBenefitSearchQuery] = useState('')
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [showBenefitForm, setShowBenefitForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [editingBenefitAssignment, setEditingBenefitAssignment] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isBenefitsLoading, setIsBenefitsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const fetchEmployees = async () => {
    setIsLoading(true)
    setError('')

    try {
      const response = await api.get('/employees', {
        params: { q: searchQuery }
      })

      setEmployees(response.data.data || [])
    } catch (error) {
      setEmployees([])
      setError(getErrorMessage(error))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchSocialBenefits = async () => {
    try {
      const response = await api.get('/social-benefits')
      setSocialBenefits(response.data.data || [])
    } catch (error) {
      setSocialBenefits([])
      setError(getErrorMessage(error))
    }
  }

  const fetchEmployeeSocialBenefits = async () => {
    setIsBenefitsLoading(true)
    setError('')

    try {
      const response = await api.get('/employee-social-benefits')

      setEmployeeSocialBenefits(response.data.data || [])
    } catch (error) {
      setEmployeeSocialBenefits([])
      setError(getErrorMessage(error))
    } finally {
      setIsBenefitsLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployees()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEmployeeSocialBenefits()
  }, [benefitSearchQuery])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchSocialBenefits()
  }, [])

  const handleAddEmployee = async (employeeData) => {
    setIsSaving(true)
    setError('')

    try {
      await api.post('/employees', employeeData)
      await fetchEmployees()
      setShowEmployeeForm(false)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdate = async (employeeData) => {
    if (!editingEmployee) return

    setIsSaving(true)
    setError('')

    try {
      await api.patch(`/employees/${editingEmployee.id}`, employeeData)
      await fetchEmployees()
      await fetchEmployeeSocialBenefits()
      setEditingEmployee(null)
      setShowEmployeeForm(false)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id) => {
    setError('')

    try {
      await api.delete(`/employees/${id}`)
      await fetchEmployees()
      await fetchEmployeeSocialBenefits()
    } catch (error) {
      setError(getErrorMessage(error))
    }
  }

  const handleEdit = employee => {
    setError('')
    setEditingEmployee(employee)
    setShowEmployeeForm(true)
  }

  const handleAddBenefitAssignment = async (assignmentData) => {
    setIsSaving(true)
    setError('')

    try {
      const benefitIds = assignmentData.social_benefit_ids || [assignmentData.social_benefit_id]

      await Promise.all(benefitIds.map((benefitId) => api.post('/employee-social-benefits', {
        employee_id: assignmentData.employee_id,
        social_benefit_id: benefitId,
        amount: assignmentData.amount,
        start_date: assignmentData.start_date,
        end_date: assignmentData.end_date,
        status: assignmentData.status,
      })))

      await fetchEmployeeSocialBenefits()
      setShowBenefitForm(false)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateBenefitAssignment = async (assignmentData) => {
    if (!editingBenefitAssignment) return

    setIsSaving(true)
    setError('')

    try {
      await api.patch(`/employee-social-benefits/${editingBenefitAssignment.id}`, assignmentData)
      await fetchEmployeeSocialBenefits()
      setEditingBenefitAssignment(null)
      setShowBenefitForm(false)
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleBenefitAssignment = async ({ employee, benefit, assignment }) => {
    setIsSaving(true)
    setError('')

    try {
      if (assignment) {
        if (!window.confirm(`Remove ${benefit.name} from ${employee.name}?`)) return

        await api.delete(`/employee-social-benefits/${assignment.id}`)
      } else {
        await api.post('/employee-social-benefits', {
          employee_id: employee.id,
          social_benefit_id: benefit.id,
          amount: benefit.default_amount,
          start_date: new Date().toISOString().slice(0, 10),
          end_date: null,
          status: 'active',
        })
      }

      await fetchEmployeeSocialBenefits()
    } catch (error) {
      setError(getErrorMessage(error))
    } finally {
      setIsSaving(false)
    }
  }

  const openNewEmployeeForm = () => {
    setEditingEmployee(null)
    setShowEmployeeForm(true)
  }

  const openNewBenefitForm = () => {
    setEditingBenefitAssignment(null)
    setShowBenefitForm(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage employees and their assigned social benefits
              </p>
            </div>
            <button onClick={openNewEmployeeForm} className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Employee
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Employees</h2>
              <p className="mt-1 text-sm text-gray-500">Employee records stored in the backend database</p>
            </div>
            <div className="text-sm text-gray-500">
              {employees.length} employee{employees.length === 1 ? '' : 's'}
            </div>
          </div>

          <div className="mb-6">
            <SearchBar query={searchQuery} onChange={setSearchQuery} />
          </div>

          <EmployeeTable
            employees={employees}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </section>

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Social Benefits</h2>
              <p className="mt-1 text-sm text-gray-500">Click ✓ to remove a benefit or × to assign one</p>
            </div>
            <button
              onClick={openNewBenefitForm}
              disabled={employees.length === 0 || socialBenefits.length === 0}
              className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Assign Benefit
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <SearchBar query={benefitSearchQuery} onChange={setBenefitSearchQuery} placeholder="Search by employee, benefit or status..." />
            <div className="text-sm text-gray-500">
              {employeeSocialBenefits.length} assigned benefit{employeeSocialBenefits.length === 1 ? '' : 's'}
            </div>
          </div>

          <SocialBenefitTable
            employees={employees}
            socialBenefits={socialBenefits}
            assignments={employeeSocialBenefits}
            searchQuery={benefitSearchQuery}
            onToggle={handleToggleBenefitAssignment}
            isLoading={isBenefitsLoading}
            isSaving={isSaving}
          />
        </section>

        {showEmployeeForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <EmployeeForm
                key={editingEmployee?.id || 'new'}
                employee={editingEmployee}
                onSubmit={editingEmployee ? handleUpdate : handleAddEmployee}
                onCancel={() => { setEditingEmployee(null); setShowEmployeeForm(false) }}
                isSubmitting={isSaving}
              />
            </div>
          </div>
        )}

        {showBenefitForm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <EmployeeBenefitForm
                key={editingBenefitAssignment?.id || 'new-benefit'}
                assignment={editingBenefitAssignment}
                employees={employees}
                socialBenefits={socialBenefits}
                onSubmit={editingBenefitAssignment ? handleUpdateBenefitAssignment : handleAddBenefitAssignment}
                onCancel={() => { setEditingBenefitAssignment(null); setShowBenefitForm(false) }}
                isSubmitting={isSaving}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
