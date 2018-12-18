'use strict'

const sql = require('./sql.service')
const T = require('mssql').TYPES
const Tds = require('tedious').TYPES
const uuid = require('uuid/v4')

const select = async () => {
  const selectResult = await sql.query2('SELECT TOP 2 Forename FROM mtc_admin.pupil')
  console.log('result of select...')
  console.dir(selectResult)
}

const insert = async () => {
  const groupName = uuid().toString().substr(0, 10)
  const params = []
  params.push({
    name: 'name',
    type: T.NVarChar(50),
    value: groupName
  })
  params.push({
    name: 'school_id',
    type: T.Int,
    value: 1
  })
  const sql = 'INSERT mtc_admin.[group] (school_id, name) VALUES (@school_id, @name); SELECT SCOPE_IDENTITY()'
  const insertResult = sql.modify2(sql)
  console.log('result of insert...')
  console.dir(insertResult)
}

const main = async () => {
  await sql.init()
  select()
  insert()
}

main()
