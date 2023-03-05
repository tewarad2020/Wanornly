const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
global.Book = require('./api/models/bookModel');
global.Cart = require('./api/models/cartModel');
global.User = require('./api/models/usersModel')
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

// test
// app.use(methodOverride('_method'))
// app.set('view engine', 'ejs');
// const mongoURI = 'mongodb+srv://library:ljfrDUX64vYIPn0Y@atlascluster.gplnuda.mongodb.net/wanonly'
// const conn = mongoose.createConnection(mongoURI)

// let gfs;

// conn.once('open', () => {
//     // Init stream
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads');
// });

// const storage = new GridFsStorage({
//     url: mongoURI,
//     file: (req, file) => {
//       return new Promise((resolve, reject) => {
//         crypto.randomBytes(16, (err, buf) => {
//           if (err) {
//             return reject(err);
//           }
//           const filename = buf.toString('hex') + path.extname(file.originalname);
//           const fileInfo = {
//             filename: filename,
//             bucketName: 'uploads'
//           };
//           resolve(fileInfo);
//         });
//       });
//     }
// });
// const upload = multer({ storage });

// const users = mongoose.model('users');
// app.post('/upload/:userID', upload.single('file'), (req, res) => {
//     // console.log('res:', res)
//     res.json({ file: req.file });
//     users.find({id: req.params.userID}, (err, user)=> {
//         if (err) res.send(err);
//         res.json(user);
//     })
//     // res.redirect('/');
// })

// console.log('test: ', conn.db)
// conn.db.users.updateOne({id: 'tewarit2016@gmail.com'}, { $set: {role: "admin", change: "asd", age: 2}}, function(err, res) {
//     if (err) throw err;
//   console.log("Documents updated");
// });

// conn.db.users.find({ id: 'tewarit2016@gmail.com' }, function(err, users) {
//   if (err) throw err;
//   console.log(users);
// });


// app.get('/files', (req, res) => {
//     // console.log(res)
//     try {
//         gfs.files.find().toArray((err, files) => {
//         // Check if files
//         if (!files || files.length === 0) {
//             return res.status(404).json({
//             err: 'No files exist'
//             });
//         }
    
//         // Files exist
//         return res.json(files);
//         });
//     }catch (error) {
//         res.send("not found");
//     }
// });

// app.get('/files/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//       // Check if file
//       if (!file || file.length === 0) {
//         return res.status(404).json({
//           err: 'No file exists'
//         });
//       }
//       // File exists
//       return res.json(file);
//     });
// });
  
// app.get('/image/:filename', (req, res) => {
//     gfs.files?.find({ filename: req.params.filename }).toArray((err, file) => {
//       // Check if file
//       console.log('file: ', file)
//       if (!file || file.length === 0) {
//         return res.status(404).json({
//           err: 'No file exists'
//         });
//       }
  
//       // Check if image
//       if (file[0].contentType === 'image/jpeg' || file[0].contentType === 'image/png') {
//         // Read output to browser
//         gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads'});
//         const readstream = gfs.openDownloadStreamByName(file[0].filename)
//         readstream.pipe(res);
//         gfs = Grid(conn.db, mongoose.mongo);
//         gfs.collection('uploads');
//       } else {
//         res.status(404).json({
//           err: 'Not an image'
//         });
//       }
//     });
// });
// test

routes(app);
app.listen(port);

app.use((req, res) => {
    res.status(404).send({ url: `${req.originalUrl} not found`})
})

console.log(`Server started on port ${port}`);