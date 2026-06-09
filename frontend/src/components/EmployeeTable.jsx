const formatSalary = (salary) => {
  const value = Number(salary)

  if (!Number.isFinite(value)) {
    return '-'
  }

  return `$${value.toLocaleString()}`
}

export default function EmployeeTable({ employees, onEdit, onDelete, isLoading = false }) {
    const genderStyles = {
      male: 'bg-blue-50 text-blue-700 ring-blue-600/10',
      female: 'bg-pink-50 text-pink-700 ring-pink-600/10',
      other: 'bg-gray-50 text-gray-700 ring-gray-600/10',
    }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Note</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading employees...
                </td>
              </tr>
            )}

            {!isLoading && employees.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}

            {!isLoading && employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors">
                {/* ID */}
                <td className="px-4 py-3.5 text-sm text-gray-400 font-mono">
                  #{emp.id}
                </td>

                {/* Name + Email */}
                <td className="px-4 py-3.5">
                  <div className="text-sm font-medium text-gray-900">{emp.name}</div>
                  <div className="text-xs text-gray-500">{emp.email}</div>
                </td>

                {/* Gender Badge */}
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${genderStyles[emp.gender] || genderStyles.other}`}>
                    {emp.gender || 'other'}
                  </span>
                </td>

                {/* Phone */}
                <td className="px-4 py-3.5 text-sm text-gray-600">{emp.phone}</td>

                {/* Address */}
                <td className="px-4 py-3.5 text-sm text-gray-600 max-w-[200px] truncate">{emp.address}</td>

                {/* Salary */}
                <td className="px-4 py-3.5 text-sm text-gray-900 font-medium text-right tabular-nums">
                  {formatSalary(emp.salary)}
                </td>

                {/* Note */}
                <td className="px-4 py-3.5 text-sm text-gray-400 max-w-[150px] truncate">
                  {emp.note || '—'}
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {/* Edit Button */}
                    <button onClick={() => onEdit(emp)} className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer" title="Edit">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    {/* Delete Button */}
                    <button onClick={() => window.confirm('Delete this employee?') && onDelete(emp.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer" title="Delete">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
