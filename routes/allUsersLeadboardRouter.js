const router = require('express').Router()
const leadboardModel = require('../models/allUsersLeadboardModel')


//Get all user and than filter top 10
/*router.get('/',async(req,resp)=>{
//From the collection of top 10 users 
})*/ 

//Updaing the top 10 collection function 
//and remove the user that has the lowest score!



router.get('/:id',async(req,resp,next)=>{
    //Get the user best score? like on cases user is not on top 10,
    // just to show him on screen?
    try{
        data = await leadboardModel.find({_id:req.params.id})//Find the user with that id
        //if(!data) return next(new Error('Incorrect Id'))
        resp.status(200).json(data)
    }catch(err)
    { 
        next(err) //Send the error to the errorhandler/middleware
    }
}) 

//Adding a new user to leadboard with score 0
router.post('/',async(req,resp)=>{
   
    const user = new leadboardModel(req.body)//User object contains his username and initial score of: 0
    try{
           const data = await user.save() //Adding the new user to the DB
           if(data) return resp.status(200).json({message:'User added!',Details:data})
    }catch(err)
    {      
           //Return if body does not contains required field!
           resp.status(400).json(err.message.slice(30))
    }
}) 

router.post('/user',async(req,resp,next)=>{
    const {Username,Score} = req.body
    try{
           let data = await leadboardModel.find({Username,Score})
           if(data.length < 1) return next(new Error('User not found')) //If no user found
           if(data) return resp.status(200).json({message:'User found!',Details:data})
    }catch(err)
    {
          next(err) 
    }
})


//Update the score or the the user's username if he will choose to
router.patch('/:id',async(req,resp)=>{
    const {Username,Score} = req.body
    try{ 
           let scoreCheck = await leadboardModel.find({Username,Score}) //Try to find a user with those username and score to see if the score has changed
           if(scoreCheck.length > 0) return resp.status(400).json("Score hasn't changed")//If such a user indeed found so the score is the same and there is nothing to change
           let data = await leadboardModel.findByIdAndUpdate(req.params.id,req.body,{new:true})//If no user found than the updating will happen
           resp.status(200).json({message:'Updated',Data:data})
    }catch(err){
          resp.status(500).json('Error')
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
