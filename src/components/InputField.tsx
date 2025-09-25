import React from "react";

export interface InputFieldProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  variant?: "filled" | "outlined" | "ghost";
  size?: "sm" | "md" | "lg";
  clearable?: boolean;
  passwordToggle?: boolean;
  type?: string;
  loading?: boolean;
  id?: string;
  className?: string;
}

const sizeClasses: Record<NonNullable<InputFieldProps["size"]>, string> = {
  sm: "text-sm px-2 py-1 rounded-md",
  md: "text-sm px-3 py-2 rounded-lg",
  lg: "text-base px-4 py-3 rounded-xl",
};

const variantClasses: Record<NonNullable<InputFieldProps["variant"]>, string> = {
  filled:
    "bg-gray-100 border border-transparent focus:ring-2 focus:ring-indigo-400",
  outlined:
    "bg-white border border-gray-300 focus:ring-2 focus:ring-indigo-400",
  ghost:
    "bg-transparent border border-transparent focus:ring-2 focus:ring-indigo-400",
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="4" className="opacity-25" />
      <path
        d="M4 12a8 8 0 018-8"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  );
}

export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      label,
      placeholder,
      helperText,
      errorMessage,
      disabled = false,
      invalid = false,
      variant = "outlined",
      size = "md",
      clearable = false,
      passwordToggle = false,
      type = "text",
      loading = false,
      id,
      className = "",
      ...rest
    } = props;

    const [internalValue, setInternalValue] = React.useState(value ?? "");
    React.useEffect(() => setInternalValue(value ?? ""), [value]);

    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId?.() ?? `input-${Math.random().toString(36).slice(2,9)}`;
    const inputId = id ?? generatedId;
    const helperId = helperText ? `${inputId}-helper` : undefined;
    const errorId = errorMessage ? `${inputId}-error` : undefined;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = () => {
      setInternalValue("");
      // call onChange with synthetic event
      onChange?.(({ target: { value: "" } } as unknown) as React.ChangeEvent<HTMLInputElement>);
    };

    const resolvedType = type === "password" && showPassword ? "text" : type;

    const baseInputClasses =
      "w-full focus:outline-none transition placeholder:text-gray-400 disabled:opacity-60";
    const stateInvalid = (invalid || !!errorMessage) ? "border-red-500 focus:ring-red-300" : "";
    const classes = [
      baseInputClasses,
      sizeClasses[size],
      variantClasses[variant],
      stateInvalid,
    ].join(" ");

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={invalid || !!errorMessage}
            aria-describedby={
              [helperId, errorId].filter(Boolean).join(" ") || undefined
            }
            type={resolvedType}
            className={classes + (disabled ? " cursor-not-allowed" : "")}
            {...(rest as any)}
          />

          {/* Loading */}
          {loading && (
            <div className="absolute inset-y-0 right-10 flex items-center pr-3 pointer-events-none">
              <Spinner />
            </div>
          )}

          {/* Clear button */}
          {clearable && internalValue && !disabled && (
            <button
              type="button"
              aria-label="Clear input"
              onClick={handleClear}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
                <path d="M5 5 L15 15 M15 5 L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          )}

          {/* Password toggle */}
          {passwordToggle && type === "password" && (
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-gray-100"
            >
              {showPassword ? (
                <span className="text-sm">Hide</span>
              ) : (
                <span className="text-sm">Show</span>
              )}
            </button>
          )}
        </div>

        {/* helper / error */}
        {errorMessage ? (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {errorMessage}
          </p>
        ) : helperText ? (
          <p id={helperId} className="mt-1 text-sm text-gray-500">
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
