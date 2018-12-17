'use strict'

const sqlconfig = require('./sqlconfig')
const uuid = require('uuid/v4')
const mssql = require('mssql')

let pool

const connect = async () => {
  pool = new mssql.ConnectionPool(sqlconfig)
  pool.on('error', err => {
    console.error('POOL ERROR:', err)
  })
  await pool.connect()
}

const select = async () => {
  try {
    const request = new mssql.Request(pool)
    const result = await request.query(`select top 2 forename from mtc_admin.pupil`)
    console.log('select result...')
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

const update = async () => {
  let request
  try {
    const newName = uuid().toString().substr(0, 15)
    console.log(`attempting to set pupil 1 forename to ${newName}...`)
    request = new mssql.PreparedStatement(pool)
    request.input('name', mssql.NVarChar)
    request.input('id', mssql.Int)
    const sql = 'UPDATE mtc_admin.pupil SET foreName=@name WHERE id=@id'
    await request.prepare(sql)
    const result = await request.execute({ name: newName, id: 1 })
    await request.unprepare()
    console.log('update result..')
    console.dir(result)
    console.dir(result)
  } catch (err) {
    request.unprepare()
    console.error(err)
  }
}

const cleanup = async () => {
  await pool.close()
}

const main = async () => {
  try {
    await connect()
    await update()
    await select()
    await cleanup()
  } catch (error) {
    console.error('ERROR:', error)
  }
  process.exit()
}

main()
