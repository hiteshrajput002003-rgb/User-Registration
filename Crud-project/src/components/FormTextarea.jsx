function FormTextarea({
  label,
  name,
  register,
  error,
  required = false,
  placeholder = "",
}) {

  // 1. Figure out if the textarea should have a red error outline
  let textareaClass = "input textarea";
  if (error) {
    textareaClass = "input textarea input-error";
  }

  // 2. The Clean HTML Return
  return (
    <div className="field field-full">
      
      {/* Label Section */}
      <label htmlFor={name}>
        {label}
        {required && <span className="required"> *</span>}
      </label>

      {/* Textarea Section */}
      <textarea
        id={name}
        rows="4"
        placeholder={placeholder}
        className={textareaClass}
        {...register(name)}
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

export default FormTextarea;