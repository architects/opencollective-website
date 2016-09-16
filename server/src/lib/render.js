import renderer from '../ssr'

export default (req, res, next) => (
  renderer(req).then((result) => {
    console.log('Passing request to the renderer', req.params, req.url)
      if (result.notFound) {
        console.log('Rendering saying 404')
        next()
      } else if (result.redirectLocation) {
        console.log('Renderer making us reround')
        res.redirect(result.redirectLocation)
      } else if (result.html) {
        return res.render('pages/app', {
          layout: false,
          meta: req.meta || {},
          html: result.html,
          initialState: result.initialState
        })
      }
    })
    .catch((error) => {
      console.log('Error while rendering the renderer response', error)
      next(error)
    })
)
