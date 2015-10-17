var orm = require('sequelize-singleton'),
    config = require('./config');

orm.discover = [__dirname + "/models"];
orm.connect(config.DATABASE_URL);

orm.sequelize.sync({force: true});
//orm.sequelize.sync();

module.exports = orm;