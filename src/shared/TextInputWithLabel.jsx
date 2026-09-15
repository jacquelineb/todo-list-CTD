function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  placeholder,
  maxLength,
}) {
  return (
    <>
      <label htmlFor={elementId}>{labelText}</label>
      <input
        type='text'
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </>
  );
}

export default TextInputWithLabel;
