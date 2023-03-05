const mongoose = require('mongoose');
const users = mongoose.model('users');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb+srv://library:ljfrDUX64vYIPn0Y@atlascluster.gplnuda.mongodb.net/wanonly'
const conn = mongoose.createConnection(mongoURI)

let gfs;

conn.once('open', () => {
    // Init stream
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads');
});

const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
});
const upload = multer({ storage }).single('file')

exports.upload_profile = (req, res) => {
  upload(req, res, (err) => {
    // console.log('res:', res)
    if(err) {
      return res.end(`${err}`);
    }
    res.json({ file: req.file });
  }) 
}

exports.get_profile_image = (req, res) => {
  gfs.files.find({ filename: req.params.filename }).toArray((err, file) => {
    // Check if file
    console.log('file: ', file)
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file[0].contentType === 'image/jpeg' || file[0].contentType === 'image/png') {
      // Read output to browser
      gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads'});
      const readstream = gfs.openDownloadStreamByName(file[0].filename)
      readstream.pipe(res);
      gfs = Grid(conn.db, mongoose.mongo);
      gfs.collection('uploads');
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
};

// users.updateMany({}, { $set: {change_name: '', change_image: ''}}, function(err, res) {
//     if (err) throw err;
//     console.log("Documents updated");
// });

exports.update_profile = (req, res) => {
  users.find({id: req.params.id}, (err, user) => {
    if(err) console.log(err);
    if (user[0].change_image) {
      gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads'});
      const filename = user[0].change_image
      gfs.find({filename: filename}).toArray((req, file) => {
        if (err){
            console.log(err)
        }
        if (file.length > 0) {
          const fileId = file[0]._id
          gfs.delete(fileId, (err) => {
            if (err) console.log(err);
            console.log(`Deleted file ${filename} with ID ${fileId}`);
            gfs = Grid(conn.db, mongoose.mongo);
            gfs.collection('uploads');
          });
        }
      })
    }
  })
  users.findOneAndUpdate({id: req.params.id},
    { 
      change_image: req.body.change_image,
    },
    { 
      new: true, 
      // upsert: true, 
    },
    (err, result) => {
      if(err){
          console.log(err);
      }
      console.log("RESULT: " + result);
      res.json({message: 'update profile completed'})
    }
  )
}
