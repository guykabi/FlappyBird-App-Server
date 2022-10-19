const mongoose = require('mongoose')
const {Schema} =mongoose


//All users collection schema
const allUsersLeadboardSchema = new Schema({
    Username:{type:String,required:true},
    Score:{type:Number,required:true}
},
    {timestamps:true}
) 

module.exports = mongoose.model('leadboards',allUsersLeadboardSchema)



