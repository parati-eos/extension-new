import { SelectDropdownProps } from '../../types/types'

const SelectDropdown: React.FC<SelectDropdownProps> = ({
  id,
  label,
  value,
  onChange,
  options,
  showConditionalInput = false,
  conditionalInputValue = '',
  onConditionalInputChange,
  conditionalInputPlaceholder = 'Enter your value',
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="mb-2 font-semibold text-[#4A4B4D] block text-left"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 border w-full rounded-xl"
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {showConditionalInput &&
        value === 'Other' &&
        onConditionalInputChange && (
          <input
            type="text"
            placeholder={conditionalInputPlaceholder}
            className="mt-2 p-2 border w-full rounded-xl"
            value={conditionalInputValue}
            onChange={(e) => onConditionalInputChange(e.target.value)}
          />
        )}
    </div>
  )
}

export default SelectDropdown
