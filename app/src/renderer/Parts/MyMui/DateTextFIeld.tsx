import TextField, { type TextFieldProps } from '@mui/material/TextField'
import React from 'react'

export const DateTextField = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const color = 'white'
    return (
      <TextField
        {...props}
        sx={{
          ...props.sx,
          '& .MuiInputBase-input': {
            fontSize: 13,
            fontWeight: 200,
            width: '120px',
            height: '24px',
            padding: 1,
          },
          fontWeight: 200,
          backgroundColor: 'rgba(100,100,200,0.3)',
          borderRadius: 0,
          input: {
            color,
          },
          label: {
            color,
          },
          svg: {
            color,
            padding: '3px 0 3px 2px',
            width: '17px',
            height: '17px',
          },
        }}
        ref={ref}
      />
    )
  }
)
