const assignmentKey = (employeeId, benefitId) => `${employeeId}-${benefitId}`

export default function SocialBenefitTable({
  employees,
  socialBenefits,
  assignments,
  searchQuery = '',
  onToggle,
  isLoading = false,
  isSaving = false,
}) {
  const assignmentMap = assignments.reduce((map, assignment) => {
    map.set(assignmentKey(assignment.employee_id, assignment.social_benefit_id), assignment)
    return map
  }, new Map())

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredEmployees = normalizedQuery
    ? employees.filter((employee) => {
      const employeeMatches = [employee.name, employee.email, employee.phone]
        .some((value) => String(value || '').toLowerCase().includes(normalizedQuery))

      const assignmentMatches = assignments.some((assignment) => (
        assignment.employee_id === employee.id &&
        [assignment.benefit_name, assignment.status]
          .some((value) => String(value || '').toLowerCase().includes(normalizedQuery))
      ))

      return employeeMatches || assignmentMatches
    })
    : employees

  const columnCount = socialBenefits.length + 2

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50/50">
              <th className="sticky left-0 z-10 bg-gray-50 px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
              {socialBenefits.map((benefit) => (
                <th key={benefit.id} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {benefit.name}
                </th>
              ))}
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-10 text-center text-sm text-gray-500">
                  Loading social benefits...
                </td>
              </tr>
            )}

            {!isLoading && filteredEmployees.length === 0 && (
              <tr>
                <td colSpan={columnCount} className="px-4 py-10 text-center text-sm text-gray-500">
                  No employees found for this benefit matrix.
                </td>
              </tr>
            )}

            {!isLoading && filteredEmployees.map((employee) => {
              const assignedCount = socialBenefits.filter((benefit) => (
                assignmentMap.has(assignmentKey(employee.id, benefit.id))
              )).length

              return (
                <tr key={employee.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="sticky left-0 z-10 bg-white px-4 py-3.5">
                    <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                    <div className="text-xs text-gray-500">{employee.email}</div>
                  </td>

                  {socialBenefits.map((benefit) => {
                    const assignment = assignmentMap.get(assignmentKey(employee.id, benefit.id))
                    const isAssigned = Boolean(assignment)

                    return (
                      <td key={benefit.id} className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => onToggle({ employee, benefit, assignment })}
                          disabled={isSaving}
                          title={isAssigned ? 'Click to remove this benefit' : 'Click to assign this benefit'}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ring-1 ring-inset transition-colors disabled:cursor-not-allowed ${
                            isAssigned
                              ? 'bg-green-50 text-green-700 ring-green-600/20 hover:bg-green-100'
                              : 'bg-red-50 text-red-600 ring-red-600/20 hover:bg-red-100'
                          }`}
                        >
                          {isAssigned ? '✓' : '×'}
                        </button>
                      </td>
                    )
                  })}

                  <td className="px-4 py-3.5 text-center text-sm text-gray-600">
                    {assignedCount}/{socialBenefits.length}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
