require('dotenv').config()

const express = require('express');

const route = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Admin = require('../Models/Admin');
//node mailer
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'help.majales@gmail.com',
    pass: 'majalesPFE'
  }
});

//liste admin
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

//add Admin
const addAdmin = (req,res,next) => {

    bcrypt.hash(req.body.password,10,function(err,hashedPass) {

        let admin = new Admin({
            username: req.body.username,
            password: hashedPass,
            nom: req.body.nom,
            prenom: req.body.prenom,
            adresse: req.body.adresse,
            email: req.body.email,
            telephone: req.body.telephone,
            CIN: req.body.CIN,
            avatar: req.body.avatar,
            role: req.body.role
        })
        admin.save()
        .then(response => {
    
            var mailContent = `Félicitations `+req.body.prenom +" "+req.body.nom+` Vous etes maintenant administrateur dans notre plateforme majales,
            voici vos informations personelles: 
            adresse mail:`+req.body.email+`
            mot de passe:`+req.body.password
            
            var mailOptions = {
                from: 'help.majales@gmail.com',
                to: req.body.email,
                subject: 'Bienvenue a notre plateforme Majales!',
                text: mailContent
            };
        
            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  res.json({message: "error sending mail"})
                  console.log(error);
                } else {
                    res.json({
                        message:"admin Added Successfully"
                    })
                }
            });
        })
        .catch(error  => {
            res.json({
                message: "an error occured when adding admin"
            })
        })

    })


}
//supprimer admin
const destroy = async (req,res,next) => {
	let adminId = req.body.adminId
    Admin.findByIdAndRemove(adminId)
    .then(() => {
        res.json({
            message:"Admin deleted successfully"
        })
    })
    .catch(error =>{
        res.json({
            message:"an error occured when admin reunion"
        })
    });
}




route.get('/', index)
route.post('/add',addAdmin);
route.post('/destroy',destroy);

module.exports = route;