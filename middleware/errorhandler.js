const errorHnadler = (error,req,resp,next)=>{
   return resp.status(500).json(error.message)
}

module.exports = errorHnadler