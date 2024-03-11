const mongoose=require('mongoose');

const collection="Users";

const userSchema=new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    role: String
})

const userModel=mongoose.model(collection,userSchema);

module.exports=userModel;