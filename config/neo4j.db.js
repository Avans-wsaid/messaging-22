const neo4j = require('neo4j-driver').v1;
const config = require('./config/env/env');

const driver = neo4j.driver("bolt://hobby-dehocbifaghcgbkeihidlial.dbs.graphenedb.com:24786", neo4j.auth.basic(config.env.dbDatabase, config.env.neo4jDatabasePassword));

module.exports = driver;
