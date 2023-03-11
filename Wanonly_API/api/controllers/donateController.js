const mongoose = require('mongoose');
const donate_request = mongoose.model('donate');

exports.send_request = (req, res) => {
    const newDonate = new donate_request(req.body);
    newDonate.save((err, cart) => {
        // console.log(err);
        if (err) res.send(err);
        res.json(cart);
    });
    
}

