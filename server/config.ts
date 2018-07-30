export = {
    port: process.env.PORT || 80,
    hostname: 'http://localhost',
    environment: process.env.NODE_ENV || 'production',
    neverMigrateDB: true,
    requestsPerSecond: 10,
    proxy: {
        address: '127.0.0.1:3001',
        strictSSL: false
    },
    userAgent: 'better-compass-calendar tra0172@mhs.vic.edu.au',
    //userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36',
    schoolURL: 'https://mhs-vic.compass.education',
    contact: 'mailto:tra0172@mhs.vic.edu.au'
}