'use strict'

const sql = require('mssql')
const config = require('./sqlconfig')
const winston = require('winston')

let pool = null

const sqlPoolService = {}

/**
 * Initialise the connection pool.  Called once per application instance
 */
sqlPoolService.init = async () => {
  if (pool !== null) return
  pool = await new sql.ConnectionPool(config).connect()
  pool.on('error', function (err) {
    winston.error(err)
  })
}

/**
 * Get a request from the pool.
 * @return {Promise}
 */
sqlPoolService.newRequest = async () => {
  if (pool === null) {
    await sqlPoolService.init()
  }
  return pool.request()
}

/**
 * Get a prepared statement from the pool.
 * @return {Promise}
 */
sqlPoolService.newPreparedStatement = async () => {
  if (pool === null) {
    await sqlPoolService.init()
  }
  return new sql.PreparedStatement()
}

/**
 * Disconnect all pool connections
 */
sqlPoolService.drain = async () => {
  if (pool) {
    winston.info('closing pool...')
    await pool.close()
    winston.info('pool closed.')
  } else {
    winston.info('no pool to close')
  }
}

module.exports = sqlPoolService
