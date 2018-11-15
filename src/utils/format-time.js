import { format } from 'date-fns'
import en from 'date-fns/locale/en'
import fi from 'date-fns/locale/fi'

const locales = { en, fi }

export function getFormattedTimestamp (timestamp) {
  return format(new Date(timestamp), 'HH:mm:ss')
}

export function getFormattedDateString (date, localeKey = 'en') {
  return format(date, 'dddd MMMM Do YYYY', { locale: locales[localeKey] })
}
