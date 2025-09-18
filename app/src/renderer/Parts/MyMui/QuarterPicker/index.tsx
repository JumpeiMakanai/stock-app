import { StyledEngineProvider } from '@mui/material'
import type { TextFieldProps } from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { Dayjs } from 'dayjs'
import * as React from 'react'

import { DatePicker as DP } from './DatePicker'
import { DateTextField } from '../DateTextFIeld'

export const QuarterPicker = React.forwardRef(
  (props: DatePickerProps<Dayjs>, ref: React.Ref<HTMLDivElement>) => {
    return (
      <StyledEngineProvider injectFirst>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DP
            {...props}
            openTo="year"
            views={['year', 'month']}
            slotProps={{
              field: { shouldRespectLeadingZeros: true },
              calendarHeader: { format: 'YYYY/M' },
            }}
            slots={{ textField: QuarterTextField }}
          />
        </LocalizationProvider>
      </StyledEngineProvider>
    )
  }
)
const QuarterTextField = React.forwardRef(
  (props: TextFieldProps, ref: React.Ref<HTMLDivElement>) => {
    let monthText = ''
    if (
      typeof props.value == 'string' &&
      !isNaN(new Date(props.value).getTime())
    ) {
      const date = new Date(props.value)
      const startMonth = Math.floor(date.getMonth() / 3) * 3
      monthText = `${date.getFullYear()} / ${startMonth + 1} ~ ${startMonth + 3}`
    }
    return <DateTextField {...props} value={monthText} />
  }
)

// export const B = () => <div>B</div>
// desktopdatepicker - dateviewrenderes - datecalendar - monthcalendar
