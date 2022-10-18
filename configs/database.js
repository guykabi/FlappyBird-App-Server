const mongoose = require('mongoose') 
require('dotenv').config()

//DB cluster connection
mongoose.connect(`mongodb+srv://FlappyApp:${process.env.DB_PASS}@cluster0.vyxkfjh.mongodb.net/FlappyAppDB?retryWrites=true&w=majority`)
  




 