const express = require('express');
const mongoose = require('mongoose');
const Reunions = require('../Models/reunions')

const route = express.Router();

//show Reunions list
const index = (req,res,next)  => {
	Reunions.find()
    .populate([
        {
          path: 'participations.membre',
		  populate: {
		    path: 'municipalite',
			populate: {
				path: 'gouvernorat',
                populate: {
                    path: 'ministere'
                }
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
	.then(response  => {
		res.json(response)
	})
	.catch(error  =>{
		res.json({
			message: "an error occured when displaying Reunions"
		})
	})
}

const reunionById = (req,res,next) => {
    Reunions.findOne({'_id': req.body.reunionId})
    .populate([
        {
          path: 'participations.membre',
		  populate: {
		    path: 'municipalite',
			populate: {
				path: 'gouvernorat',
                populate: {
                    path: 'ministere'
                }
			}
		  }
        },
      ])
    .exec(function (err, reunion) {
        res.json(reunion)
    })
}

//add Reunions
const addReunion = (req,res,next) => {
	let reunion = new Reunions({
		sujet: req.body.sujet,
        lieu: req.body.lieu,
        date: Date.parse(req.body.date),//'31 Dec 1998 00:12:00 GMT'
        duree: req.body.duree,
        type: req.body.type,
        participations:[]
	})
	reunion.save()
	.then(response => {
		res.json({
			message:"reunion Added Successfully"
		})
	})
	.catch(error  => {
		res.json({
			message: "an error occured when adding reunion"
		})
	})
}

// add Participation
const addParticipation = (req, res) => {
    try {
        Reunions.findOne({'_id': req.body.reunionId}).exec(function (err, reunion) {
            if (err) {
                return res.json({
                    message: 'Error find Reunion '
                });
            } else {
                try {
                	
                    var participations = [];
                    
                    participations = reunion.participations;
                    const participation = {
                        membre: req.body.membreId
                    };
                    var trouv=false;
                    for (var i = 0; i < participations.length; i++) {
                        if (participations[i].membre._id==req.body.membreId) {
                            trouv=true
                        }
                    }
                    
                    if (trouv) {
                        res.status(200).send(JSON.stringify({
                            message:'Participation exite'
                        }))
                    } else {
                        participations.push(participation);
                        reunion.participations = participations;
                        reunion.save(function (err) {
                            if (err) {
                                console.log('error' + err)
                            } else {
                                res.status(200).send(JSON.stringify({
                                    message:'Participation added succeffully'
                                }))
                            }
                        });
                    }
                    

                    
                } catch (err) {
                    console.log(err);
                    
                    res.status(500).send(JSON.stringify({
                        message: '500 Internal Server Error'
					}))

                }
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).send(JSON.stringify({
            message: '500 Internal Server Error'
		}))

    }
}

// delete favorite
const removeParticipation = (req, res) => {

    try {
        Reunions.findOne({'_id': req.body.reunionId}).exec(function (err, reunion) {
            if (err) {
                return res.json({
                    message: 'Error find user '
                });
            } else {
                try {
                    for (var i = 0; i < reunion.participations.length; i++) {
		                if(reunion.participations[i].membre==req.body.membreId)
		                {
		                    reunion.participations.splice(i,1);
		                }
            		}
                    reunion.save(function (err) {
                        if (err) {
                            console.log('error' + err)
                        } else {
                            res.status(200).send(JSON.stringify({
								message:'participation deleted succeffully'
							}))
                        }
                    });
                    
                } catch (err) {
                    console.log(err);
                    res.status(500).send(JSON.stringify({
                        message: '500 Internal Server Error'
					}))

                }
            }
        });

    } catch (err) {
        console.log(err);
        
        res.status(500).send(JSON.stringify({
			status: 0,
            message: '500 Internal Server Error',
            data: {}
		}))

    }
}



route.get('/',index)

route.post('/id',reunionById)
route.post('/add',addReunion)
route.post('/addParticipation',addParticipation)
route.post('/removeParticipation',removeParticipation)


module.exports = route;