import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Tokyo')
import { BaseDatePicker } from './BaseDatePicker'
import { DateTextField } from './DateTextFIeld'
import { MyDateTimePicker } from './MyDateTimePicker'
import {
  IconButtonNormal,
  IconButtonCancel,
  IconButtonComplete,
} from './MyIconButton'
import { MyNumberField } from './MyNumberField'
import { MySelect } from './MySelect'
import { QuarterPicker } from './QuarterPicker'
import { StyledTableCell } from './StyledTableCell'
import { MyTextField } from './StyledTextField'
import './style.css'

export {
  MyDateTimePicker,
  BaseDatePicker,
  DateTextField,
  QuarterPicker,
  IconButtonNormal,
  IconButtonCancel,
  IconButtonComplete,
  MyTextField,
  MySelect,
  MyNumberField,
  StyledTableCell,
}

/*
<QuarterPicker />
<MyDateTimePicker format="YYYY/M/D H:m" />
<BaseDatePicker
  format="YYYY/M"
  formatDensity="spacious"
  views={['year', 'month']}
  slotProps={{
    calendarHeader: { format: 'YYYY/M' },
  }}
/>
<BaseDatePicker
  format="YYYY"
  formatDensity="spacious"
  closeOnSelect={true}
  // calendar header を表示するために2つ入れる
  views={['year', 'year']}
  slotProps={{
    calendarHeader: { format: 'YYYY' },
  }}
/>

*/
