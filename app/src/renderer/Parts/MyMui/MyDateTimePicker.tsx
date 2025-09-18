import { StyledEngineProvider } from '@mui/material'
import {
  DateTimePicker,
  type DateTimePickerProps,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { Dayjs } from 'dayjs'
import React from 'react'

import { DateTextField } from './DateTextFIeld'

export const MyDateTimePicker = React.forwardRef(
  (props: DateTimePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            {...props}
            ampm={false}
            timeSteps={{ minutes: 1 }}
            slotProps={{
              field: { shouldRespectLeadingZeros: true },
              actionBar: { actions: [] },
              calendarHeader: { format: 'YYYY / M' },
            }}
            slots={{ textField: DateTextField }}
          />
        </LocalizationProvider>
      </StyledEngineProvider>
    )
  }
)
