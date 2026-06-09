'use client';

import TextField from '@mui/material/TextField';
import { TInputProps } from './type';

export default function Input({ label }: TInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>

      <TextField
        placeholder="Enter Code"
        variant="outlined"
        fullWidth
        slotProps={{
          input: {
            className: 'bg-gray-100 h-12 text-sm',
          },
        }}
        className="
          [&_.MuiOutlinedInput-root]:bg-white
          [&_.MuiOutlinedInput-input]:py-3
          [&_.MuiOutlinedInput-notchedOutline]:border-gray-300
        "
      />
    </div>
  );
}
