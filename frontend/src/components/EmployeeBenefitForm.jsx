import { useState } from 'react'

const toFormState = (assignment, employees, socialBenefits) => ({
  employee_id: assignment?.employee_id ? String(assignment.employee_id) : String(employees[0]?.id || ''),
  social_benefit_id: assignment?.social_benefit_id ? String(assignment.social_benefit_id) : String(socialBenefits[0]?.id || ''),
  social_benefit_ids: assignment?.social_benefit_id ? [String(assignment.social_benefit_id)] : [],
  amount: assignment?.amount == null ? String(socialBenefits[0]?.default_amount || '') : String(assignment.amount),
  start_date: assignment?.start_date || new Date().toISOString().slice(0, 10),
  end_date: assignment?.end_date || '',
  status: assignment?.status || 'active',
})

const toPayload = (form, isEditing) => ({
  employee_id: Number(form.employee_id),
  social_benefit_id: Number(form.social_benefit_id),
  social_benefit_ids: isEditing ? undefined : form.social_benefit_ids.map(Number),
  amount: Number(form.amount),
  start_date: form.start_date,
  end_date: form.end_date || null,
  status: form.status,
})

export default function EmployeeBenefitForm({ assignment, employees, socialBenefits, onSubmit, onCancel, isSubmitting = false }) {
  const [form, setForm] = useState(() => toFormState(assignment, employees, socialBenefits))

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'social_benefit_id' && assignment) {
      const selectedBenefit = socialBenefits.find((benefit) => String(benefit.id) === value)
      setForm({
        ...form,
        social_benefit_id: value,
        amount: selectedBenefit?.default_amount == null ? form.amount : String(selectedBenefit.default_amount),
      })
      return
    }

    setForm({ ...form, [name]: value })
  }

  const handleBenefitToggle = (benefitId) => {
    const selectedIds = form.social_benefit_ids.includes(benefitId)
      ? form.social_benefit_ids.filter((id) => id !== benefitId)
      : [...form.social_benefit_ids, benefitId]

    const selectedBenefit = socialBenefits.find((benefit) => String(benefit.id) === selectedIds[0])

    setForm({
      ...form,
      social_benefit_ids: selectedIds,
      social_benefit_id: selectedIds[0] || '',
      amount: selectedBenefit?.default_amount == null ? form.amount : String(selectedBenefit.default_amount),
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(toPayload(form, Boolean(assignment)))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="px-6 py-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {assignment ? 'Edit Social Benefit' : 'Assign Social Benefit'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {assignment ? 'Update this employee benefit assignment' : 'Select an employee and assign a social benefit'}
        </p>
      </div>

      <div className="px-6 py-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Employee <span className="text-red-500">*</span>
          </label>
          <select
            name="employee_id"
            value={form.employee_id}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="" disabled>Select employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>{employee.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Benefit{assignment ? '' : 's'} <span className="text-red-500">*</span>
          </label>

          {assignment ? (
            <select
              name="social_benefit_id"
              value={form.social_benefit_id}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <option value="" disabled>Select benefit</option>
              {socialBenefits.map((benefit) => (
                <option key={benefit.id} value={benefit.id}>{benefit.name}</option>
              ))}
            </select>
          ) : (
            <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3 max-h-44 overflow-y-auto">
              {socialBenefits.map((benefit) => {
                const benefitId = String(benefit.id)

                return (
                  <label key={benefit.id} className="flex items-center justify-between gap-3 text-sm text-gray-700">
                    <span className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.social_benefit_ids.includes(benefitId)}
                        onChange={() => handleBenefitToggle(benefitId)}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      {benefit.name}
                    </span>
                    <span className="text-xs text-gray-400">${Number(benefit.default_amount).toLocaleString()}</span>
                  </label>
                )
              })}
            </div>
          )}

          {!assignment && (
            <p className="mt-1 text-xs text-gray-500">
              Select one or more benefits. The amount below will be applied to each selected benefit.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Amount <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 text-sm">$</span>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              placeholder="e.g. 2500"
              className="block w-full pl-7 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              End Date <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            className="block w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 rounded-b-2xl flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || employees.length === 0 || socialBenefits.length === 0 || (!assignment && form.social_benefit_ids.length === 0)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-300 transition-colors cursor-pointer"
        >
          {isSubmitting ? 'Saving...' : assignment ? 'Save Changes' : 'Assign Benefit'}
        </button>
      </div>
    </form>
  )
}
