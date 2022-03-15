import { formatDistance, parseJSON } from 'date-fns'

export const getFormattedTime = (time) => {
  return formatDistance(parseJSON(time), new Date(), { addSuffix: true })
}