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
    /** Whether the menu is open */
    isOpen: boolean;
    /** The name of the logged in user */
    userFullName: string;
    /** Whether the logged in user is an admin */
    userIsAdmin: boolean;
    /** The term in the search box */
    search: string;
}

/**
 * BCCNavBar
 * Renders the navigation bar and dropdown
 */
class BCCNavbar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isOpen: false,
            userFullName: user.getUser().fullName,
            userIsAdmin: user.getUser().isAdmin,
            search: ''
        }

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.userEventListener = this.userEventListener.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
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
                                <BCCFilterBox filter={ this.state.search } onChange={ this.handleSearchChange } search={true} />
                                <InputGroupAddon addonType='append'>
                                    <Button onClick={ this.handleSearchClick }>Search</Button>
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
        // Listen for user detail updates
        user.events.addEventListener('update', this.userEventListener);
    }

    public componentWillUnmount() {
        // Remove user detail update listener
        user.events.removeEventListener('update', this.userEventListener);
    }

    /**
     * Toggle the menu open state
     */
    private toggle() {
        this.setState({ isOpen: !this.state.isOpen });
    }

    /**
     * Log out the user
     */
    private logout() {
        auth.logout();
    }

    /**
     * Update user details
     */
    private userEventListener() {
        this.setState({ 
            userFullName: user.getUser().fullName,
            userIsAdmin: user.getUser().isAdmin
        });
    }

    /**
     * Change the search term
     */
    private handleSearchChange(search: string) {
        this.setState({ search });
    }

    /**
     * Navigate to search page
     */
    private handleSearchClick() {
        this.props.history.push('/s/' + encodeURIComponent(this.state.search));
    }
}

export default withRouter(BCCNavbar);