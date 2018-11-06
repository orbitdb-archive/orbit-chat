import i18n from 'i18next'
import { reactI18nextModule } from 'react-i18next'

import translationEN from 'locales/en/translation.json'
import translationFI from 'locales/fi/translation.json'

i18n
  .use(reactI18nextModule) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: translationEN
      },
      fi: {
        translation: translationFI
      }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already handles xss
    }
  })

export default i18n
