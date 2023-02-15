const mongoose = require('mongoose');
const cart = mongoose.model('cart');


exports.list_all_books_in_cart = (req, res) => {
    cart.find({ user_id: req.params.userID}, (err, carts)=> {
        if (err) res.send(err);
        res.json(carts);
    }) 
}

exports.add_to_cart = (req, res) => {
    const newCart = new cart(req.body);
    newCart.save((err, cart) => {
        // console.log(err);
        if (err) res.send(err);
        res.json(cart);
    });
    
}

// exports.delete_from_cart = (req, res) => {
//     cart.remove( { user_id: req.params.userID, ISBN: req.body.ISBN } , err => {
//         if (err) res.send(err);
//         res.json({
//             message: 'cart successfully deleted', 
//             _id: req.params.bookID
//         })
//     })
exports.delete_from_cart = (req, res) => {
    console.log(req.params)
    cart.remove( { user_id: req.params.userID, ISBN: req.params.ISBN } , err => {
        if (err) res.send(err);
        res.json({
            message: 'cart successfully deleted', 
            _id: req.params.bookID
        })
    })
    
}



