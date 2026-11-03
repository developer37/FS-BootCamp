// Generic button component that can be customized by the parent component.
function Button({ label, type = "button", className = "", onClick, disabled = false }) {
  return (
    <button type={type} className={className} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

export default Button;
