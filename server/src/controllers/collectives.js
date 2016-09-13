import React from 'react';
import config from 'config';
import { renderToString } from 'react-dom/server';
import Widget from '../../../frontend/src/components/Widget';
import i18n from '../../../frontend/src/lib/i18n';
import { fetchTransactions, fetchUsers } from '../lib/client'

/**
 * Show the widget of a collective
 */
const widget = (req, res, next) => {
  const { group } = req;

  Promise.all([
    fetchTransactions(group.slug, {perPage: 3}),
    fetchUsers(group.slug)
  ])
  .then(([transactions, users]) => {
    const props = {
      options: {
        header: (req.query.header !== 'false'),
        transactions: (req.query.transactions !== 'false'),
        donate: (req.query.donate !== 'false'),
        backers: (req.query.backers !== 'false')
      },
      group,
      i18n: i18n('en'),
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
