import React from 'react';
import { render } from 'react-dom';
import Router from "./components/Router";
require('./bootstrap');

render(<Router />, document.querySelector('#app'));


