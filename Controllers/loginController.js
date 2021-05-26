require('dotenv').config()

const express = require('express');
const Admins = require('../Models/Admin')

const route = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');


//afficher liste des admins
const index = (req,res,next)  => {
	Admin.find()
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Admins"
		})
	})
}


//Vérification des données saisies
const login =  (req,res,next)  =>{
    var email=req.body.email
    var pwd=req.body.pwd
    Admins.findOne({$or: [{email:email},{username:email},{telephone:email}]})
    .then(admin=>{
        if (admin) {
            bcrypt.compare(pwd,admin.password,function(error,result){
                if (error){
                    res.json({
                        msg: 'erreur in compare'
                    })
                }

                if (result){
                    const hash = { name: admin._id }//jwt
                    const accessToken = generateAccessToken(hash)//jwt

                    res.status(200).send(JSON.stringify( //200=>succes
                        {
                            _id : admin._id,
                            username : admin.username,
                            password : admin.password,
                            nom : admin.nom,
                            prenom : admin.prenom,
                            adresse : admin.adresse,
                            email : admin.email,
                            telephone : admin.telephone,
                            CIN : admin.cin,
                            avatar : admin.avatar,
                            role : admin.role,
                            accessToken : accessToken
                        })
                    )
                }else {
                    res.status(201).send(JSON.stringify( //wrong password
                        {
                            _id : "",
                            username : "",
                            password : "",
                            nom : "",
                            prenom : "",
                            adresse : "",
                            email : "",
                            telephone :"",
                            CIN : "",
                            avatar : "",
                            role : "",
                            accessToken : ""
                        })
                    )
                }
                
            })
        } else {
            res.status(202).send(JSON.stringify( //user not found
                {
                    _id : "",
                    username : "",
                    password : "",
                    nom : "",
                    prenom : "",
                    adresse : "",
                    email : "",
                    telephone :"",
                    CIN : "",
                    avatar : "",
                    role : "",
                    accessToken : ""
                })
            )
        }

    })
}
//acces tocken
function generateAccessToken(hash) {
    return jwt.sign(hash, process.env.ACCESS_TOKEN_SECRET)
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401).send(JSON.stringify({msg:"no token in headers"}))
  
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).send(JSON.stringify({msg:"erreur in token"}))
      req.user = user
      next()
    })
}



route.get('/', /*authenticateToken ,*/index)
route.post('/login',login)

module.exports = route;