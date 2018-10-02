let express = require('express')
let app =  express()
let session = require('express-session')
let passport = require('passport')
let cookieParser = require('cookie-parser');
let fileUpload = require('express-fileupload');
let server = require('http').createServer(app);
let io = require('socket.io').listen(server);
let users = require('./models/user');
let Post = require('./models/Posts');
userstab = [];
connectedUsers = [];

 
io.sockets.on('connection',function(socket){
	
	connectedUsers.push(socket);
	console.log('connected  : ', connectedUsers.length)


	
	socket.on('disconnect',function(data){

		userstab.splice(userstab.indexOf(socket.username),1);
		updateUsernames();
		users.SetDisconnected(socket.userid);
		connectedUsers.splice(connectedUsers.indexOf(socket),1);
		console.log('disconnect  : ', connectedUsers.length)
	});

	socket.on('send message',function(data,sender ,reciver){

		Post.SavePost(sender,reciver,data);
		
		io.sockets.emit('new message',{msg : data ,  myuser : socket.username});

	})
	socket.on('new user', function(data,id){

		socket.username = data;
		socket.userid = id;
		userstab.push(data);
		users.SetConnected(id);
		console.log('tab : ' ,userstab);
		updateUsernames();

	})
	function updateUsernames(){
		io.sockets.emit('get users', userstab);
	}
	
	socket.on('writing',function(){
		io.sockets.emit('isWriting', { myuser : socket.username});
	})

	socket.on('not',function(){
		io.sockets.emit('isNot');
	})

})


// default options
app.use(fileUpload());
app.use(cookieParser())

//passport config
require('./config/passport')(passport)



app.set('view engine','ejs')
app.use('/assets',express.static('Public'))


let bodyParser = require('body-parser')
// Middleware
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())


app.use(session({
	secret: 'hanchi',
	resave: true,
	saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


// Route

let MessagesRouter =  require('./Routes/MessagesRouter')
let LoginRouter =  require('./Routes/LoginRouter')
let PostsRouter =  require('./Routes/PostsRouter')

app.use('/Acceuil',MessagesRouter)
app.use('/',LoginRouter)
app.use('/chat',PostsRouter)





app.get('/',(request, response) =>{
		response.render('pages/index')
})


app.get('*',(req,res,next)=>{
	res.locals.user = req.user || null;
	next()
})



server.listen(3010)