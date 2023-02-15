const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
global.Book = require('./api/models/bookModel');
global.Cart = require('./api/models/cartModel');
const routes = require('./api/routes/bookRoutes');

mongoose.connect(
    'mongodb+srv://library:ljfrDUX64vYIPn0Y@atlascluster.gplnuda.mongodb.net/wanonly',
    { useNewUrlParser: true}
)

const port = process.env.PORT || 3000;
// const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

routes(app);
app.listen(port);

app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found`})
})

console.log(`Server started on port ${port}`);