export function toUpper (string: string): string {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word[0].toUpperCase() + word.substr(1))
    .join(' ')
}

function padTimeElement (rawTime: number | string): string {
  return rawTime.toString().padStart(2, '0')
}

export function formatISOToLocalDate (isoDate: string, includeSeconds: boolean = true): string {
  if (!isoDate) return isoDate

  const date = new Date(isoDate)
  const dateSection = [date.getFullYear(), date.getMonth() + 1, date.getDate()].map(t => padTimeElement(t)).join('-')
  const timeSection = [date.getHours(), date.getMinutes()].concat(includeSeconds ? [date.getSeconds()] : []).map(t => padTimeElement(t)).join(':')
  return `${dateSection}T${timeSection}`
}
