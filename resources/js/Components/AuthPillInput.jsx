import { useState } from 'react';

/**
 * Reusable pill-shaped input field with a leading Material icon,
 * automatic password visibility toggle, and inline validation error message.
 */
export default function AuthPillInput({
    id,
    name,
    type = 'text',
    icon,
    value,
    onChange,
    placeholder,
    error,
    required = false,
    autoFocus = false,
    autoComplete,
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="flex flex-col gap-1">
            <div className="relative flex items-center">
                {icon && (
                    <span className="material-symbols-outlined text-[18px] text-secondary absolute left-5 pointer-events-none">
                        {icon}
                    </span>
                )}

                <input
                    id={id}
                    name={name}
                    type={inputType}
                    required={required}
                    autoFocus={autoFocus}
                    autoComplete={autoComplete}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full h-11 pl-12 pr-11 rounded-full bg-surface-container-low border border-transparent focus:border-primary focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/15 text-on-surface font-body-md text-body-md placeholder:text-secondary transition-all outline-none"
                />

                {isPassword && (
                    <button
                        type="button"
                        aria-label="Toggle password visibility"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 text-secondary hover:text-on-surface transition-colors p-1"
                    >
                        <span className="material-symbols-outlined text-[17px] block">
                            {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                    </button>
                )}
            </div>

            {error && (
                <span className="text-error font-body-sm text-body-sm pl-4">
                    {error}
                </span>
            )}
        </div>
    );
}

