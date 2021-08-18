export function toUpper (string: string): string {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word[0].toUpperCase() + word.substr(1))
    .join(' ')
}
