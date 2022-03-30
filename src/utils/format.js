import { formatDistance, parseJSON, add, format } from 'date-fns'

export const getFormattedTime = (time) => {
  return formatDistance(parseJSON(time), new Date(), { addSuffix: true })
}

export const getTimeAfterMinutes = (minutes) => {
  return format(add(new Date(), {
    minutes
  }), 'hh:mma dd-MM-yyyy').split(" ")
} 