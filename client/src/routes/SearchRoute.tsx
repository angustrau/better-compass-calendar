import * as React from 'react';
import { 
    RouteComponentProps, 
    withRouter 
} from 'react-router-dom';
import {
    Button,
    Card,
    CardBody,
    CardText,
    CardTitle,
    Col,
    Container,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row
} from 'reactstrap';
import BCCFilterBox from '../components/BCCFilterBox';
import BCCNavBar from '../components/BCCNavBar';
import * as api from './../api';
import * as auth from './../auth';
import BCCEventDetailModal from './../components/BCCEventDetailModal';
import * as location from './../location';
import * as user from './../user';
import filterToQuery from './../utils/filterToQuery';
import './SearchRoute.css';

interface IRouteProps {
    search?: string
}

interface IProps extends RouteComponentProps<IRouteProps> {}

interface IState {
    searchTerm: string;
    orderBy: 'latest' | 'oldest' | 'relevance';
    results: api.IEventDetails[];
    limit: number;
    showingEventId: string | null;
}

class SearchRoute extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);

        this.state =  {
            searchTerm: decodeURIComponent(this.props.match.params.search || ''),
            orderBy: 'relevance',
            results: [],
            limit: 25,
            showingEventId: null
        }

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSearchClick = this.handleSearchClick.bind(this);
        this.handleOrderByChange = this.handleOrderByChange.bind(this);
        this.handleMoreClick = this.handleMoreClick.bind(this);
        this.handleDetailsClose = this.handleDetailsClose.bind(this);
    }

    public render() {
        const { searchTerm, orderBy, results, limit, showingEventId } = this.state;
        const shownResults = results.slice(0, Math.min(results.length, limit) - 1);

        return (
            <div>
                <BCCNavBar />
                <Container className='SearchRoute-Body'>
                    <Row>
                        <Col>
                            <InputGroup>
                                <BCCFilterBox filter={ searchTerm } onChange={ this.handleSearchChange } search={ true } className='SearchRoute-Input' />
                                <InputGroupAddon addonType='append'>
                                    <InputGroupText>Order by:</InputGroupText>
                                    <Input type='select' value={ orderBy } onChange={ this.handleOrderByChange } >
                                        <option>relevance</option>
                                        <option>latest</option>
                                        <option>oldest</option>
                                    </Input>
                                    <Button onClick={ this.handleSearchClick }>Go</Button>
                                </InputGroupAddon>
                            </InputGroup>
                        </Col>
                    </Row>
                    <Row>
                        { shownResults.map((event, key) => {
                            const date = event.startTime.toLocaleString('en-au', { day: '2-digit', month: 'long' });
                            const startTime = event.startTime.toLocaleString('en-au', { hour: '2-digit', minute: '2-digit' });

                            return (
                                <Col sm='3' xs='12' className='SearchRoute-result' key={ key }>
                                    <Card>
                                        <CardBody>
                                            <CardTitle>{ event.title }</CardTitle>
                                            <CardText>
                                                { date }
                                                <br />
                                                { startTime }
                                                <br />
                                                { location.getLocation(event.locationId || 0).shortName }
                                                <br />
                                                { user.getManager(event.managerId).displayCode }
                                            </CardText>
                                            <Button onClick={ () => this.handleDetailsClick(event) }>More</Button>
                                        </CardBody>
                                    </Card>
                                </Col>
                            );
                        }) }
                    </Row>
                    <Row>
                        <Col xs='12'>
                            <Button onClick={ this.handleMoreClick } outline={true} className='SearchRoute-more'>More</Button>
                        </Col>
                    </Row>
                </Container>
                <BCCEventDetailModal
                    eventId={ showingEventId }
                    isOpen={ showingEventId !== null }
                    onClose={ this.handleDetailsClose }
                    permalink={ true }
                />
            </div>
        );
    }

    public componentDidMount() {
        this.search();
    }

    private handleSearchChange(searchTerm: string) {
        this.setState({ searchTerm });
    }

    private handleSearchClick() {
        this.props.history.push('/s/' + encodeURIComponent(this.state.searchTerm));
        this.search();
    }

    private handleOrderByChange(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ orderBy: e.target.value as any });
    }

    private handleMoreClick() {
        this.setState({ limit: this.state.limit + 25 });
    }

    private handleDetailsClick(event: api.IEventDetails) {
        this.setState({ showingEventId: event.id });
    }

    private handleDetailsClose() {
        this.setState({ showingEventId: null });
    }

    private async search() {
        const { searchTerm, orderBy } = this.state;
        const query = filterToQuery(searchTerm);
        query.orderBy = orderBy;
        this.setState({
            results: await api.queryEvents(query, auth.getToken()!),
            limit: 25
        });
    }
}

export default withRouter(SearchRoute);