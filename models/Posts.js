let connection = require('../Config/db')
let moment = require('moment')

class Posts{

	constructor(row) {
		this.row = row
	}
	get id(){
		return this.row.id
	}
	get sender(){
		return this.row.sender;
	}
	get resiver(){
		return this.row.resiver;
	}
	get msg(){
		return this.row.msg;
	}
	get dateof(){
		return moment(this.row.dateof);
	}
	static GetAllPosts(userId,resiver,callback){
		connection.query('SELECT * FROM chat WHERE (sender = ? AND resiver = ?) OR (sender = ? AND resiver = ?)',[userId,resiver,resiver,userId],function(err,rows){
			if (err) throw err
			callback(rows)
		})
	}
	static SavePost(userId,resiver,msg){
		connection.query('INSERT INTO chat set sender = ? , resiver = ?, msg = ?',[userId,resiver,msg],function(err,rows){
			if (err) throw err
		})
	}
}

module.exports = Posts