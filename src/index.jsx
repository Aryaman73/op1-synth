import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { legacy_createStore as createStore } from 'redux';
import reducers from './resources/redux/reducers.js';
import App from './resources/components/app/App.jsx';
import { startAnalytics } from './analytics.js';

const store = createStore(reducers);

createRoot(document.getElementById('root')).render(
   <Provider store={ store }>
      <App />
   </Provider>
);

startAnalytics();
