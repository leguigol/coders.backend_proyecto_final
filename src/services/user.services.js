const userModel=require('../dao/model/user.model');

const getUserByEmail=async(email)=>{
    let user=await userModel.findOne({email});
    return user;
}

const registerUser=async(user)=>{
    console.log('user en el service:',user);
    return await userModel.create(user);

}

module.exports={
    getUserByEmail,
    registerUser,
}