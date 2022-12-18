const {PHASE_DEVELOPMENT_SERVER} = require('next/constants');

module.exports = (phase, {defaultConfig}) => {

    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return {
            env: {
                env_type: "local",
                mongodb_username: "ag04",
                mongodb_password: "pass123",
                mongodb_database: "portal-dev",
                NEXTAUTH_SECRET: 'guardcorp',
                base_url: 'http://localhost:3000',
                PUSHER_APP_ID: "1501471",
                PUSHER_APP_KEY: "f09af3026c01aba188d3",
                PUSHER_APP_SECRET: "cc57629351891b3e88dc",
                GOOGLE_MAP_KEY: "AIzaSyCgi4N0oldgAPrkEBsm9BET-NB_vnzzA6s",
                MAIL_HOST: "smtp.gmail.com",
                MAIL_PORT: "465",
                MAIL_USER: "ag@castledigital.com.au",
                MAIL_PASSWORD: "vewxiyyirkxkswpj",
                MAIL_SENDER_EMAIL: "ag@castledigital.com.au"
            },
            images: {
                remotePatterns: [
                    {
                        protocol: 'https',
                        hostname: 'i.ibb.co',
                    },
                ],
            },
        };
    }

    return {
        env: {
            env_type: "server",
            mongodb_username: "agnieve0513",
            mongodb_password: "Evien05131997",
            mongodb_clustername: "cluster0",
            mongodb_database: "portal-dev",
            NEXTAUTH_SECRET: 'guardcorpapp',
            base_url: 'https://guardcorp-portal.vercel.app/',
            GOOGLE_MAP_KEY: "AIzaSyCgi4N0oldgAPrkEBsm9BET-NB_vnzzA6s",
            MAIL_HOST: "smtp.gmail.com",
            MAIL_PORT: "465",
            MAIL_USER: "ag@castledigital.com.au",
            MAIL_PASSWORD: "vewxiyyirkxkswpj",
            MAIL_SENDER_EMAIL: "ag@castledigital.com.au"
        },
        images: {
            remotePatterns: [
                {
                    protocol: 'https',
                    hostname: 'i.ibb.co',
                },
                {
                    protocol: 'https',
                    hostname: 'expo.dev',
                },
            ],
        },
    };
};

