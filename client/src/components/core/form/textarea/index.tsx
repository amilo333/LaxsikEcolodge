'use client';

import TextField from '@mui/material/TextField';
import { TTextAreaProps } from './type';

export default function TextArea(props: TTextAreaProps) {
  const { label } = props;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-semibold">{label}</label>

      <TextField
        placeholder="Enter your message"
        variant="outlined"
        fullWidth
        slotProps={{
          input: {
            className: 'bg-gray-100  text-sm',
          },
        }}
        className="
              [&_.MuiOutlinedInput-root]:bg-white
              [&_.MuiOutlinedInput-input]:py-3
              [&_.MuiOutlinedInput-notchedOutline]:border-gray-300
              [&_.MuiOutlinedInput-root]:h-[230px]
              [&_.MuiOutlinedInput-root]:items-start!
            "
      />
    </div>
  );
}
