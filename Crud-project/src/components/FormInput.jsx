function FormInput({ //This function is about creating a form input component that can be reused in different forms. It takes several props to customize its behavior and appearance.
  label,
  name,
  register,
  error,
  required = false,
  type = "text",
  placeholder = "",
  ...props
}) {

  // 1. Figure out if the input box should have a red error outline
  let inputClass = "input";
  if (error) {
    inputClass = "input input-error";
  }

  // 2. The Clean HTML Return
  return (
    <div className="field">
      
      {/* Label Section */}
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>

      {/* Input Section */}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={inputClass}
        {...register(name)}
        {...props}
      />

      {/* Error Message Section */}
      {error && (
        <p className="field-error">
          {error.message}
        </p>
      )}

    </div>
  );
}

export default FormInput;