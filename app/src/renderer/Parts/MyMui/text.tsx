import { StyledEngineProvider } from '@mui/material/styles'
import { DateTimePicker, type DateTimePickerProps } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import * as React from 'react'


export const TestDatePicker = React.forwardRef(
  (props: DateTimePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker {...props} />
        </LocalizationProvider>
      </StyledEngineProvider>
    )
  }
)
