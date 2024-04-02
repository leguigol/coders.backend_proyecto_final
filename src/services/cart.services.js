const CartModel = require('../dao/model/cart.model');

const getCartById=async(id)=>{

    let cart=await CartModel.findOne({_id: id}).populate('productos.producto').lean();
    return cart;
}

const getAllCart=async()=>{
    let cart=await CartModel.find().lean();

    return cart;
};
const getCartFindById=async(id)=>{
    let cart=await CartModel.findById(id);
    return cart;
}
const getCartFind=async(id)=>{
    console.log('id',id);   
    let cart=CartModel.find({_id: id}).populate("productos.producto",{ title:1, description:1, price:1}).lean();
    return cart;
};
const getCartOne=async(id)=>{
    let carrito = await CartModel.findOne({ _id: id }).populate("productos.producto", { title: 1, description: 1, price: 1 }).lean();
    return carrito;
};

module.exports={
    getCartById,
    getAllCart,
    getCartFindById,
    getCartFind,
    getCartOne,
}
