const Pool = require(`pg`).Pool;
const pool = new Pool({
    user: `robertpath`,
    password: `300129`,
    host: `localhost`,
    port: 5432,
    database: `my_notes`,
});

module.exports = pool;
