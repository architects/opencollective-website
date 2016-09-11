import React from 'react';
import ReactDOM from 'react-dom';
import { ReduxRouter } from 'redux-router';
import { Provider } from 'react-redux';
import initialRender from '../actions/app/initial_render';

export function render(store, mountNode) {
  const rootComponent = (
    <Provider store={store} key='provider'>
      <ReduxRouter/>
    </Provider>
  );

  return ReactDOM.render(rootComponent, mountNode, () => store.dispatch(initialRender()));
}

export default render
