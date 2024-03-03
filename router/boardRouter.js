//201931541 임명우
const express = require('express');
var router = express.Router()

var board = require('../lib/board');

//board
router.get('/view/:id/:num', (req, res) => {
    board.view(req, res);
});

router.get('/create/:id', (req, res) => {
    board.create(req, res);
});

router.post('/create_process', (req, res) => {
    board.create_process(req, res);
});

router.post('/update_process', (req, res) => {
    board.update_process(req, res);
});

router.get('/detail/:id/:id2', (req, res) => {
    board.update(req, res);
});

router.get('/delete/:id/:id2', (req, res) => {
    board.delete_process(req, res);
});


//boardtype
router.get('/type/view', (req, res) => {
    board.tview(req, res);
});

router.get('/type/create', (req, res) => {
    board.tcreate(req, res);
});

router.post('/type/create_process', (req, res) => {
    board.tcreate_process(req, res);
});

router.post('/type/update_process', (req, res) => {
    board.tupdate_process(req, res);
});

router.get('/type/update/:id', (req, res) => {
    board.tupdate(req, res);
});

router.get('/type/delete/:id', (req, res) => {
    board.tdelete_process(req, res);
});

module.exports = router;
