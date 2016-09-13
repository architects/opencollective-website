import apiUrl from './lib/utils'
import request from 'request'

export default (app) => {
  app.all('/api/*', (req, res) => {
    req
      .pipe(request(apiUrl(req.url), { followRedirect: false }))
      .pipe(res);
  });
}
