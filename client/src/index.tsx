import 'bootstrap/dist/css/bootstrap.min.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import * as auth from './auth';
import './index.css';
import * as location from './location';
import * as user from './user';
// import registerServiceWorker from './registerServiceWorker';

auth.init();
user.init()
location.init();

ReactDOM.render(
	<App />,
	document.getElementById('root') as HTMLElement
);
// registerServiceWorker();
