const express = require('express');
const mongoose = require('mongoose');
const Ministere = require('../Models/ministere')

const route = express.Router();

//show Ministeres list
const index = (req,res,next)  => {
	Ministere.find()
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Ministeres"
		})
	})
}

//add Ministere
const addMinistere = (req,res,next) => {
	let ministere = new Ministere({
		Nom: req.body.nom
	})
	ministere.save()
	.then(response => {
		res.json({
			message:"ministere Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding ministere"
		})
	})
}



route.get('/',index)
route.post('/add',addMinistere)

module.exports = route;