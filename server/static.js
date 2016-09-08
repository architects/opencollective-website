import favicon from 'serve-favicon';
import express from 'express';
import robots from 'robots.txt';

module.exports = function (app, options = {}) {
  /**
   * Favicon
   */
  app.use(favicon(app.project.buildPath('images/favicon.ico.png')));

  /**
   * Static folder
   */
  app.use('/static', express.static(app.project.paths.build), { maxAge: '1d' })

  /**
   * GET /robots.txt
   */
  //app.use(robots(app.project.buildPath('robots.txt')));

  if (options.dev && app.project) {

  }
}
