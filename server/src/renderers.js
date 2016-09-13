import mw from './middlewares'
import * as controllers from './controllers'

const renderer = () => true

export const middleware = (req, res, next) => (
  renderer(req).then((result) => {
      if (result.notFound) {
        next()
      } else if (result.redirectLocation) {
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
    .catch((error) => next(error))
)

export const serverSide = (app, options = {}) => {
  const render = middleware
    /**
   * Server side render the react app
   *
   * NOTE:
   * When we refactor PublicGroup to fetch the group in the container, we can remove
   * the explicit routes and just do `app.use(render)`
   */
  app.get('/', mw.ga, mw.addTitle('OpenCollective - Collect and disburse money transparently'), controllers.homepage, render);
  app.get('/about', mw.ga, mw.addTitle('About'), render);
  app.get('/discover/:tag?', mw.ga, mw.addTitle('Discover'), render);
  app.get('/faq', mw.ga, mw.addTitle('Answers'), render);
  app.get('/addgroup', mw.ga, mw.addTitle('Create a new group'), render);
  app.get('/login/:token', mw.ga, mw.addTitle('Open Collective'), render);
  app.get('/login', mw.ga, mw.addTitle('Open Collective Login'), render);
  app.get('/leaderboard', mw.ga, mw.fetchLeaderboard, mw.addTitle('Open Collective Leaderboard'), render);
  app.get('/opensource/apply/:token', mw.ga, mw.extractGithubUsernameFromToken, mw.addTitle('Sign up your Github repository'), render);
  app.get('/opensource/apply', mw.ga, mw.addTitle('Sign up your Github repository'), render);
  /* Leaving github/apply routes for existing links */
  app.get('/github/apply/:token', mw.ga, mw.extractGithubUsernameFromToken, mw.addTitle('Sign up your Github repository'), render);
  app.get('/github/apply', mw.ga, mw.addTitle('Sign up your Github repository'), render);
  app.get('/connect/github', mw.ga, render);
  app.get('/:slug/connect/:provider', mw.ga, render);
  app.get('/:slug/edit-twitter', mw.ga, controllers.profile, render);
  app.get('/:slug/edit', mw.ga, mw.addTitle('Edit'), mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/subscriptions', mw.ga, mw.addTitle('My Subscriptions'), render);
  app.get('/:slug([A-Za-z0-9-]+)/connected-accounts', mw.ga, render);
  app.get('/:slug([A-Za-z0-9-]+)/:type(expenses|donations)', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/expenses/new', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/donate/:amount', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)/donate/:amount/:interval', mw.ga, mw.fetchGroupBySlug, mw.addMeta, render);
  app.get('/:slug([A-Za-z0-9-]+)', mw.ga, controllers.profile, mw.addMeta, render);
}
