//201931541 임명우
const express = require('express');
var router = express.Router()

var shop = require('../lib/shop');

router.get('/', (req, res) => {
    shop.home(req, res);
});

router.get('/shop/all', (req, res) => {
    shop.allview(req, res);
});

router.get('/shop/:subid', (req, res) => {
    shop.view(req, res);
});

router.post('/shop/search', (req, res) => {
    shop.search(req, res);
});

router.get('/shop/detail/:merid', (req,res) => {
    shop.detail(req,res);
})

router.get('/shop/anal/customer', (req,res) => {
    shop.customeranal(req,res);
})

router.get('/shop/anal/merchandise', (req,res) => {
    shop.merchananal(req,res);
})

router.get('/shop/anal/board', (req,res) => {
    shop.boardanal(req,res);
})

module.exports = router;
