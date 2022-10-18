const router = require('express').Router()
const leadboardModel = require('../models/allUsersLeadboardModel')


//Get all user and than filter top 10
/*router.get('/',async(req,resp)=>{
//From the collection of top 10 users 
})*/ 

//Updaing the top 10 collection function 
//and remove the user that has the lowest score!



router.get('/:id',async(req,resp)=>{
    //Get the user best score? like on cases user is not on top 10,
    // just to show him on screen?
    try{
        data = await leadboardModel.find({_id:req.params.id})
        if(!data)
        {
            resp.status(400).json('User not found')
        }
        resp.status(200).json(data)
    }catch(err)
    { 
        resp.status(500).json('Error!!')
    }
}) 

//Adding a new user to leadboard with score 0
router.post('/',async(req,resp)=>{
    console.log(req.body)
    const user = new leadboardModel(req.body)
    try{
           const data = await user.save()
           resp.status(200).json({message:'User added!',Details:data})
    }catch(err)
    {      
           //Return if body dont contains required field!
           console.log('dcnjncdco')
           resp.status(400).json(err.message.slice(30))
    }
}) 

router.post('/user',async(req,resp)=>{
    try{
           let data = await leadboardModel.findOne({Username:req.body.Username})
           if(!data)
           {
            resp.status(400).json('User not found')
           }
           resp.status(200).json({message:'User found!',Details:data})
    }catch(err)
    {
          resp.status(500).json('Error!!')
    }
})


//Update the score or the the user's username if he will choose to
router.patch('/:id',async(req,resp)=>{
    try{
          let data = await leadboardModel.findByIdAndUpdate(req.params.id,req.body)
          resp.status(200).json('Updated')
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
