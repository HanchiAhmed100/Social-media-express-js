let connection = require('../Config/db')
class Relation{

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

	get dateof(){
		return moment(this.row.dateof);
	}
	static SetFriendsReq(sender,resiver,callback){
		connection.query('INSERT into FriendsReq set sender = ? , resiver = ? ',[sender,resiver],function(err,rows){
			if (err) throw err
			callback(rows)
		})
	}
	static getReqStatus(sender,resiver,callback){
		connection.query('Select from FriendsReq status WHERE (sender = ? AND resiver = ?) OR (sender = ? AND resiver = ?)',[sender,resiver,resiver,sender],function(err,rows){
			if (err) throw err
			callback(rows)
		})
	}
	static RemoveFriendsReq(sender,resiver,callback){
		connection.query('DELETE FROM FriendsReq WHERE (sender = ? AND resiver = ?) OR (sender = ? AND resiver = ?)',[sender,resiver,resiver,sender],function(err,rows){
			if (err) throw err
		})
	}
	static AcceptFriendsReq(sender,resiver,callback){
		connection.query('Update FriendsReq set status = 1 WHERE (sender = ? AND resiver = ?) OR (sender = ? AND resiver = ?)',[sender,resiver,resiver,sender],function(err,rows){
			if (err) throw err
			callback(rows)
		})
	}

}

module.exports = Relation