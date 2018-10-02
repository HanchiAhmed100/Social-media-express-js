let connection = require('../Config/db')
let bcyrpt = require('bcryptjs')

class user{

	constructor(row){
		this.row = row
	}
	get id(){
		return this.row.id;
	}
	get name(){
		return this.row.name;
	}
	get mail(){
		return this.row.email;
	}
	get password(){
		return this.row.password;
	}
	get pic(){
		return this.row.picture;
	}

	static Register(name,mail,username,password,callback){

		bcyrpt.genSalt(10, function(err ,salt){
			bcyrpt.hash(password,salt, (err, hash) =>{
				if (err) throw err
				const NewPass = hash
				connection.query('INSERT INTO users set name = ?, email = ?, username = ?, password = ?',[name,mail,username,NewPass] , (err, rows) =>{
					if (err) throw err
					callback(rows)
				})
			})
		});
	}
	static Login(email,password,callback){
		connection.query('SELECT * FROM users WHERE  email = ? ', [email] ,(err,rows) =>{
			if (err) throw err
			if (!rows.length) {
            	return false ;
            } else{
				bcyrpt.compare(password,rows[0].password, (err, isMatch)=>{
					if (err) throw err

					if(isMatch){
						callback(rows.map((row)=> new Users(row)))
						console.log('logged in')
					}else{
						return false
					}
				})
			}
		})
	}

	static getUserInfo(id ,callback){
		connection.query('SELECT * FROM users WHERE id = ?',[id], (err,rows) =>{
			if (err) throw err
			callback(rows);
		})
	}
	static GetUsers(callback){
		connection.query('SELECT * FROM users order by status desc',(err,rows)=>{
			if (err) throw err
			callback(rows);
		})
	}

	static SetConnected(id){
		connection.query('update users set status = 1  WHERE id = ? ',[id],(err,rows)=>{
			if (err) throw err
		})
	}
	static SetDisconnected(id){
		connection.query('update users set status = 0 WHERE id = ? ',[id],(err,rows)=>{
			if (err) throw err
		})
	}
}
module.exports =  user