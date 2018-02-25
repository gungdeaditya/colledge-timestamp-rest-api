var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jadwal = new Schema({
    kelas : {type : String, default : "4IA01"},
    hari : String,
    matkul : String,
    ruang : String,
})

module.exports = mongoose.model('Jadwal',jadwal);