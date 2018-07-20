import config from '../config';
import { IAccessToken } from "./auth";

const apiRequest = async (method: 'GET' | 'POST' | 'DELETE', endpoint: string, body?: any, token?: IAccessToken) => {
    const response = await fetch(config.apiEndpoint + endpoint, {
        body: body ? JSON.stringify(body) : undefined,
        headers: {
            'Authorization': token ? token.token : '',
            'Content-Type': 'application/json'
        },
        method
    })
    .then(res => {
        return res.json();
    });

    if (response.error) {
        throw response.error;
    }
    
    return response;
}
export default apiRequest;