// import { Router } from "express";
const { Router } = require("express");
const passport=require('passport');
const AuthMdw=require('../middleware/auth.middleware');
const path = require("path");

const router = Router();

const ProductManager = require('../dao/managers/productManager');
const productModel=require('../dao/model/products.model');
const CartModel = require("../dao/model/cart.model");
const mongoose=require('mongoose');
const handlePolicies = require("../middleware/handle-policies.middleware");
const productCtrl=require('../controller/products.controller');
const cartCtrl=require('../controller/cart.controller');

const ObjectId = mongoose.Types.ObjectId;

// const pathBase = path.join(__dirname, '../productos.json');
// const pM = new ProductManager(pathBase);

router.get("/", productCtrl.getAllProductsView); 

// router.get("/", async (req, res) => {
//   try {
//       const products = await ProductManager.getAllProducts();
//       res.render("home", products );
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// router.get("/realtimeproducts", async(req, res) => {
//   const products = await productModel.find();
//   res.render("realTimeProducts", { productos: products.productos });
// });

// router.get("/products",handlePolicies(["USER"]),async(req, res) => {
//   try{
//     const user=req.session.user;
//     const { page = 1, limit=10 , campo, valor, sort }=req.query;

//     const filter = campo ? { [campo]: valor } : {};
//     let vsort = sort === 'ASC' ? 1 : -1;
//     const options= { page: parseInt(page), limit: parseInt(limit), sort: { price: vsort }, lean: true};

//     const {
//       docs,
//       totalDocs,
//       limit: limitPag,
//       totalPages,
//       hasPrevPage,
//       hasNextPage,
//       nextPage,
//       prevPage
//     }=await productModel.paginate(filter,options);

//     //console.log('datos del usuario logueado anteriormente:',user);

//     res.render('products', {
//         user: user,
//         products: docs,
//         page: parseInt(page),
//         hasPrevPage: hasPrevPage,
//         hasNextPage: hasNextPage,
//         nextPage: nextPage,
//         prevPage: prevPage,
//         prevLink: hasPrevPage ? `/products?page=${prevPage}` : null,
//         nextLink: hasNextPage ? `/products?page=${nextPage}` : null,
//     });  
    

//   }catch(error){
//     console.log(error);
//   }

// });

router.get("/products",handlePolicies(["USER"]),productCtrl.getAllProductsPaginate);

// router.get('/products/cate',async(req,res)=>{
//   try{
//       const { campo, valor, sort,page = 1, limit = 10 }=req.query;
      
//       const filter = campo ? { [campo]: valor } : {};
    
//       let vsort = sort === 'ASC' ? 1 : -1;
  
//       const options = {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         sort: { price: vsort },
//       };
  
//       const {
//         docs,
//         totalDocs,
//         limit: limitPag,
//         totalPages,
//         hasPrevPage,
//         hasNextPage,
//         nextPage,
//         prevPage
//       }= await productModel.paginate(filter,{ options, lean:true });
  
//       res.render('productsCate', {
//         products: docs,
//         page: page,
//         hasPrevPage: hasPrevPage,
//         hasNextPage: hasNextPage,
//         nextPage: nextPage,
//         prevPage: prevPage,
//         prevLink: hasPrevPage ? `/products/cate?page=${prevPage}` : null,
//         nextLink: hasNextPage ? `/products/cate?page=${nextPage}` : null,
//       });

//   }catch(error){
//       console.log(error);
//   }
// })

router.get('/products/cate',handlePolicies(["USER"]),productCtrl.getProductsByCategoria);

// router.get('/product/:pid',async(req,res)=>{
//   try{
//     // console.log((req.params.pid).toString())
//     const xvar=(req.params.pid).trim();
    
//     const productId =(new ObjectId(xvar));
//     if(ObjectId.isValid(productId)){
//       const doc=await productModel.findOne({_id: productId});
//       return res.render('productDetail', doc);
//     }else{
//       console.log('no es un objectId de mongoose')
//     }

//   }catch(error){
//       console.log(error);
//   }
// })

router.get('/product/:pid',handlePolicies(["USER"]),productCtrl.getProductById);

// router.get('/carts/:cid', async (req, res) => {
//   try {
//     const cartId =new ObjectId((req.params.cid).trim());

//     const carrito = await CartModel.findOne({_id: cartId}).populate('productos.producto').lean();

//     //console.log(carrito)
//     // const totalProducts = carrito.productos.length;

//     return res.render('cart', carrito);
//   } catch (error) {
//       console.error('Error al obtener el carrito con productos y paginación:', error);
//       return res.status(500).json({
//           ok: false,
//           error: 'Error interno del servidor.',
//       });
//   }
// });

router.get('/carts/:cid',handlePolicies(["USER"]), cartCtrl.getCartById);

// router.get('/carts', async (req, res) => {
//   try {
//       const cart = await CartModel.find().lean();
//       console.log(cart)
//       return res.render('carts', cart);
//   } catch (error) {
//       console.error('Error al actualizar el carrito:', error);
//       return res.status(500).json({
//           ok: false,
//           error: 'Error interno del servidor.',
//       });
//   }
// });

router.get('/carts',handlePolicies(["USER"]), cartCtrl.getAllCartView);

router.get('/register', async(req,res)=>{

  res.render('register');
  
})

router.get('/login', async(req,res)=>{

  res.render('login');
  
})

router.post('/login',passport.authenticate('login',{failureRedirect: '/faillogin'}), async(req,res)=>{

  res.render('login');
  
})

router.get('/faillogin',async(req,res)=>{
  res.send({error: 'login strategy failed'});
})

router.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}),async(req,res)=>{

  res.render('register');
  
})

router.get('/failregister',async(req,res)=>{
  res.send({error: 'register strategy failed'});
})

module.exports= router;