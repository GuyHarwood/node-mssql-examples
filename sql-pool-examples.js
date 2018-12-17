'use strict'

const sqlconfig = require('./sqlconfig')
const sqlService = require('./sql.service')
const uuid = require('uuid/v4')
const mssql = require('mssql')

let pool

const connect = async () => {
  pool = new mssql.ConnectionPool(sqlconfig)
  pool.on('error', err => {
    console.error('POOL ERROR:', err)
  })
  await mssql.connect(sqlconfig)
}

const select = async () => {
  try {
    await pool.init()
    const result = await sqlService.query2(`select top 5 forename from mtc_admin.pupil`)
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

const update = async () => {
  try {
    const newName = uuid().toString()
    console.log(`attempting to set pupil 1 forename to ${newName}...`)
    await pool.init()
    const params = [{
        name: 'name',
        type: mssql.NVarChar,
        value: newName
      },
      {
        name: 'id',
        type: mssql.Int,
        value: 1
      }
    ]
    const result = await sqlService.modify3(`UPDATE mtc_admin.pupil SET foreName=@name WHERE id=@id`, params)
    console.dir(result)
  } catch (err) {
    console.error(err)
  }
}

const updateRaw = async () => {
  const pool = await new mssql.ConnectionPool(sqlconfig)
  await pool.connect()

  const newName = uuid().toString()
  const sql = `UPDATE mtc_admin.pupil SET foreName=@name WHERE id=@id`
  const params = [{
      name: 'name',
      type: mssql.NVarChar,
      value: newName
    },
    {
      name: 'id',
      type: mssql.Int,
      value: 1
    }
  ]
  const ps = await new mssql.PreparedStatement()
  ps.input(params[0].name, params[0].type)
  ps.input(params[1].name, params[1].type)
  let result
  try {
    await ps.prepare(sql)
    result = await ps.execute(params.map(p => p.value))
    await ps.unprepare()
  } catch (error) {
    await ps.unprepare()
    console.error(error)
  }
  pool.close()
}

const updateCb = () => {
  mssql.connect(sqlconfig, function (err) {
    if (err) console.log(err)
    const newName = uuid().toString()
    const sql = `UPDATE mtc_admin.pupil SET foreName=@name WHERE id=@id`
    const params = [{
        name: 'name',
        type: mssql.NVarChar,
        value: newName
      },
      {
        name: 'id',
        type: mssql.Int,
        value: 1
      }
    ]
    const ps = new mssql.PreparedStatement()
    ps.input(params[0].name, params[0].type)
    ps.input(params[1].name, params[1].type)
    ps.prepare(sql, err => {
      if (err) console.log(err)

      ps.execute(
        params.map(p => p.value), (err, result) => {
          if (err) console.log(err)
          console.dir(result)
          ps.unprepare(err => {
            if (err) console.log(err)
          })
        })
    })
  })
}

const cleanup = async () => {
  await pool.drain()
}

const main = async () => {
  try {
    updateCb()
    // await updateRaw()
    // await update()
    // await select()
    // await cleanup()
  } catch (error) {
    console.error('ERROR:', error)
  }
  process.exit()
}

main()