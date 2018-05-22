const mysql = require('mysql')
const { mysql: config } = require('../config')
const pool = mysql.createPool({
  host     :  config.host,
  user     :  config.user,
  password :  config.pass,
  database :  config.db
})

let query = function( sql, values ) {
  return new Promise(( resolve, reject ) => {
    pool.getConnection(function(err, connection) {
      if (err) {
        reject( err )
      } else {
        connection.query(sql, values, ( err, rows) => {

          if ( err ) {
            reject( err )
          } else {
            resolve( rows )
          }
          connection.release()
        })
      }
    })
  })
}

module.exports = { query }
