const mongoose = require('mongoose');
const history = mongoose.model('history');


exports.list_all_books_in_history = (req, res) => {
    history.find({ user_id: req.params.userID}, (err, historys)=> {
        if (err) res.send(err);
        res.json(historys);
    }) 
}

exports.all_history_every_user = (req, res) => {
    history.find({}, (err, historys)=> {
        if (err) res.send(err);
        res.json(historys);
    }) 
}

exports.add_to_history = (req, res) => {
   // console.log(req.body)
    const newhistory = new history(req.body);
    newhistory.save((err, history) => {
        // console.log(err);
        if (err) res.send(err);
        res.json(history);
    });
    
}


exports.delete_from_history = (req, res) => {
    // console.log(req.params)
    history.remove( { _id:req.params.ID } , err => {
        if (err) res.send(err);
        res.json({
            message: 'history successfully deleted', 
            _id: req.params.bookID
        })
    })
    
}



