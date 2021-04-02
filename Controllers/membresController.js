const express = require('express');
const mongoose = require('mongoose');
const Membres = require('../Models/Membres')

const route = express.Router();


//show Membres list
const index = (req,res,next)  => {
	Membres.find().populate('municipalite')
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Membres"
		})
	})
}

//add Post
const addMembre = (req,res,next) => {
	let membre = new Membres({
		nom: req.body.nom,
		prenom: req.body.prenom,
		nom_pere: req.body.nom_pere,
		sexe: req.body.sexe,
		etat_civil: req.body.etat_civil,
		problemes_physique: req.body.problemes_physique,
		CIN: req.body.CIN,
		adresse: req.body.adresse,
		portable: req.body.portable,
		fix: req.body.fix,
		niveau_academique: req.body.niveau_academique,
		specialite: req.body.specialite,
		diplome: req.body.diplome,
		annee_obtention: req.body.annee_obtention,
		municipalite:req.body.municipalite
	})
	membre.save()
	.then(response => {
		res.json({
			message:"membre Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding membre"
		})
	})
}

//getById membre
const getById = (req,res,next)  => {
	let membreId = req.body.membreId
	Membres.findById(membreId)
	.then(membre  => {
		res.json(membre)
	})
	.catch(error  => {
		res.json({
			message: "an error occured when displaying membre"
		})
	})
}

//update membre
const update = (req,res,next) => {
	let membreId = req.body.membreId
	let updatedMembre = {
		nom: req.body.nom,
		prenom: req.body.prenom,
		nom_pere: req.body.nom_pere,
		sexe: req.body.sexe,
		etat_civil: req.body.etat_civil,
		problemes_physique: req.body.problemes_physique,
		CIN: req.body.CIN,
		adresse: req.body.adresse,
		portable: req.body.portable,
		fix: req.body.fix,
		niveau_academique: req.body.niveau_academique,
		specialite: req.body.specialite,
		diplome: req.body.diplome,
		annee_obtention: req.body.annee_obtention,
		municipalite:req.body.municipalite
	}
	Membres.findByIdAndUpdate(membreId,{$set: updatedMembre})
	.then(() => {
		res.json({
			message: "membre updated successfully"
		})
	})
	.catch(error => {
		res.json({
			message: "an error occured when updating membre"
		})
	})
}

//delete membre
const destroy = (req,res,next) => {
	let membreId = req.body.membreId
	Membres.findByIdAndRemove(membreId)
	.then(() => {
		res.json({
			message:"membre deleted successfully"
		})
	})
	.catch(error =>{
		res.json({
			message:"an error occured when deleting membre"
		})
	})
}


route.get('/',index)
route.post('/add',addMembre)
route.post('/getById',getById)
route.post('/update',update)
route.post('/destroy',destroy)


module.exports = route;