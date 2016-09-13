import { join } from 'path';
import favicon from 'serve-favicon';
import robots from 'robots.txt';
import express from 'express';

export default (app, options = {}) => {
  const staticRoot = app.get('staticRoot');
  const publicPath = app.get('publicPath');

  app.use(favicon(join(staticRoot, 'images/favicon.ico.png')));
  app.use(robots(join(staticRoot,'robots.txt')));
  app.use(publicPath, express.static(staticRoot, { maxAge: '1d' }));
}
