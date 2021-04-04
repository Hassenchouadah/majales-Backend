require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const Admins = require('../Models/Admin')

const route = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const Admin = require('../Models/Admin');

const register = (req,res,next)  => {
	bcrypt.hash(req.body.password,10,function(err,hashedPass) {
        if (err) {
			console.log('erreur password hash');
			res.json({
				msg: 'erreur password hash'
			})
		}
        var verifemail= req.body.email
        var verifusername=req.body.username
        var verifcin=req.body.cin

        Admins.findOne({$or: [{email:verifemail}]})
        .then(adminemail =>{
            if (adminemail){//if email exist
                res.sendStatus(201)
            }
            else{
                Admins.findOne({$or: [{username:verifusername}]})
                .then(adminusername =>{
                    if (adminusername){//if username exist
                        res.sendStatus(202)
                    }else{
                        Admins.findOne({$or: [{cin:verifcin}]})
                        .then(admincin =>{
                            if (admincin){//if cin exist
                                res.sendStatus(203)
                            }else{//add admin
                                let admin = new Admins({
                                    username : req.body.username,
                                    password : hashedPass,
                                    nom : req.body.nom,
                                    prenom : req.body.prenom,
                                    adresse : req.body.adresse,
                                    email : req.body.email,
                                    telephone : req.body.telephone,
                                    CIN : req.body.cin,
                                    avatar : req.body.avatar,
                                    role : req.body.role
                                })
                                admin.save()
                                .then(data => {
                                    res.status(200).send(JSON.stringify({
                                        msg:'admin added successfully'
                                    }))
                                })
                                .catch(error=>{
                                    res.json({
                                        msg:'an error occured when adding admin'
                                    })
                                })
                            }
                        })
                    }
                })
            }
        })
    })
}

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
                    const hash = { name: admin._id }
                    const accessToken = generateAccessToken(hash)

                    res.status(200).send(JSON.stringify(
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
                    res.sendStatus(201)  
                }
                
            })
        } else {
            res.sendStatus(202)
        }

    })
}

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


route.post('/register',register)
route.get('/', authenticateToken ,index)
route.post('/login',login)

module.exports = route;