import { StyledEngineProvider } from '@mui/material/styles'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, type DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import * as React from 'react'

import { DateTextField } from './DateTextFIeld'

export const BaseDatePicker = React.forwardRef(
  (props: DatePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <StyledEngineProvider injectFirst>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          dateFormats={{ year: 'YYYY', monthShort: 'M' }}
        >
          <DatePicker
            {...props}
            openTo="year"
            yearsOrder="asc"
            slotProps={{
              ...props.slotProps,
              field: { shouldRespectLeadingZeros: true },
            }}
            slots={{ ...props.slots, textField: DateTextField }}
          />
        </LocalizationProvider>
      </StyledEngineProvider>
    )
  }
)
