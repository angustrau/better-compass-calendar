import apiRequest from './apiRequest';
import { IAccessToken } from './auth';

/**
 * Information stored about an event
 */
export interface IEventDetails {
    id: string;
    title: string;
    description: string;
    activityId: number;
    locationId: number | null;
    managerId: number;
    allDay: boolean;
    cancelled: boolean;
    startTime: Date;
    endTime: Date;
    hasChanged: boolean;
    hash: string;
}

/**
 * A query to be run against the event database
 */
export interface IQuery {
    keywords?: string[];
    title?: string;
    location?: string;
    locationId?: number;
    manager?: string;
    managerId?: number;
    after?: Date;
    before?: Date;
    orderBy?: 'latest' | 'oldest' | 'relevance';
    subscribedUserId?: number;

}

/**
 * Query for events
 * @async
 * @param {IQuery} query
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<IEventDetails[]>} The result of the query
 */
export const queryEvents = async (query: IQuery, token: IAccessToken): Promise<IEventDetails[]> => {
    const response: { events: any[] } = await apiRequest('POST', '/events/query', query, token);
    return response.events.map((event): IEventDetails => {
        return {
            ...event,
            endTime: new Date(event.endTime),
            startTime: new Date(event.startTime)
        }
    });
}

/**
 * Get the details for one specific event
 * @async
 * @param {string} id The id of the event to look up
 * @param {IAccessToken} token An authorisation token
 * @returns {Promise<IEventDetails>} 
 */
export const getEventDetails = async (id: string, token: IAccessToken) => {
    const response = await apiRequest('POST', '/events/details', { id }, token);
    return {
        ...response,
        endTime: new Date(response.endTime),
        startTime: new Date(response.startTime)
    } as IEventDetails
}