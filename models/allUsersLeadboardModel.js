const mongoose = require('mongoose')
const {Schema} =mongoose


//All users collection schema
const allUsersLeadboardSchema = new Schema({
    name:{type:String,required:true},
    points:{type:Number,required:true}
},
    {timestamps:true}
) 

module.exports = mongoose.model('leadboards',allUsersLeadboardSchema)



