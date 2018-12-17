'use strict'

const sql = require('mssql')
const config = require('./config')
const sqlConfig = require('./sqlConfig')
const 

const ex1_inline = async () => {
  try {
    await sql.connect(`mssql://${config.Application.Username}:${config.Application.Password}@${config.Server}/${config.Database}`)
    const result = await sql.query(`select top 5 * from mtc_admin.pupil`)
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

const ex2_request = async () => {
  try {
    const pool = await new sql.ConnectionPool(sqlConfig).connect()
    const req = pool.request()
    const result = await req.query(`select top 5 * from mtc_admin.pupil`)
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

const ex3_sql_service = async () => {
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
