import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.locale('ja')
dayjs.extend(timezone)
dayjs.extend(utc)

export const tzDayjs = dayjs
