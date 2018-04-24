import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import './assets/libs/flexible';

ReactDOM.render(
    <App />,
    document.getElementById('app')
);
