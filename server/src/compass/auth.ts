import cheerio = require('cheerio');
import request = require('./request');
import AuthToken = require('./AuthToken');
import errors = require('./errors');
import { jar } from 'request';

/**
 * Authenticates with the Compass service
 * @async
 * @param   {string} username - A username to try authenticate as
 * @param   {string} password - A password to try authenticate with
 * @returns {Promise<AuthToken>}
 */
export const login = async (username: string, password: string): Promise<AuthToken> => {
    let cookieJar = jar();

    // Request the login page to establish a session cookie and get generated login form data
    // Parses the page into a jQuery-like function
    let loginPage = await request('/login.aspx?sessionstate=disabled', {
        method: 'GET',
        jar: cookieJar
    });
    let $loginPage = cheerio.load(loginPage.body);
    
    let data = {
        '__VIEWSTATE': $loginPage('#__VIEWSTATE').val(),
        'browserFingerprint': $loginPage('#browserFingerprint').val(),
        'username': username,
        'password': password,
        'button1': 'Sign in',
        'rememberMeChk': 'on',
        '__VIEWSTATEGENERATOR': $loginPage('#__VIEWSTATEGENERATOR').val()
    }

    let response = await request('/login.aspx?sessionstate=disabled', {
        form: data,
        method: 'POST',
        jar: cookieJar
    });

    if (response.statusCode === 302) {
        // Authentication success, redirected to main page
        let mainPage = await request('/', {
            method: 'GET',
            jar: cookieJar
        });

        const userId = parseInt(mainPage.body.match(/Compass.organisationUserId = (\d+)/)[1]);

        return new AuthToken(userId, cookieJar);
    } else {
        throw errors.INVALID_USERNAME_PASSWORD;
    }
}