var express = require('express');
var router = express.Router();

let Message = require('../models/message')
let Comments = require('../models/Comments')


router.get('/',isLoggedIn,(request, response) =>{
	Message.GetAll( function (message) {
		response.render('pages/Message',{message:message,user : request.user})
	})
})

router.post('/',isLoggedIn,(request, response) => {
	Message.InsertArticle(request.user.id,request.body.title,request.body.body,function(){
		console.log("insert complete");
		response.redirect('/Acceuil/')
	})
})

router.get('/:id',isLoggedIn,(request,response) => {
	Message.FindMessage(request.params.id, function(message) {
		Comments.FindComments(request.params.id, function(comment) {
			Comments.GetLikes(request.params.id,function(like){
				Comments.likesCount(request.params.id,function(nbr){
					response.render('pages/show',{message:message,comment:comment,user : request.user,like:like,nbr:nbr})
				})
			})
		})
	})
})
router.get('/Edit/:id',isLoggedIn,(request,response) => {
	Message.FindMessage(request.params.id, function(message) {
		response.render('pages/Edit',{message:message,user : request.user})
	})
})

router.post('/update/:id',isLoggedIn, (request, response) => {
	Message.UpdateArticle(request.body.title,request.body.body,request.params.id,function(){
		console.log("update complete");
		response.redirect('/Acceuil/')
	})
})

router.get('/Delete/:id',isLoggedIn,(request,response) => {
	Message.DeleteMessage(request.params.id, function(message) {
		console.log("Delete complete");
		response.redirect('/Acceuil/')

	})
})

router.post('/comment/:id',isLoggedIn,(request,response) => {
	Comments.commentMessage(request.body.comment,request.params.id,request.user.id,function(message) {
		console.log("comment complete");
		response.redirect('/Acceuil/'+request.params.id)
	})
})
router.get('/Like/:id',isLoggedIn,(request,response) => {
	Comments.like(request.user.id,request.params.id,function(message){
		console.log("like")
		response.redirect('/Acceuil/'+request.params.id)
	})
})
router.get('/disLike/:id',isLoggedIn,(request,response)=>{
	Comments.dislike(request.user.id,request.params.id,function(message){
		console.log("dislike")
		response.redirect('/Acceuil/'+request.params.id)
	})
})

function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}



module.exports = router