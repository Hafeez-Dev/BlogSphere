import React, { useId } from 'react'

function Select({
    options = [],
    label = 'Select an option',
    className = '',
    ...props
}, ref) {

  const id = useId()
  return (
    <div className='w-full'>
      {label && <label htmlFor={id} className={`${className}`}>{label}</label>}
      <select 
      {...props} 
      ref={ref}
      id={id}
      className={`block w-sm text-sm font-medium transition duration-75 border border-gray-800 rounded-lg shadow-sm h-9 focus:border-blue-600 focus:ring-1 focus:ring-inset focus:ring-blue-600 bg-none ${className}`}>
        {options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
      </select>
    </div>
  )
}

export default React.forwardRef(Select)
