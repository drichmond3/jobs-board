import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import App from './App';
import { SearchProvider } from './service/search-context';

const MAX_RESULTS_PER_PAGE = 15;
const SEARCH_DEBOUNCE_MILLISECONDS = 400;

ReactDOM.render(
  <React.StrictMode>
    <SearchProvider maxResultCount={MAX_RESULTS_PER_PAGE} debounceInMilliseconds={SEARCH_DEBOUNCE_MILLISECONDS}>
      <App />
    </SearchProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
