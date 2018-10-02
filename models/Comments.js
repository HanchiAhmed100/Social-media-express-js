let connection = require('../Config/db')
let moment = require('moment')

class Comments{

	constructor(row) {
		this.row = row
	}
	get id(){
		return this.row.id
	}
	get comment(){
		return this.row.comment;
	}
	get ArticleId(){
		return this.row.ArticleId;
	}
	get dateof(){
		return moment(this.row.dateof);
	}
	
	get name(){
		return this.row.name;
	}
	get email(){
		return this.row.email;
	}
	get UserId(){
		return this.row.UserId;
	}
	get picture(){
		return this.row.picture
	}
	static FindComments(id,callback){
		connection.query('SELECT users.picture ,users.name, users.email ,comment.id, comment.comment, comment.ArticleId,comment.UserId,comment.dateof FROM comment JOIN users on comment.UserId = users.id WHERE comment.ArticleId = ? ORDER By dateof desc' ,[id] ,(err,rows) =>{
			if(err) throw err
			callback(rows.map((row)=> new Comments(row)))
		})
	}

	static commentMessage(comment,id,uid,callback){
		connection.query('INSERT INTO comment set comment = ? , ArticleId =  ? , dateof = ? , UserId = ?',[comment,id, new Date(),uid], (err, rows) =>{
			if(err) throw err
			callback(rows)
		})
	}
	static like(Uid,Pid,callback){
		connection.query('INSERT INTO Likes set UID = ? , PID = ?',[Uid,Pid],(err,row) => {
			if(err) throw err
			callback(row)
		})
	}

	static dislike(Uid,Pid,callback){
		connection.query('delete from Likes where UID = ? and PID = ?',[Uid,Pid],(err,row) => {
			if(err) throw err
			callback(row)
		})
	}
	static GetLikes(Pid,callback){
		connection.query('SELECT users.id,users.name,users.picture FROM likes JOIN users on Likes.UID = users.id JOIN article on Likes.PID = article.id WHERE article.id = ?',[Pid],(err,rows)=>{
			if (err) throw err
			console.log('likes : ', rows)
			callback(rows)
		})
	}
	static likesCount(id,callback){
		connection.query('SELECT count(*) as nbr FROM likes where PID = ? ', [id], (err, rows) =>{
			if(err) throw err
			callback(rows)
		})
	}


}
module.exports = Comments