function FormSelect({
  label,
  name,
  register,
  error,
  options = [],
  required = false,
  placeholder = "Select",
}) {

  // 1. Figure out if the dropdown should have a red error outline
  let selectClass = "input";
  if (error) {
    selectClass = "input input-error";
  }

  // 2. The Clean HTML Return
  return (
    <div className="field">
      
      {/* Label Section */}
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>

      {/* Select Dropdown Section */}
      <select
        id={name}
        className={selectClass}
        {...register(name)}
      >
        {/* The default empty option (e.g., "Select country") */}
        <option value="">
          {placeholder}
        </option>

        {/* Map through the list of options */}
        {options.map((option) => (
          <option key={option.id} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>

      {/* Error Message Section */}
      {error && (
        <p className="field-error">
          {error.message}
        </p>
      )}

    </div>
  );
}

export default FormSelect;