module.exports = {
    google: {
        clientID: process.env.clientID,
        clientSecret: process.env.clientSecret,
    },
    mongodb: {
        dbURI: process.env.MongoDB,
    },
    session: {
        cookieKey: process.env.cookie,
    },
};
