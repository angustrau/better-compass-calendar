import * as React from 'react';
import {
	BrowserRouter as Router,
	Redirect,
	Route,
	Switch
} from 'react-router-dom';
import './App.css';
import * as auth from './auth';
import * as routes from './routes';
import * as user from './user';

interface IState {
	authenticated: boolean;
}

class App extends React.Component<object, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			authenticated: false
		}

		this.renderAuthenticatedRoutes = this.renderAuthenticatedRoutes.bind(this);
	}

	public componentDidMount() {
		auth.events.addEventListener('login', () => {
			this.setState({ authenticated: true });
		});
		auth.events.addEventListener('logout', () => {
			this.setState({ authenticated: false });
		});
	}

  	public render() {
    	return (
     		<div className="App">
				<Router>
					<Switch>
						<Route path='/login' component={ routes.LoginRoute } />
						<Route path='/' render={ this.renderAuthenticatedRoutes } />
					</Switch>
				</Router>
			</div>
    	);
	  }
	  
	private renderAuthenticatedRoutes() {
		if (!auth.isAuthenticated()) {
			return <Redirect push={true} to='/login' />
		}
	
		return (
			<Switch>
				<Route exact={true} path='/' component={ routes.IndexRoute } />
				<Route path='/f/:filter?' component={ routes.IndexRoute } />
				<Route path='/e/:eventid' component={ routes.IndexRoute } />
				<Route path='/account' component={ routes.AccountSettignsRoute} />
				<Route path='/admin/:tab?' component={ routes.AdminRoute } />
			</Switch>
		);
	}
}

export default App;
