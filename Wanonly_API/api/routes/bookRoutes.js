const bookBuilder = require('../controllers/bookController');
const cartBuilder = require('../controllers/cartController');
const usersBuilder = require('../controllers/usersController');
const profileUpload = require('../controllers/uploadController');
const historyBuilder = require('../controllers/historyController')
const donateBuilder = require('../controllers/donateController')

module.exports = app => {
    app
        .route('/books')
        .get(bookBuilder.list_all_books)
        .post(bookBuilder.create_a_book);

    app
        .route('/books/:bookISBN')
        .get(bookBuilder.read_a_book)
        .put(bookBuilder.update_a_book)
        .delete(bookBuilder.delete_a_book);

    app
        .route('/carts/:userID-:ISBN')
        .delete(cartBuilder.delete_from_cart)
        .put(cartBuilder.update_a_request)
    
    app
        .route('/carts/:userID')
        .get(cartBuilder.list_all_books_in_cart)

    app
        .route('/carts')
        .put(cartBuilder.add_to_cart)
        .get(cartBuilder.all_cart_every_user)

    app
    .route('/history/:ID')
    .delete(historyBuilder.delete_from_history)

    app
    .route('/history/:userID')
    .get(historyBuilder.list_all_books_in_history)

    app
    .route('/history')
    .put(historyBuilder.add_to_history)
    .get(historyBuilder.all_history_every_user)

    app
        .route('/user/:id')
        .get(usersBuilder.get_user)
        .put(profileUpload.update_profile)

    app
        .route('/user')
        .put(usersBuilder.add_new_user)
    
    app 
        .route('/upload/:userID')
        .post(profileUpload.upload_profile)
        .put(profileUpload.update_name)

    app
        .route('/upload/:filename')    
        .delete(profileUpload.delete_profile)
    
    app 
        .route('/image/:filename')
        .get(profileUpload.get_profile_image)

    app
        .route('/donate/:userID')
        .post(donateBuilder.send_request)
        .get(donateBuilder.get_user_donate_req)
    
    app
        .route('/donateAll')
        .get(donateBuilder.get_all_donate_req)

    app
        .route('/donate/:filename')
        .put(donateBuilder.update_a_request)
        .delete(donateBuilder.delete_donate)
}