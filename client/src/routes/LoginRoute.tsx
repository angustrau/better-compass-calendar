import * as React from 'react';
import { Redirect } from 'react-router-dom';
import {
    Button,
    Col,
    Container,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Progress,
    Row
} from 'reactstrap';
import * as auth from '../auth';
import config from '../config';
import './LoginRoute.css';

import Logo from '../resources/Logo';

interface IState {
    /** Whether the client is currently logging in */
    loggingIn: boolean;
    /** Whether the login attempt will take a while */
    slowLogin: boolean;
    /** Whether the login attempt was unsuccessful */
    invalidUserPass: boolean;
}

/**
 * LoginRoute
 * Renders the login screen
 */
class LoginRoute extends React.Component<object, IState> {
    private usernameInput: HTMLInputElement;
    private passwordInput: HTMLInputElement;
    private rememberMeInput: HTMLInputElement;

    constructor(props: any) {
        super(props);

        this.state = {
            loggingIn: auth.isLoggingIn(),
            slowLogin: false,
            invalidUserPass: false
        }

        this.login = this.login.bind(this);
        this.refUsername = this.refUsername.bind(this);
        this.refPassword = this.refPassword.bind(this);
        this.refRememberMe = this.refRememberMe.bind(this);
    }

    public render() {
        // Redirect to main screen if user is already logged in
        if (auth.isAuthenticated()) {
            return <Redirect push={true} to='/' />
        }

        return (
            <Container fluid={true} className='LoginRoute-Root'>
                <Row noGutters={true}>
                    <Col xs='4' className='LoginRoute-InfoPane'>
                        <div className='LoginRoute-InfoPane-Branding'>
                            <Logo />
                            <h2>Better Compass Calendar</h2>
                            <h3>{ config.site.name }</h3>
                        </div>
                        <div className='LoginRoute-InfoPane-Disclaimer'>
                            By using this application you agree to share your anonymised calendar data with other users.
                        </div>
                    </Col>
                    <Col xs='8' className='LoginRoute-InputPane'>
                        { !this.state.loggingIn ? this.renderLoginForm() : this.renderLoggingIn() }
                    </Col>
                </Row>
            </Container>
        );
    }

    private renderLoginForm() {
        return (
            <Form>
                <InputGroup>
                    <Input placeholder='username' invalid={this.state.invalidUserPass} name='username' innerRef={this.refUsername} />
                </InputGroup>
                <InputGroup>
                    <Input placeholder='password' invalid={this.state.invalidUserPass} name='password' type='password' innerRef={this.refPassword} />
                    <InputGroupAddon addonType='append'>
                        <Button color='secondary' onClick={this.login}>Go</Button>
                    </InputGroupAddon>
                </InputGroup>
                <InputGroup>
                    <InputGroupAddon addonType='prepend'>
                        <InputGroupText>
                            <Input addon={true} name='rememberMe' type='checkbox' innerRef={this.refRememberMe} />
                        </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder='Remember me' disabled={true} />
                </InputGroup>
            </Form>
        );
    }

    private renderLoggingIn() {
        // Log in times are usually 30+ seconds for first login and < 5 seconds for subsequent logins
        // After 8 seconds assume the server is fetching events and wil take 30+ seconds, so show the message
        setTimeout(() => {
            this.setState({ slowLogin: true });
        }, 8000);

        return (
            <div className='LoginRoute-InputPane-LoggingIn'>
                <Progress animated={true} color='warning' value='100' />
                <div>{ !this.state.slowLogin ? 'Logging in...' : 'Fetching calendar. This may take up to 30s...'}</div>
            </div>
        );
    }

    private login() {
        this.setState({ loggingIn: true });
        auth.login(this.usernameInput.value, this.passwordInput.value, this.rememberMeInput.checked)
        .catch((error) => {
            if (error === 'Invalid username/password') {
                this.setState({ 
                    loggingIn: false,
                    invalidUserPass: true
                });
            } else {
                throw error;
            }
        });
    }

    private refUsername(input: HTMLInputElement) {
        this.usernameInput = input;
    }

    private refPassword(input: HTMLInputElement) {
        this.passwordInput = input;
    }

    private refRememberMe(input: HTMLInputElement) {
        this.rememberMeInput = input;
    }
}

export default LoginRoute;