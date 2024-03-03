//201931541 임명우
const express = require('express');
var router = express.Router()

var person = require('../lib/person');

router.get('/view/:vu',(req, res)=>{
    person.view(req, res);
}); 

router.get('/create',(req, res)=>{
    person.create(req, res);
}); 

router.get('/signup',(req, res)=>{
    person.signup(req, res);
});

router.post('/create_process',(req, res)=>{
    person.create_process(req, res);
}); 

router.get('/update/:id',(req, res)=>{
    person.update(req, res);
}); 

router.post('/update_process',(req, res)=>{
    person.update_process(req, res);
}); 

router.get('/delete/:id',(req, res)=>{
    person.delete_process(req, res);
}); 

module.exports = router;
