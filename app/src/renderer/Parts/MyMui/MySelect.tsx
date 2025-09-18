import { Select, type SelectProps, StyledEngineProvider } from '@mui/material'
import React from 'react'

export const MySelect = React.forwardRef(
  (props: SelectProps, ref: React.Ref<HTMLDivElement>) => {
    const color = 'white'

    return (
      <StyledEngineProvider injectFirst>
        <Select
          {...props}
          sx={{
            ...props.sx,
            height: '24px',
            fontSize: '12px',
            color,
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
            },
          }}
          ref={ref}
        />
      </StyledEngineProvider>
    )
  }
)
