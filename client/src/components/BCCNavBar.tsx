import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
    Collapse,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    UncontrolledDropdown
} from 'reactstrap';
import * as auth from './../auth';
import * as user from './../user';
import './BCCNavBar.css';

import Logo from './../resources/Logo';

interface IProps extends RouteComponentProps<any,any> {}

interface IState {
    isOpen: boolean;
    userFullName: string;
}

class BCCNavbar extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state = {
            isOpen: false,
            userFullName: user.getUser().fullName
        }

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.userEventListener = this.userEventListener.bind(this);
    }

    public render() {
        return (
            <Navbar expand='md' color='light' light={true} className='BCCNavBar'>
                <NavbarBrand href='/'><Logo /></NavbarBrand>
                <NavbarToggler onClick={ this.toggle } />
                <Collapse isOpen={ this.state.isOpen } navbar={true}>
                    <Nav navbar={true} className='ml-auto'>
                        <UncontrolledDropdown nav={true} inNavbar={true}>
                            <DropdownToggle nav={true} caret={true}>
                                { this.state.userFullName }
                            </DropdownToggle>
                            <DropdownMenu right={true}>
                                <DropdownItem>
                                    Account settings
                                </DropdownItem>
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
        this.setState({ userFullName: user.getUser().fullName });
    }
}

export default withRouter(BCCNavbar);