import moment from 'moment'

// Add whatever moment locales we want here
import 'moment/locale/es'
import 'moment/locale/fr'
import 'moment/locale/it'

moment.locale(global.__LOCALE__ || 'en')

export default moment
