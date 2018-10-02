var express = require('express');
var router = express.Router();
let users = require('../models/user')

let Post = require('../models/Posts')

router.get('/', isLoggedIn ,(request, response) =>{
		users.GetUsers(function(userinfo){
			response.render('pages/chatPage',{user : request.user, userinfo:userinfo })
		})

})

router.get('/:id', isLoggedIn ,(request, response) =>{
		users.getUserInfo(request.params.id , function(userinfo){
			response.render('pages/chat',{user : request.user, userinfo:userinfo })
		})

})

router.get('/c/:id',(request, response) =>{
	Post.GetAllPosts(request.user.id,request.params.id,function(Posts){
		response.send({Posts:Posts})
	})
})


router.post('/:id', (request, response) => {
	Post.SavePost(request.user.id,request.params.id,request.body.msg,function(){
		//response.redirect('/chat/'+request.params.id)
	})
})

router.put('/',(request,response) => {

})



router.delete('/',(request,response) => {

})


function isLoggedIn(req, res, next) {

	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}


module.exports = router