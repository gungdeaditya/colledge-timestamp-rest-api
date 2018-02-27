var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var config = require('../config/database');

var router = express.Router();
var db = mongoose.connect(config.database);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended : false}));

var Jadwal = require('../models/jadwal');

router.use(function timeLog (req,res,next) {
    console.log('Time', Date.now());
    next();
});

// router.get('/', function(req, res) {
//     res.send('Jadwal Kelas 4IA01')
// });

router.post('/',function(req, res){
    var jadwal = new Jadwal();
    jadwal.kelas = req.body.kelas;
    jadwal.hari = req.body.hari;
    jadwal.matkul = req.body.matkul;
    jadwal.ruang = req.body.ruang;
    jadwal.save(function(err, savedJadwal) {
        if(err){
            res.status(200).send({
                status : false,
                message : "Error, Couldn't save jadwal"
            }); 
        }else{
            res.status(200).send({
                status : true,
                message : "Item inserted"
            }); 
        }
    });
});

router.get('/', function(req, res) {
    Jadwal.find({},(err, jadwals) => {
        if (err) {
            res.status(200).send({
                status : false,
                message : "Error, Couldn't fetch jadwals"
            }); 
        } else {
            res.send(jadwals);
        }
    });
});

router.put('/:id',function(req, res,next){
    Jadwal.findByIdAndUpdate(req.params.id, req.body, (err, jadwal) => {
            if(err){
                res.status(200).send({
                    status : false,
                    message : "Jadwal Id not found"
                }); 
                return next(err);
            }else{
                res.status(200).send({
                    status : true,
                    message : "Update Successful"
                }); 
            }
    })
});

router.delete('/:id',function(req, res){
     Jadwal.findByIdAndRemove(req.params.id, req.body, (err) => {
            if(err){
                res.status(200).send({
                    status : false,
                    message : "Cannot delete, ID not found"
                }); 
            }else{
                res.status(200).send({
                    status : true,
                    message : "Delete Successful"
                }); 
            }
    })
});

module.exports = router;