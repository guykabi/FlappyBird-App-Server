const router = require('express').Router()
const leadboardModel = require('../models/allUsersLeadboardModel')


router.get('/:id',async(req,resp,next)=>{//Get a user data by his id
    if(req.params.id.length != 24 ) return next(new Error('Invalid ID'))//Checking invalid ID length ors any error
    try{
        let data = await leadboardModel.findById(req.params.id)//Find the user with that id
        if(!data) return next(new Error('Incorrect Id'))
        resp.status(200).json(data)
    }catch(err)
    { 
        next(err) //Send the error to the errorhandler/middleware
    }
}) 

//Adding a new user to leadboard with score 0
router.post('/',async(req,resp,next)=>{
  
    const {Username, Score} = req.body
    if(Username === undefined || Score === undefined) return next(new Error('Incorrect field name'))//Incorrect field name error
    try{     
           if(Username.length < 1 || Score === null) return next(new Error('Empty field'))//Check if the fields are not empty
    
           const searchUser = await leadboardModel.find({Username})//Search a user with such username
           if(searchUser.length > 0) return next(new Error('Username already exists!'))//Send error that such user is indeed exists

           const user = new leadboardModel(req.body)//User object contains his username and initial score of: 0
           const data = await user.save() //Adding the new user to the DB
           if(data) return resp.status(200).json({message:'User added!',Details:data})

    }catch(err)
    {      
           next(err)
    }
}) 

//Checks if user exists and by that if username is taken already
/*router.post('/user',async(req,resp,next)=>{
    const {Username} = req.body
    try{
           let data = await leadboardModel.find({Username})
           if(data.length < 1) return next(new Error('User not found - username is available')) //If no user found
    }catch(err)
    {
          next(err) 
    }
})*/


//Update the score or the the user's username if he will choose to
router.patch('/:id',async(req,resp,next)=>{
    const {Score} = req.body 
    if(!Score || Score === null) return next(new Error('Empty field'))
    try{ 
           let scoreCheck = await leadboardModel.findOne({_id:req.params.id}) //Try to find a user with those username and score to see if the score has changed
           if(scoreCheck.Score >= Score) return resp.status(400).json("Score hasn't changed")//If such a user indeed found so the score is the same and there is nothing to change
           let data = await leadboardModel.findByIdAndUpdate(req.params.id,req.body,{new:true})//If no user found than the updating will happen
           resp.status(200).json({message:'Updated',Data:data})
    }catch(err){
          next(err) 
    }
})  


//Delete a user if there is need to
router.delete('/:id',async(req,resp)=>{
    try{
      let data = await leadboardModel.findByIdAndDelete({_id:req.params.id})
      resp.status(200).json('User deleted')
    }catch(err){
        resp.status(500).json('Error' + err)
    }
})


module.exports = router
