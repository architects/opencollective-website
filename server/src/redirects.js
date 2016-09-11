export default (app) => {
  /**
   * Redirects
   */
  app.get('/consciousnesshackingsf', (req, res) => res.redirect('/chsf'));
  app.get('/consciousnesshackingsv', (req, res) => res.redirect('/chsv'));
}
