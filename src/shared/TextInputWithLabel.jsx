function TextInputWithLabel({ elementId, labelText, onChange, ref, value, placeholder }) {
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
      />
    </>
  );
}

export default TextInputWithLabel;
