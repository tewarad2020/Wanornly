const mongoose = require('mongoose');
const donate_request = mongoose.model('donate');

exports.send_request = (req, res) => {
    const newDonate = new donate_request(req.body);
    newDonate.save((err, donate) => {
        // console.log(err);
        if (err) res.send(err);
        res.json(donate);
    });
    
}

exports.get_all_donate_req = (req, res) => {
    donate_request.find({ username: req.params.userID}, (err, donates)=> {
        if (err) res.send(err);
        res.json(donates);
    }) 
}

