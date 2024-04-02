const productModel=require('../dao/model/products.model');

const getAllProducts=async()=>{
    let products=await productModel.find();
    return products;
};

const getAllProductsPaginate=async(filter,options)=>{
    let products=await productModel.paginate(filter,options);
    return products;
};

const getProductById=async(id)=>{
    let product=await productModel.findOne(id);
    return product;
};

module.exports={
    getAllProducts,
    getAllProductsPaginate,
    getProductById,
}