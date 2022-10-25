const router = require('express').Router()
const leadboardModel = require('../models/allUsersLeadboardModel')


//Top ten users - for global use


router.get('/', async (req,resp,next)=>{
    try{
       let data = await leadboardModel.find().sort({Score:-1,updatedAt:1}).limit(10) //Gets the top 10 users by score
       if(!data) return next(new Error('Something went wrong'))
       return resp.status(200).json(data)
    }catch(err)
    {
      next(err)
    }
})

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


//Update the score of the user only if he indeed set a better score
router.patch('/:id',async(req,resp,next)=>{
    const {Score} = req.body 
    if(!Score || Score === null) return next(new Error('Empty field'))
    try{   

           let TopTen = await leadboardModel.find().sort({Score:-1,updatedAt:1}).limit(10) //Gets the new top ten users by score and by date the achieved
           if(!TopTen) return next(new Error('Something went wrong'))//Error handling for top ten request
           
           
           let scoreCheck = await leadboardModel.findOne({_id:req.params.id}) //Try to find a user with those username and score to see if the score has changed
           if(scoreCheck.Score >= Score) return resp.status(400).json("Score hasn't changed")//If such a user indeed found so the score is the same and there is nothing to change
           let data = await leadboardModel.findByIdAndUpdate(req.params.id,req.body,{new:true})//If no user found than the updating will happen
           

           //Checks if there is a reason to gets the top ten users by checking if the user 
           //Is not already inside the top ten and the user's new score higher than the current lowest score in the top ten
           if(!TopTen.find(t=>t.Username === data.Username) && data.Score > TopTen[9].Score) 
           { 
            let newTopTen = await leadboardModel.find().sort({Score:-1,updatedAt:1}).limit(10) //Gets the new top 10 users by score and by date the achieved
            if(!newTopTen) return next(new Error('Something went wrong'))//Error handling for top ten request
            return resp.status(200).json({message:'Congrats - you entered top ten scores',userData:data,topTen:newTopTen})
           }
           
           let usernameFound = TopTen.find(t=>t.Username === data.Username)//Find the user from the old top ten
           let index = TopTen.indexOf(usernameFound)//Find the old index of the user

           //Checks if the user was already in the top ten and if he at least passed the one that was above him
           if(usernameFound && data.Score > TopTen[index-1].Score) 
           { 
            let newTopTen = await leadboardModel.find().sort({Score:-1,updatedAt:1}).limit(10) //Gets the new top ten users by score and by date the achieved
            let position =  newTopTen.indexOf(newTopTen.find(t=>t.Username === data.Username))//Find the index of the user that just improved his score and position
            if(!newTopTen) return next(new Error('Something went wrong'))//Error handling for top ten request
            return resp.status(200).json({message:` Wow - Your position improved to ${position+1}`,userData:data,topTen:newTopTen})
           }
           return resp.status(200).json({message:'Updated',Data:data})

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
