const mySql = require('mysql');
let roles, managers;
class Database {
    //creates database connection
    constructor(connection) {
         this.connection = connection;
    }
    //query() method executes the sql query and returns a promise
    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, result) => {
                if (err)
                    return reject(err);
                resolve(result); //result will be returned through resolve()method if the sql query executes successfully..
            });
        });
    }
    //close() method returns a promise and closes the database connection when called.
    close() {
        return new Promise((resolve, reject) => {
            //mysql end() method is called to end the connection
            this.connection.end((err) => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

module.exports = Database;