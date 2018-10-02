let LocalStrategy   = require('passport-local').Strategy;
let connection = require('./db')
let user = require('../models/user')
var bcrypt = require('bcryptjs');

module.exports = function(passport) {



    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        connection.query("SELECT * FROM users WHERE id = ? ",[id], function(err, rows){
            done(err, rows[0]);
        });
    });

 	 passport.use(
        'local-login',
        new LocalStrategy({
            
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true 
        },
        function(req, email, password, done) { 
            connection.query("SELECT * FROM users WHERE email = ?",[email], function(err, rows){
 				console.log('request done')
                if (!err){
         				console.log('No sql erreur ')
         			if (rows.length) {
         				console.log('Select return data ')
	                    bcrypt.compare(password, rows[0].password,function(err,res){
	                    	console.log("after compare pass")
	                    	console.log(password)
	                    	console.log(rows[0])
	                    	if(res == true){
                    			console.log('you are logged')
                                
                				return done(null, rows[0]);
	                    	}else{
	                    		return done(null,false)
	                    	}
	                    })

               	 		}else{
               	 			return done(null,false)
               	 		}
               		}else{	
               			return done(null,false);
            	}
            })
        })
    );
}