const mongoose= require('mongoose')
 const userSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required:[true,"Enter your Name"]
        },
        email:{
            type:String,
            required:[true,"Enter your Email"]
        },
        password:{
            type:String,
            required:[true,"Enter your Password"]
        }
    },
{timestamps:true}
    );

const user=mongoose.model('user',userSchema);

module.exports=user;