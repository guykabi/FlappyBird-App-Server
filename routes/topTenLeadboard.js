const router = require('express').Router()
const topTenLeadborad = require('../models/topTenLeadboardModel')



router.get('/', async (req,resp,next)=>{ //Get all top 10 users
    try{
        let data = await topTenLeadborad.find().sort({Score:-1})//Returns users by descending order of scores
        if(!data)  return next(new Error('Something went wrong'))
        resp.status(200).json(data)
    }catch(err)
    {
         next(err)
    }
})


router.post('/',async (req,resp,next)=>{ 

    //Checks if the fields name are correct and prevents an unnecessary delete
    if(!req.body.Username || !req.body.Score) return next(new Error('One or more wrong field name'))

    try{  
          let lowest = topTenLeadborad.find().sort({Score:1 ,createdAt:-1}).limit(1)//Returns the lowest + newest user 
          let limitTen = topTenLeadborad.countDocuments({}) //Count the numbers of users inside the DB collection
          let [theLowest, theLimit] = await Promise.all([lowest, limitTen]);//Handlling all the requests together
          
          if(theLowest[0].Score < req.body.Score && theLimit <= 10)//Checks if the new user score is indeed higher than the lowest current score
          {
             await topTenLeadborad.findByIdAndDelete({_id:theLowest[0]._id})//Deleting the lowest score
             const user = new topTenLeadborad(req.body)
             let data = await user.save() //Adding the new score 
             if(data)//If the adding succeed - sends the new top 10 table to the client
             {
                try{
                    let allUsersData = await topTenLeadborad.find().sort({Score:-1})//Returns users by descending order of scores
                    if(!allUsersData)  return next(new Error('Something went wrong'))
                    return resp.status(200).json(allUsersData)
                }catch(err)
                {
                     next(err)
                }
             }
          } 

          if(theLimit < 10 ) //If there is under 10 users inside the top 10 - hypothetical situation not supposed to happen
          {
             const user = new topTenLeadborad(req.body)
             let data = await user.save() //Adding the new score 
             return resp.status(200).json(data)
          }
          return resp.status(200).json('Score isnt high enough')

    }catch(err)
    {
        next(err)
    }
}) 


module.exports = router
