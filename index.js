'use strict'

const sql = require('mssql')
const config = require('./config')
const sqlConfig = require('./sqlConfig')

const ex1 = async () => {
  try {
    await sql.connect(`mssql://${config.Application.Username}:${config.Application.Password}@${config.Server}/${config.Database}`)
    const result = await sql.query(`select top 5 * from mtc_admin.pupil`)
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

const ex2 = async () => {
  try {
    const pool = await new sql.ConnectionPool(sqlConfig).connect()
    const req = pool.request()
    const result = await req.query(`select top 5 * from mtc_admin.pupil`)
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

ex2()
