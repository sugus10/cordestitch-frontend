// components/ui/otp-input.tsx
"use client";

import { Input } from "./input";
import { useEffect, useRef } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  numericOnly?: boolean;
  className?: string;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  numericOnly = true,
  className = "",
}: OTPInputProps) {
  const inputsRef = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, length);
  }, [length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = e.target.value;
    
    if (numericOnly && !/^\d*$/.test(newValue)) {
      return;
    }

    if (newValue.length <= 1) {
      const newOtp = value.split('');
      newOtp[index] = newValue;
      onChange(newOtp.join(''));

      // Move focus to next input
      if (newValue && index < length - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }).map((_, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el as HTMLInputElement;
          }}
                    type={numericOnly ? "number" : "text"}
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="w-12 h-12 text-center text-xl"
        />
      ))}
    </div>
  );
}