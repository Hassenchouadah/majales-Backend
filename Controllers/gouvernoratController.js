const express = require('express');
const mongoose = require('mongoose');
const Gouvernorat = require('../Models/gouvernorat')

const route = express.Router();

//show Gouvernorats list
const index = (req,res,next)  => {
	Gouvernorat.find().populate('ministere')
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying gouvernorats"
		})
	})
}

//add Municipalite
const addGouvernorat = (req,res,next) => {
	let gouvernorat = new Gouvernorat({
		Nom: req.body.nom,
        ministere:req.body.ministere
	})
	gouvernorat.save()
	.then(response => {
		res.json({
			message:"gouvernorat Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding gouvernorat"
		})
	})
}



route.get('/',index)
route.post('/add',addGouvernorat)

module.exports = route;