const neo4j = require('neo4j-driver').v1;
const config = require('./env/env');

const driver = neo4j.driver("bolt://hobby-bpjpjckeehocgbkekibajjal.dbs.graphenedb.com:24786", neo4j.auth.basic(config.env.dbDatabase, config.env.neo4jDatabasePassword));

module.exports = driver;
