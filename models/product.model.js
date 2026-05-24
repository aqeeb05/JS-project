const mongoose=require('mongoose')

const ProductSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"please enter product name"],
        },

        quantity:{
            type:Number,
            required: true,
            default:0
        },

        price:{
            type:Number,
            required:true,
            desult:0
        },

        image:{
            type: String,
            required:false,
        },
    },
    {
        timestamps:true,
    }
)




const Product= mongoose.model("Products", ProductSchema)

module.exports=Product;