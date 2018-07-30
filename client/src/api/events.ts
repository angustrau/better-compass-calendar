import apiRequest from './apiRequest';
import { IAccessToken } from './auth';

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

export interface IQuery {
    keywords?: string[];
    title?: string;
    location?: string;
    locationId?: number;
    manager?: string;
    managerId?: number;
    after?: Date;
    before?: Date;
    orderBy?: 'newest' | 'oldest' | 'relevance';
    subscribedUserId?: number;

}

export const queryEvents = async (query: IQuery, token: IAccessToken) => {
    const response: { events: any[] } = await apiRequest('POST', '/events/query', query, token);
    return response.events.map((event): IEventDetails => {
        return {
            ...event,
            endTime: new Date(event.endTime),
            startTime: new Date(event.startTime)
        }
    });
}

export const getEventDetails = async (id: string, token: IAccessToken) => {
    const response = await apiRequest('POST', '/events/details', { id }, token);
    return {
        ...response,
        endTime: new Date(response.endTime),
        startTime: new Date(response.startTime)
    } as IEventDetails
}