export default function getFormattedTime (timestamp) {
  const safeTime = time => ('0' + time).slice(-2)
  const date = new Date(timestamp)
  return (
    safeTime(date.getHours()) +
    ':' +
    safeTime(date.getMinutes()) +
    ':' +
    safeTime(date.getSeconds())
  )
}
