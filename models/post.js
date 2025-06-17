const mongoose=require('mongoose');
const {objectId}=mongoose.Schema.Types
const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
      body:{
        type:String,
        required:true
    },
      likes:{
        type:objectId,
     ref:User
    },
    Comment:[{
        text:String,
        postedBy:{
            type:objectId,
            ref:User
        }
    }]
})
module.exports=mongoose.model("Post",postSchema);


