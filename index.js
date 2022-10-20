const express = require('express') 
const cors = require('cors') 
const BodyParser = require("body-parser");
require('dotenv').config()
const allUsersLeadboardRouter = require('./routes/allUsersLeadboardRouter')
const topTenLeadboardRouter = require('./routes/topTenLeadboard')
const errorHnadler = require('./middleware/errorhandler')

const app = express() 
const port = process.env.PORT || 8080
app.use(cors()) 
app.use(express.json()); 
app.use(BodyParser.urlencoded({ extended: true }));



require('./configs/database') 


app.use('/leadboard',allUsersLeadboardRouter)
app.use('/toptenleadboard',topTenLeadboardRouter)
app.use(errorHnadler) //Middleware handling error function

app.listen(port,()=>{
    console.log('App is listenning on port' + " " + port)
}) 
