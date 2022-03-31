import { formatDistance, parseJSON, add, format } from 'date-fns'

export const getFormattedTime = (time) => {
  return formatDistance(parseJSON(time), new Date(), { addSuffix: true })
}

export const getTimeAfterMinutes = (minutes) => {
  return format(add(new Date(), {
    minutes
  }), 'hh:mma dd-MM-yyyy').split(" ")
}

export const isSendEmailInOver = (createdAt, minutes) => {
  const timeNow = Date.parse(new Date());
  const createdAtTime = Date.parse(createdAt);
  const differenceInMinutes = (timeNow - createdAtTime) / (1000 * 60);
  // Return true if emails have been sent
  // Return false if emails have not been sent
  return differenceInMinutes > minutes;
}