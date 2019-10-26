import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import makeStore from './store'

makeStore()


ReactDOM.render(<App />, document.getElementById('root'));
