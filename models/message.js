let connection = require('../Config/db')
let moment = require('moment')

class Message{

	constructor(row) {
		this.row = row
	}
	get id(){
		return this.row.id
	}
	get title(){
		return this.row.title;
	}
	get body(){
		return this.row.body;
	}
	get UserId(){
		return this.row.UserId;
	}
	get username(){
		return this.row.username;
	}
	get name(){
		return this.row.name;
	}
	get email(){
		return this.row.email;
	}
	get dateof(){
		return moment(this.row.dateof);
	}
	get picture(){
		return this.row.picture
	}


	static InsertArticle (Uid,title,body,callback){
		connection.query('INSERT INTO article set UserId = ?, title = ?, body = ? , dateof = ?',[Uid,title,body, new Date()], (err, result) =>{
			if(err) throw err
			callback(result)
		})
	}

	static GetAllByUser (Uid,callback){
		connection.query('select * from article  where UserId = ? order By dateof desc ',[Uid] ,(err, rows) => {
			if(err) throw err

			callback(rows.map((row)=> new Message(row)))
		})
	}
	static GetAll (callback){
		connection.query('select users.picture,users.name,users.email, article.id,article.UserId,article.title,article.body,article.dateof from article join users on article.UserId = users.id order By article.dateof desc', (err, rows) => {
			if(err) throw err
			callback(rows.map((row)=> new Message(row)))
		})
	}
	static FindMessage(id,callback){
		connection.query('select users.picture,users.name,users.email,article.id,article.UserId,article.title,article.body,article.dateof from article join users on article.UserId = users.id where article.id = ? ',[id],(err,rows)=>{
			if(err) throw err
			callback(rows)
		})
	}
	static DeleteMessage(id,callback){
		connection.query('DELETE FROM article where id = ? ',[id],(err,row)=>{
			if(err) throw err
			callback(row)
		})
	}
	static UpdateArticle(title,body,id,callback){
		connection.query('Update article set title = ? , body = ? where id = ?',[title,body,id],(err,row)=>{
			if(err) throw err
			callback(row)
		})
	}
	static GetUserWall(id,callback){
		connection.query('SELECT users.picture,users.name,users.email,users.username, article.id,article.UserId,article.title,article.body,article.dateof from article join users on article.UserId = users.id where users.id = ? order By article.dateof desc', [id], (err, rows) => {
			if(err) throw err
			callback(rows.map((row)=> new Message(row)))
		})
	}

	static upladProfilePic(id,Picture,callback){
		connection.query('Update users set picture = ? where id = ?',[Picture,id],(err,rows)=>{
			if (err) throw err
			console.log("in the query ",id)
			callback(rows)
		})
	}


}
module.exports = Message