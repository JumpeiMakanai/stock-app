import { StyledEngineProvider } from '@mui/material'
import TextField, { type TextFieldProps } from '@mui/material/TextField'
import React from 'react'
import { NumericFormat, type NumericFormatProps } from 'react-number-format'

export const MyNumberField = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    const color = 'white'

    return (
      <StyledEngineProvider injectFirst>
        <TextField
          {...props}
          onFocus={(e) => e.target.select()}
          sx={{
            ...props.sx,
            '& .MuiInputBase-input': {
              fontSize: 13,
              width: '120px',
              height: '20px',
              padding: '2px 6px',
              textAlign: 'end',
            },
            backgroundColor: 'rgba(100,100,200,0.3)',
            borderRadius: 0,
            input: {
              color,
            },
            label: {
              color,
            },
          }}
          slotProps={{
            input: {
              inputComponent: NumericFormatCustom as any,
            },
          }}
          ref={ref}
        />
      </StyledEngineProvider>
    )
  }
)

export interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

export const NumericFormatCustom = React.forwardRef<
  NumericFormatProps,
  CustomProps
>(function NumericFormatCustom(props, ref) {
  const { onChange, ...other } = props

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        })
      }}
      thousandSeparator
      valueIsNumericString
    />
  )
})
