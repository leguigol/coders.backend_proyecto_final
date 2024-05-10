const productService=require('../services/product.services');
const mongoose=require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const getAllProducts=async(req,res)=>{
    const productsList=await productService.getAllProducts();

    return res.json({
        message: 'getAllProducts',
        products: productsList,
    })
}

const getAllProductsView=async(req,res)=>{
    try{
        const productsList=await productService.getAllProducts();
        console.log('pase por la vista');
        return res.render("home", {products: productsList} );    
    } catch (error) {
        console.error(error);
        return res.status(500).send("Error al obtener los productos");  
    }
}

const getAllProductsPaginate=async(req,res)=>{
    try {
        const user=req.session.user;
        const { page = 1, limit=10 , campo, valor, sort }=req.query;
    
        const filter = campo ? { [campo]: valor } : {};
        let vsort = sort === 'ASC' ? 1 : -1;
        const options= { page: parseInt(page), limit: parseInt(limit), sort: { price: vsort }, lean: true};
        
        const {
            docs,
            totalDocs,
            limit: limitPag,
            totalPages,
            hasPrevPage,
            hasNextPage,
            nextPage,
            prevPage
          }=await productService.getAllProductsPaginate(filter,options);

          res.render('products', {
            user: user,
            products: docs,
            page: parseInt(page),
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            nextPage: nextPage,
            prevPage: prevPage,
            prevLink: hasPrevPage ? `/products?page=${prevPage}` : null,
            nextLink: hasNextPage ? `/products?page=${nextPage}` : null,
        });  
    
    } catch (error) {
        console.log("🚀 ~ getAllProductsPaginate ~ error:", error)  
    }
};

const getProductsByCategoria=async(req,res)=>{
    try{
        const { campo, valor, sort,page = 1, limit = 10 }=req.query;
        
        const filter = campo ? { [campo]: valor } : {};
      
        let vsort = sort === 'ASC' ? 1 : -1;
    
        const options = {
          page: parseInt(page),
          limit: parseInt(limit),
          sort: { price: vsort },
        };
    
        const {
          docs,
          totalDocs,
          limit: limitPag,
          totalPages,
          hasPrevPage,
          hasNextPage,
          nextPage,
          prevPage
        }= await productService.getAllProductsPaginate(filter,{ options, lean:true });

        res.render('productsCate', {
          products: docs,
          page: page,
          hasPrevPage: hasPrevPage,
          hasNextPage: hasNextPage,
          nextPage: nextPage,
          prevPage: prevPage,
          prevLink: hasPrevPage ? `/products/cate?page=${prevPage}` : null,
          nextLink: hasNextPage ? `/products/cate?page=${nextPage}` : null,
        });
  
    }catch(error){
        console.log(error);
    }
  
};

const getProductById=async(req,res)=>{
    try{
        const xvar=(req.params.pid).trim();
        
        const productId =(new ObjectId(xvar.toString()));
        if(ObjectId.isValid(productId)){
          const doc=await productService.getProductById({_id: productId});
          return res.render('productDetail', doc);
        }else{
          console.log('no es un objectId de mongoose')
        }
    
      }catch(error){
          console.log(error);
      }
    
};

module.exports={
    getAllProducts,
    getAllProductsView,
    getAllProductsPaginate,
    getProductsByCategoria,
    getProductById,
}