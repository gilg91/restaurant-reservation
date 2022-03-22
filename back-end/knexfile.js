/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require('dotenv').config();
const path = require("path");

const {
  DATABASE_URL = "postgres://efitrqig:vOLdC4LT_qgtT-wt_j2GXi2nMrbTKKO2@kashin.db.elephantsql.com/efitrqig",
  DATABASE_URL_DEVELOPMENT = "postgres://bmrobplu:bTybMIYcad75LAy6RMPW4Uq5EKf1L3yb@kashin.db.elephantsql.com/bmrobplu",
  DATABASE_URL_TEST = "postgres://pufgciki:03_sBNb1Mg2YKaFc4eFAGEEzd5Dx-Izo@kashin.db.elephantsql.com/pufgciki",
  DATABASE_URL_PREVIEW = "postgres://jgiujqvm:3IZJvrZo3TCYi8XXyYsKiW_IZdvHjJRe@kashin.db.elephantsql.com/jgiujqvm",
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
