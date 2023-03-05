const mongoose = require('mongoose');
const users = mongoose.model('users'); 

exports.get_user = (req, res) => {
    users.find({id:req.params.id}, (err, user)=> {
        if (err) res.send(err);
        res.json(user);
    }) 
}

exports.add_new_user = (req, res) => {
    const newUser = new users(req.body);
    newUser.save((err, user) => {
        console.log(err);
        if (err) res.send(err);
        res.json(user);
    });
}


