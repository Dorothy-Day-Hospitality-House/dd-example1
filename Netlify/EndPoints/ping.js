//const db = require('./Helpers/pg-database.js');

exports.handler = async function(event, context) {
    try {
        //let result = await db.client_query(`select * from Settings where setting='messageoftheday';`);
        let motd = "Hello world"; // result.rows[0].value;

        return {
            statusCode: 200,
            headers: { "content-type": "application/json" },
            body: JSON.stringify({message: motd, data: 434})
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: String(error)
        }
    }
}