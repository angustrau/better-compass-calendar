import cheerio from 'cheerio';
import url from './url';

let auth = {
    _isAuthenticated: false
};

auth.login = async (username, password) => {
    let loginPage = cheerio.load(await fetch(url('/login.aspx?sessionstate=disabled'), {
        cache: 'no-cache',
        credentials: 'same-origin',
        mode: 'cors',
        redirect: 'manual'
    }).then(x => x.text()));

    let authRequestData = new URLSearchParams();
    authRequestData.append('__VIEWSTATE', loginPage('#__VIEWSTATE').val());
    authRequestData.append('browserFingerprint', loginPage('#browserFingerprint').val());
    authRequestData.append('username', username);
    authRequestData.append('password', password);
    authRequestData.append('button1', 'Sign in');
    authRequestData.append('rememberMeChk', 'on');
    authRequestData.append('__VIEWSTATEGENERATOR', loginPage('#__VIEWSTATEGENERATOR').val());

    let response = await fetch(url('/login.aspx?sessionstate=disabled'), {
        body: authRequestData,
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            //"Cache-Control": "max-age=0",
        },
        method: 'POST',
        mode: 'cors',
        redirect: 'manual'
    });


    auth._isAuthenticated = true;
}

auth.isAuthenticated = () => {
    return auth._isAuthenticated;
}

window.auth = auth;

export default auth;