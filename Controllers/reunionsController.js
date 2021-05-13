const express = require('express');
const mongoose = require('mongoose');
const Reunions = require('../Models/reunions')
const Membres = require('../Models/Membres')
const Municipalites = require('../Models/Municipalite')


const route = express.Router();

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'help.majales@gmail.com',
    pass: 'majalesPFE'
  }
});
//show Reunions list
const index = (req,res,next)  => {
	Reunions.find()
    .populate('municipalite',{"gouvernorat": 0})
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
			message: "an error occured when displaying Reunions"
		})
	})

}

const reunionById = (req,res,next) => {
    Reunions.findOne({'_id': req.body.reunionId})
    .populate('municipalite',{"gouvernorat": 0})
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
const addReunion = async (req,res,next) => {
    let reunionDate = new Date(req.body.date);
	let reunion = new Reunions({
		sujet: req.body.sujet,
        municipalite: req.body.municipaliteId,
        date: req.body.date,//'31 Dec 1998 00:12:00 GMT'
        duree: req.body.duree,
        type: req.body.type,
        participations:req.body.participations
	})
    let dateReunion = new Date(req.body.date).toISOString().replace(/T/, ' ').replace(/\..+/, ''); //format date to '2020-04-04 14:55:45'  
    let prepDate = new Date(reunionDate.getFullYear(), reunionDate.getMonth()-1, reunionDate.getDate(), reunionDate.getHours(), reunionDate.getMinutes(), reunionDate.getSeconds(), reunionDate.getMilliseconds());
    if(req.body.type=="Regulière") {
        let prepReunion = new Reunions({
            sujet: req.body.sujet +"(preparatoire)",
            municipalite: req.body.municipaliteId,
            date: prepDate,
            duree: req.body.duree,
            type: req.body.type,
            participations:req.body.participations
        });         
        await prepReunion.save();
    }
    var maillist = [];
    for (let i = 0; i < req.body.participations.length; i++) {
        const membreId = req.body.participations[i].membre;
        const membre = await Membres.findById(membreId);
        maillist.push(membre.adresse);
    }
    var municipalite = await Municipalites.findById(req.body.municipaliteId);
    var mailContent = `Bonjour vous etes invité(e) a une réunion `+req.body.type+` qui aura lieu le `+dateReunion+` à la `+municipalite.Nom+`
voici les details du reunion: 
sujet du reunion:`+req.body.sujet+`
la reunion durera:`+req.body.duree+`
soyez à l'heure !`
    var mailOptions = {
        from: 'help.majales@gmail.com',
        to: maillist,
        subject: 'Invitation a une reunion '+req.body.type,
        text: mailContent
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          res.json({message: "error sending mail"})
          console.log(error);
        } else {
            reunion.save()
            .then(response => {
                res.json({message:"reunion Added Successfully"})
            })
            .catch(error  => {
                console.log(error)
                res.json({message: "an error occured when adding reunion"})
            })
        }
    });




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

//update membre
const edit = (req,res,next) => {
	let reunionId = req.body._id
	let updatedReunion = {
		sujet: req.body.sujet,
        date: req.body.date,
        duree: req.body.duree,
        type: req.body.type,
        participations:req.body.participations
	}
	Reunions.findByIdAndUpdate(reunionId,{$set: updatedReunion})
	.then(() => {
		res.json({
			message: "Reunion updated successfully"
		})
	})
	.catch(error => {
		res.json({
			message: "an error occured when updating Reunion"
		})
	})
}

//delete reunion
const destroy = async (req,res,next) => {
	let reunionId = req.body.reunionId
    let reunion = await Reunions.findOne({'_id': reunionId})
    .populate('municipalite',{"gouvernorat": 0})
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
    ]);

    var maillist = [];
    for (let i = 0; i < reunion.participations.length; i++) {
        const membre = reunion.participations[i].membre;
        maillist.push(membre.adresse);
    }




    var dateReunion = new Date(reunion.date).toISOString().replace(/T/, ' ').replace(/\..+/, ''); //format date to '2020-04-04 14:55:45'
    var mailContent = `Bonjour, je me prie de vous envoyer ce mail pour vous annoncer que la réunion prévue le `+dateReunion+` est annulée `
        
        var mailOptions = {
            from: 'help.majales@gmail.com',
            to: maillist,
            subject: 'Reunion annulée',
            text: mailContent
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              res.json({message: "error sending mail"})
              console.log(error);
            } else {
                reunion.save()
                .then(response => {//supprimer apres l'envoi du mail

                    Reunions.findByIdAndRemove(reunionId)
                    .then(() => {
                        res.json({
                            message:"reunion deleted successfully"
                        })
                    })
                    .catch(error =>{
                        res.json({
                            message:"an error occured when deleting reunion"
                        })
                    });

                })
                .catch(error  => {
                    console.log(error)
                    res.json({message: "an error occured when adding reunion"})
                })
            }
        });

}

//delete reunion preparatoire
const destroyPrep = async (req,res,next) => {
	let reunionId = req.body.reunionId
    Reunions.findByIdAndRemove(reunionId)
    .then(() => {
        res.json({
            message:"reunion deleted successfully"
        })
    })
    .catch(error =>{
        res.json({
            message:"an error occured when deleting reunion"
        })
    });
}

route.get('/',index)

route.post('/id',reunionById)
route.post('/add',addReunion)
route.post('/edit',edit)
route.post('/destroy',destroy);
route.post('/destroyPrep',destroyPrep);


route.post('/addParticipation',addParticipation)
route.post('/removeParticipation',removeParticipation)


module.exports = route;