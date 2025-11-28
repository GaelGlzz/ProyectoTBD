const mysql = require('mysql2');

let conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'aerocontrol',
    password: '',
    multipleStatements: true
});

conexion.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

module.exports = conexion;
