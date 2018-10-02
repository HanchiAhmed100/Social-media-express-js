var express = require('express');
var router = express.Router();
var passport = require('passport');
let user = require('../models/user')
let session = require('express-session')
var cookieParser = require('cookie-parser');
let fileUpload = require('express-fileupload');

let Message = require('../models/message')
let Relation = require('../models/Relation')

router.get('/Register',(request,response) =>{
	response.render('pages/Register')
})

router.post('/Register',(request,response) =>{
	const name = request.body.name;
	const mail = request.body.mail;
	const username = request.body.username;
	const password = request.body.password;
	console.log(name,mail,password,username);

	user.Register(name,mail,username,password, function(callback){
		console.log("user added");
		response.redirect('/Login')			
	})	
})

router.get('/Login',(request,response) =>{
	response.render('pages/Login')
})

router.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', 
            failureRedirect : '/login',
        }),function(req, res,next) {
			res.locals.user = req.user || null;
            next()
})

router.get('/profile', isLoggedIn, function(req, res) {

		res.cookie('id',req.user.id,{expire : new Date() + 9999})
		res.cookie('name',req.user.name,{expire : new Date() + 9999})
		res.cookie('username',req.user.username,{expire : new Date() + 9999})
		res.cookie('email',req.user.email,{expire : new Date() + 9999})

		Message.GetAllByUser( req.user.id,function (message) {
			res.render('pages/profile',{message:message,user : req.user})
		})
});

router.get('/ViewProfile/:id',isLoggedIn,(request, response) =>{
	Message.GetUserWall(request.params.id, function(message) {
		Relation.getReqStatus(request.params.id,request.user.id,function(status){
			response.render('pages/ViewProfile',{message:message,user:request.user,status:status})	
		})
	})
})

router.post('/FriendsReq',isLoggedIn,(request,response)=>{
 	Relation.SetFriendsReq(request.user.id,request.body.RelationId,function(message){
		response.redirect('/ViewProfile/'+request.body.RelationId)
 	})
})


router.post('/uploadProfilePicture', function(req, res) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
 let sampleFile = req.files.sampleFile;

let NewName = req.user.id+Math.random()+req.user.username+".jpg"
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('Public/ProfilesPictures/'+NewName, function(err) {
    if (err)
      return res.status(500).send(err);
 
 	let id = req.user.id;

   	Message.upladProfilePic(id,NewName,function(){

		console.log(req.user.id," id ");
		console.log(NewName," new name");
		console.log("image updated");

			res.redirect('/profile')
	})
  });
});


router.get('/lists', function(req, res) {
  console.log("Cookies :  ", req.cookies);
});


router.get('/logout',(req,res)=>{
	res.clearCookie('id')
    res.clearCookie('name');
    res.clearCookie('username');
    res.clearCookie('email');
	req.logout();
	res.redirect('/Login');
})


function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}


module.exports = router