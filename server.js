'use strict'

const MONGODB_URL  =  ``
const PORT         =   8888

const express      =  require('express')
const mongodb      =  require('mongodb')

const app          =  express()
const MongoClient  =  mongodb.MongoClient;


app.get('/saveErrorInfo', (req, res) => {

  console.log(req.query)
  
  const SCHEMA = {
    status   : ['String', 'Number'],
    type     : 'String',
    errorType: 'String',
    errorInfo: 'String'
  }
  const PARAMS = req.query

  let resData = {
    code: 1,
    msg: 'success'
  }

  Object.keys(SCHEMA).some(key => {
    if(key in PARAMS === false) {

      resData = {
        code: 0,
        msg: '字段不存在，请核实后重新提交'
      }

      res.send(JSON.stringify(resData))
      return true
    }
  })

  if(resData.code != 1) return

  MongoClient.connect(MONGODB_URL, (err, db) => {

      const DATABASE   = db.db('error_statistics');
      const FORM_NAME  = DATABASE.collection('logs');

      FORM_NAME.insertOne(PARAMS,function(error, result) {
          res.send(JSON.stringify(resData))  
          db.close();
      })

  })
})

app.listen(PORT, () => {
  console.log(`app run at ${ PORT }`)
})

