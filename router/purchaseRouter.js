//201931541 임명우
const express = require('express');
var router = express.Router()

var purchase = require('../lib/purchase');

//-------------------------Purchase-------------------------------------
router.get('/view', (req, res) => {
    purchase.view(req, res);
});

router.get('/allview', (req, res) => {
    purchase.allview(req, res);
});

router.post('/detail/:merid', (req, res) => {
    purchase.detail(req, res);
});

router.post('/create_process', (req, res) => {
    purchase.create_process(req, res);
});

router.get('/create', (req, res) => {
    purchase.create(req, res);
});

router.post('/update_process/:id', (req, res) => {
    purchase.update_process(req, res);
});

router.get('/cancel/:id', (req, res) => {
    purchase.cancel(req, res);
});

router.get('/update/:id', (req, res) => {
    purchase.update(req, res);
});

router.get('/delete_process/:id', (req, res) => {
    purchase.delete_process(req, res);
});

//-----------------------Cart------------------------------
router.get('/cart', (req, res) => {
    purchase.cart_view(req, res);
});

router.get('/allcart', (req, res) => {
    purchase.cart_all_view(req, res);
});

router.get('/cart/create', (req, res) => {
    purchase.cart_create(req, res);
});

router.post('/cart/create_process', (req, res) => {
    purchase.cart_create_process(req, res);
});

router.get('/cart/update/:id', (req, res) => {
    purchase.cart_update(req, res);
});

router.post('/cart/update_process/:id', (req, res) => {
    purchase.cart_update_process(req, res);
});

router.get('/cart/delete_process/:id', (req, res) => {
    purchase.cart_delete_process(req, res);
});




module.exports = router;
