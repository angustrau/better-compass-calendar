import { IQuery } from '../api';
import * as user from '../user';

export interface IToken {
    type: string,
    data: any
}

const parseDate = (dateString: string) => {
    try {
        const [year, month, date] = dateString.split('-');
        return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(date, 10));
    } catch (error) {
        return null;
    }
}

const filterToQuery = (filter: string): IQuery => {
    const tokens = filter.trim()
    .split(' ')
    .map((word): IToken => {
        const token = word.split(':');

        if (token[0] === 'subscribed') {
            return {
                type: 'subscribed',
                data: ''
            }
        }

        if (!token[1]) {
            return {
                type: 'keyword',
                data: token[0]
            }
        }

        const date = parseDate(token[1]);
        switch (token[0]) {
            case 'before':
                return {
                    type: date ? 'before' : 'keyword',
                    data: date || word
                }
            case 'after':
                return {
                    type: date ? 'after' : 'keyword',
                    data: date || word
                }
            case 'during':
                return {
                    type: date ? 'during' : 'keyword',
                    data: date || word
                }
            case 'title':
                return {
                    type: 'title',
                    data: token[1]
                }
            case 'teacher':
                return {
                    type: 'managerid',
                    data: user.getAllManagers().find(x => x.displayCode === token[1])!.id
                }
            case 'room':
                return {
                    type: 'location',
                    data: token[1]
                }
            default:
                return {
                    type: 'keyword',
                    data: word
                }
        }
    });

    const keywords: string[] = [];
    let title: string | undefined;
    let location: string | undefined;
    let managerId: number | undefined;
    let after: Date | undefined;
    let before: Date | undefined;
    let subscribedUserId: number | undefined;
    tokens.forEach((token) => {
        switch (token.type) {
            case 'keyword':
                keywords.push(token.data);
                break;
            case 'title':
                title = token.data;
                break;
            case 'location':
                location = token.data;
                break;
            case 'managerid':
                managerId = token.data;
                break;
            case 'before':
                if (!before || token.data < before) {
                    before = token.data;
                }
                break;
            case 'after':
                if (!after || token.data > after) {
                    after = token.data;
                }
                break;
            case 'during':
                if (!before || token.data < before) {
                    before = token.data;
                }
                if (!after || token.data > after) {
                    after = token.data;
                }
                break;
            case 'subscribed':
                subscribedUserId = user.getUser().id;
                break;
            default:
                break;
        }
    });

    return {
        keywords,
        title,
        location,
        managerId,
        after,
        before,
        subscribedUserId
    };
}

export default filterToQuery;