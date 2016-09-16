import config from 'config';
import api from '../lib/api';
import { renderToString } from 'react-dom/server'
import React from 'react'
import { Widget } from '../ssr'

/**
 * Show the widget of a collective
 */
const widget = (req, res, next) => {
  const { group } = req;

  Promise.all([
    api.get(`/groups/${group.slug}/transactions?per_page=3`),
    api.get(`/groups/${group.slug}/users`)
  ])
  .then(([transactions, users]) => {
    const props = {
      options: {
        header: (req.query.header !== 'false'),
        transactions: (req.query.transactions !== 'false'),
        donate: (req.query.donate !== 'false'),
        backers: (req.query.backers !== 'false')
      },
      lang: 'en',
      group,
      transactions,
      users,
      href: `${config.host.website}/${group.slug}`
    };

    const html = renderToString(<Widget {...props} />);

    res.render('pages/widget', {
      layout: false,
      html
    });
  })
  .catch(next);

};

export default { widget };
