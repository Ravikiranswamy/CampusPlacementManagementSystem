import { useState } from 'react'

export default function RecordForm({ fields, initial, onSubmit, onCancel, submitLabel, formError }) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    fields.forEach((field) => {
      const message = field.validate?.(values[field.name], values)
      if (message) nextErrors[field.name] = message
    })
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    const payload = {}
    fields.forEach((field) => {
      const value = values[field.name]
      payload[field.name] = typeof value === 'string' ? value.trim() : value
    })
    onSubmit({ ...initial, ...payload })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {formError ? (
        <p className="form-error" role="alert">
          {formError}
        </p>
      ) : null}
      {fields.map((field) => (
        <label className="field" key={field.name}>
          <span>{field.label}</span>
          {field.type === 'select' ? (
            <select
              value={values[field.name] ?? ''}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            >
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.type || 'text'}
              value={values[field.name] ?? ''}
              min={field.min}
              max={field.max}
              step={field.step}
              autoFocus={field.autoFocus}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            />
          )}
          {errors[field.name] ? <small className="field-error">{errors[field.name]}</small> : null}
        </label>
      ))}
      <div className="modal-actions">
        <button type="button" className="secondary-button" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="primary-button compact">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
