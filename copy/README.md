# Universal i18n / Display Copy Management

This folder contains definition files for different `i18n` locales as well as
copy / display / label overrides for different opencollective organizations.

The webpack build system will collapse the entire folder structure into a single data
structure and wrap it in a universal javascript module that works on both the server
and the client.

In our frontend and server code this structure can be required and used like so:

```javascript
import copy from 'opencollective-website/copy'

copy.setLocale('en')

const say = (string) => console.log(copy.getString(string))

say('paypalEmail') // Paypal Email

copy.currency('100', 'USD') // $100.00
```
