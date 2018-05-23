import React from 'react';
import {render} from 'react-dom';
import Root from './client/Root';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './Animation.css';
import './index.css';
import store from './store';

var module = store();

render(<Root store={module.store} persistor={module.persistor} />, document.getElementById('root'));
registerServiceWorker();
