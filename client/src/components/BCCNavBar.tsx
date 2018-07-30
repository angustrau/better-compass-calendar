import * as React from 'react';
import {
    Link,
    RouteComponentProps,
    withRouter
} from 'react-router-dom';
import {
    Button,
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    InputGroup,
    InputGroupAddon,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    UncontrolledDropdown
} from 'reactstrap';
import * as auth from './../auth';
import * as user from './../user';
import BCCFilterBox from './BCCFilterBox';
import './BCCNavBar.css';
import BCCPushNotifToggle from './BCCPushNotifToggle';

import Logo from './../resources/Logo';

interface IProps extends RouteComponentProps<any,any> {}

interface IState {
    isOpen: boolean;
    userFullName: string;
    userIsAdmin: boolean;
}

class BCCNavbar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isOpen: false,
            userFullName: user.getUser().fullName,
            userIsAdmin: user.getUser().isAdmin
        }

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.userEventListener = this.userEventListener.bind(this);
    }

    public render() {
        return (
            <Navbar expand='md' color='light' light={true} className='BCCNavBar'>
                <NavbarBrand
                    tag={ Link }
                    to='/'
                >
                    <Logo />
                </NavbarBrand>
                <NavbarToggler onClick={ this.toggle } />
                <Collapse isOpen={ this.state.isOpen } navbar={true}>
                    <Nav navbar={true} className='BCCNavBar-Items'>
                        <div className='BCCNavBar-Search'>
                            <InputGroup>
                                <BCCFilterBox filter='' onChange={() => {return}} search={true} />
                                <InputGroupAddon addonType='append'>
                                    <Button>Search</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </div>
                        <UncontrolledDropdown nav={true} inNavbar={true}>
                            <DropdownToggle nav={true} caret={true}>
                                { this.state.userFullName }
                            </DropdownToggle>
                            <DropdownMenu right={true}>
                                <BCCPushNotifToggle />
                                <DropdownItem divider={true} />
                                <DropdownItem tag={ Link } to='/account'>
                                    Account settings
                                </DropdownItem>
                                {
                                    this.state.userIsAdmin ? (
                                        <DropdownItem tag={ Link } to='/admin'>
                                            Admin settings
                                        </DropdownItem>
                                    ) : undefined
                                }
                                <DropdownItem divider={true} />
                                <DropdownItem onClick={ this.logout }>
                                    Log out
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }

    public componentDidMount() {
        user.events.addEventListener('update', this.userEventListener);
    }

    public componentWillUnmount() {
        user.events.removeEventListener('update', this.userEventListener);
    }

    private toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    private logout() {
        auth.logout();
    }

    private userEventListener() {
        this.setState({ 
            userFullName: user.getUser().fullName,
            userIsAdmin: user.getUser().isAdmin
        });
    }
}

export default withRouter(BCCNavbar);