const { Sequelize } = require('sequelize');
const path = require('path');


// Create Sequelize
const sequelize = new Sequelize('dezone', 'dezone', 'dezoneapp', {
  host: 'localhost',
  dialect: 'mariadb'
});

module.exports = {
	'db': sequelize,
}


