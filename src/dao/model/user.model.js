const mongoose=require('mongoose');

const collection="Users";

const roleType={
    USER: "USER",
    ADMIN: "ADMIN",
    PUBLIC: "PUBLIC",
}

const userSchema=new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(roleType),
        default: 'USER',
    },
    cart: {
        type: [
            {
                cartid: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Carts",
                },
            },
        ],
    }
})

userSchema.pre('find',function(){
    this.populate("cart.cartid");
});

const userModel=mongoose.model(collection,userSchema);

module.exports=userModel;