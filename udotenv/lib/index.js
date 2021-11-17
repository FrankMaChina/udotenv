
/**
 * 
 * @param {*} dotenvFilesPath 
 */

const fs = require('fs');
const APP = /^APP_/;

const expand = (dotenvFilesPath) => {
  dotenvFilesPath.forEach(dotenvFile => {
    if (fs.existsSync(dotenvFile)) {
      require('dotenv-expand')(
        require('dotenv').config({
          path: dotenvFile,
        })
      );
    }
  });
};

const getClientEnvironment = (externalEnvs) =>{
  const raw = Object.keys(process.env)
    .filter(key => APP.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV: process.env.NODE_ENV
      },
      externalEnvs
    );

  // Stringify all values so we can feed into webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}

module.exports = {
  expand,
  getClientEnvironment
}