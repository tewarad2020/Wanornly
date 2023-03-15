const mongoose = require('mongoose');
const users = mongoose.model('users');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');

const mongoURI = 'mongodb+srv://library:ljfrDUX64vYIPn0Y@atlascluster.gplnuda.mongodb.net/wanonly'
const conn = mongoose.createConnection(mongoURI)

// let gfs
let gfs_Upload;

conn.once('open', () => {
    // Init stream
    // gfs = Grid(conn.db, mongoose.mongo);
    // gfs.collection('uploads');
    gfs_Upload = Grid(conn.db, mongoose.mongo);
    gfs_Upload.collection('uploads');
    gfs_DeleteAndShow = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads'});
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
  try {
    upload(req, res, (err) => {
      // console.log('res:', res)
      if(err) {
        return res.end(`${err}`);
      }
      res.json({ file: req.file });
    }) 
  }catch(err) {
    console.error(err)
  }
}

exports.get_profile_image = (req, res) => {
  // gfs.files.find({ filename: req.params.filename }).toArray((err, file) => {
  try {  
    gfs_Upload.files.find({ filename: req.params.filename }).toArray((err, file) => {
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
        // gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'uploads'});
        // const readstream = gfs.openDownloadStreamByName(file[0].filename)
        const readstream = gfs_DeleteAndShow.openDownloadStreamByName(file[0].filename)
        readstream.pipe(res);
        // gfs = Grid(conn.db, mongoose.mongo);
        // gfs.collection('uploads');
      } else {
        res.status(404).json({
          err: 'Not an image'
        });
      }
    });
  }catch(err) {
    console.error(err)
  }
};

// users.updateMany({}, { $set: {change_name: '', change_image: ''}}, function(err, res) {
//     if (err) throw err;
//     console.log("Documents updated");
// });

exports.update_profile = async (req, res) => {
  try {
    const user = await users.find({ id: req.params.id });
    if (user[0].change_image) {
      const filename = user[0].change_image;
      const file = await gfs_DeleteAndShow.find({ filename: filename }).toArray();
      if (file.length > 0) {
        const fileId = file[0]._id;
        await gfs_DeleteAndShow.delete(fileId);
        console.log(`Deleted file ${filename} with ID ${fileId}`);
      }
    }
    const result = await users.findOneAndUpdate(
      { id: req.params.id },
      { 
        change_image: req.body.change_image,
      },
      { 
        new: true, 
      }
    );
    console.log("RESULT: " + result);
    res.json({message: 'update profile completed'})
  } catch(err) {
    console.error(err);
  }
}

exports.delete_profile = async (req, res) => {
  try {
    const file = await gfs_DeleteAndShow.find({ filename: req.params.filename }).toArray();
    if (file.length > 0) {
      const fileId = file[0]._id;
      await gfs_DeleteAndShow.delete(fileId);
      console.log(`Deleted file ${req.params.filename} with ID ${fileId}`);
      res.json({message: 'update name completed'})
    }
  } catch(err) {
    console.error(err);
  }
}

exports.update_name = async (req, res) => {
  try {
    // console.log('id: ', req.params.userID)
    const result = await users.findOneAndUpdate(
      { id: req.params.userID },
      { 
        change_name: req.body.change_name,
      },
      { 
        new: true, 
      }
    );
    console.log("RESULT: " + result);
    res.json({message: 'update name completed'})
  } catch(err) {
    console.error(err);
  }
}