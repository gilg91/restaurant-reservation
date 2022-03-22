/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://trcntaqq:wT3q3oZNfu77CvYkHPLinTKJFwnszwxk@kashin.db.elephantsql.com/trcntaqq",
  DATABASE_URL_DEVELOPMENT = "postgres://xhoorvtz:zFbHMgZ_talf8Oa7rMeeIjvRX0GpQemM@kashin.db.elephantsql.com/xhoorvtz",
  DATABASE_URL_TEST = "postgres://mvrwtzli:h2yAwklqTEidX-Yn5vAcNAsakPiVdU4b@kashin.db.elephantsql.com/mvrwtzli",
  DATABASE_URL_PREVIEW = "postgres://ieoqxtso:onpujKeJNFQO2kiVvfwSjoe8rNaxfVOm@kashin.db.elephantsql.com/ieoqxtso",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
