const bodyParser = require('body-parser');
const cors = require('cors');

module.exports = app => {

    app.use(bodyParser.json()); // Converts JSONs from the request body to undestand JSON
    app.use(cors({ origin: '*' })); // Allow all Origins

};
