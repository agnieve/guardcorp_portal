
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants');

module.exports = (phase, { defaultConfig }) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      env: {
        env_type: "local",
        mongodb_username: "ag04",
        mongodb_password: "pass123",
        mongodb_database: "portal-dev",
        NEXTAUTH_SECRET: 'guardcorp',
        base_url: 'http://localhost:3000'
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
    },
  };
};

