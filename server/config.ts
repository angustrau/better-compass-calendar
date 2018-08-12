export = {
    /** The port to run the server on */
    port: process.env.PORT || 3001,
    /** The address that the server is deployed to */
    hostname: 'https://bcc.angustrau.me',
    /** The environment to be deployed */
    environment: process.env.NODE_ENV || 'production',
    /** Rate limit for outgoing requests */
    requestsPerSecond: 10,
    /** User agent to use for outgoing requests */
    userAgent: 'better-compass-calendar tra0172@mhs.vic.edu.au',
    /** Address of Compass school endpoint */
    schoolURL: 'https://mhs-vic.compass.education',
    /** Contact information */
    contact: 'mailto:tra0172@mhs.vic.edu.au'
}