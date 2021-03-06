const express = require('express');
const mongoose = require('mongoose');
const Membres = require('../Models/Membres')

const route = express.Router();


//show Membres list
const index = (req,res,next)  => {
	Membres.find()
	.populate([
        {
          path: 'municipalite',
		  populate: {
		    path: 'gouvernorat',
			populate: {
				path: 'ministere'
			  }
		  }
        },
      ])
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Membres"
		})
	})
}

//add Membre
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
		municipalite:req.body.municipalite,

		secteur : req.body.secteur,
		grade : req.body.grade,
		poste : req.body.poste,
		num_cnss : req.body.num_cnss,
		is_active : req.body.is_active,
		appartenance : req.body.appartenance,
		nom_partie : req.body.nom_partie,
		description_conseil : req.body.description_conseil
	})

	membre.save()
	.then(response => {
		res.json({
			message:"membre Added Successfully"
		})
	})
	.catch(error  => {
		console.log(error)
		res.json({
			message: "an error occured when adding membre"
		})
	})
}

//getById membre(modifer membre)
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
	let membreId = req.body._id
	
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
		municipalite:req.body.municipalite,

		secteur : req.body.secteur,
		grade : req.body.grade,
		poste : req.body.poste,
		num_cnss : req.body.num_cnss,
		is_active : req.body.is_active,
		appartenance : req.body.appartenance,
		nom_partie : req.body.nom_partie,
		description_conseil : req.body.description_conseil
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

const getMembresByMunicipalite = (req,res,next) => {
	Membres.find({ 'municipalite': req.body.municipaliteId })
	.populate([
        {
          path: 'municipalite',
		  populate: {
		    path: 'gouvernorat',
			populate: {
				path: 'ministere'
			  }
		  }
        },
      ])
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Membres"
		})
	})
}

const getMembresByGouvernorat = (req,res,next) => {
	Membres.find()
	.populate([
        {
          path: 'municipalite',
		  populate: {
		    path: 'gouvernorat',
			populate: {
				path: 'ministere'
			  }
		  }
        },
      ])
	.then(Allmembres  => { //liste de tous les membres
		var filteredMembres=[];	
		
		for (let i = 0; i < Allmembres.length; i++) {
			if (Allmembres[i].municipalite.gouvernorat._id==req.body.gouvernoratId) {
				filteredMembres.push(Allmembres[i])
			}
		}

		res.json(filteredMembres)
	})
	.catch(error  =>{
		console.log(error)
		res.json({
			message: "an error occured when displaying Membres by gouvernorat"
		})
	})
}


route.get('/',index)
route.post('/getMembresByMunicipalite',getMembresByMunicipalite)
route.post('/getMembresByGouvernorat',getMembresByGouvernorat)


route.post('/add',addMembre)
route.post('/getById',getById)
route.post('/update',update)
route.post('/destroy',destroy)


module.exports = route;