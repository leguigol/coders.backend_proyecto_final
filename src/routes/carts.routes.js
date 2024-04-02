const {Router}=require('express');
const cartData=require('../init-data/carts.data');
const cartModel=require('../dao/model/cart.model');
const CartManager=require('../dao/managers/cartManager');
const router=Router();
const mongoose=require('mongoose');
const handlePolicies = require('../middleware/handle-policies.middleware');
const cartCtrl=require('../controller/cart.controller');

const ObjectId = mongoose.Types.ObjectId;

    // cartManager=new CartManager();
        router.get('/insertion', async (req, res) => {
            try {
                // console.log('cartData:', cartData);
                const carts = await cartModel.insertMany(cartData);
                return res.json({
                    message: "cart massive insert successfully",
                    cartsInserted: carts,
                });
            } catch (error) {
                console.log(error.code);
                return res.status(500).json({
                    ok: false,
                    error: 'Internal server error',
                });
            }
        });

        // router.delete('/carts/:cid/products/:pid',handlePolicies(["USER"]), async (req, res) => {
        //     try {
        //         const cartId = new ObjectId(req.params.cid);
        //         const productId = req.params.pid;
        
        //         // Verificar si el carrito existe
        //         const existingCart = await cartModel.findOne({_id: cartId});
        //         if (!existingCart) {
        //             return res.status(404).json({
        //                 ok: false,
        //                 message: 'El carrito no existe.',
        //             });
        //         }
        
        //         // Filtrar los productos del carrito excluyendo el producto a eliminar
        //         existingCart.productos = existingCart.productos.filter(item => {
        //             return item.producto.toString() !== productId;
        //         });
        
        //         // Guardar el carrito actualizado
        //         await existingCart.save();
        
        //         return res.json({
        //             ok: true,
        //             message: 'Producto eliminado del carrito exitosamente.',
        //         });
        //     } catch (error) {
        //         console.error('Error al eliminar producto del carrito:', error);
        //         return res.status(500).json({
        //             ok: false,
        //             error: 'Error interno del servidor.',
        //         });
        //     }
        // });

        // router.delete('/carts/:cid/products/:pid',handlePolicies(["USER"]), async (req, res) => {
        //     try {
        //         const cartId = new ObjectId(req.params.cid);
        //         const productId = req.params.pid;
        
        //         // Verificar si el carrito existe
        //         const existingCart = await cartModel.findOne({_id: cartId});
        //         if (!existingCart) {
        //             return res.status(404).json({
        //                 ok: false,
        //                 message: 'El carrito no existe.',
        //             });
        //         }
        
        //         // Filtrar los productos del carrito excluyendo el producto a eliminar
        //         existingCart.productos = existingCart.productos.filter(item => {
        //             return item.producto.toString() !== productId;
        //         });
        
        //         // Guardar el carrito actualizado
        //         await existingCart.save();
        
        //         return res.json({
        //             ok: true,
        //             message: 'Producto eliminado del carrito exitosamente.',
        //         });
        //     } catch (error) {
        //         console.error('Error al eliminar producto del carrito:', error);
        //         return res.status(500).json({
        //             ok: false,
        //             error: 'Error interno del servidor.',
        //         });
        //     }
        // });
        router.delete('/carts/:cid/products/:pid',handlePolicies(["USER"]), cartCtrl.getCartById); 

        // router.get('/',handlePolicies(["USER"]), async (req, res) => {
        //     try {
        //         const Cart = await cartModel.find();
                
        //         return res.json({
        //             status: true,
        //             message: 'todos los carritos',
        //             Cart
        //         });
        //     } catch (error) {
        //         console.error('Error al actualizar el carrito:', error);
        //         return res.status(500).json({
        //             ok: false,
        //             error: 'Error interno del servidor.',
        //         });
        //     }
        // });

        router.get('/', handlePolicies(["USER"]),cartCtrl.getAllCart);

        // router.put('/carts/:cid',handlePolicies(["USER"]), async (req, res) => {
        //     try {
        //         const cartId = req.params.cid;
        //         const { productos } = req.body;
        
        //         // Verificar si el carrito existe
        //         const existingCart = await cartModel.findById(cartId);
        //         if (!existingCart) {
        //             return res.status(404).json({
        //                 ok: false,
        //                 message: 'El carrito no existe.',
        //             });
        //         }
        
        //         // Actualizar los productos del carrito con el nuevo arreglo
        //         existingCart.productos = productos;
        
        //         await existingCart.save();
        
        //         return res.json({
        //             ok: true,
        //             message: 'Carrito actualizado exitosamente.',
        //         });
        //     } catch (error) {
        //         console.error('Error al actualizar el carrito:', error);
        //         return res.status(500).json({
        //             ok: false,
        //             error: 'Error interno del servidor.',
        //         });
        //     }
        // });

        router.put('/carts/:cid',handlePolicies(["USER"]),cartCtrl.updateProductsInCart);

        router.put('/carts/:cid/products/:pid',handlePolicies(["USER"]),cartCtrl.updateQuantityProductInCart);

        // router.delete('/carts/:cid',handlePolicies(["USER"]), async (req, res) => {
        //     try {
        //         const cartId = req.params.cid;
        
        //         // Verificar si el carrito existe
        //         const existingCart = await cartModel.findById(cartId);
        //         if (!existingCart) {
        //             return res.status(404).json({
        //                 ok: false,
        //                 message: 'El carrito no existe.',
        //             });
        //         }
        
        //         // Eliminar todos los productos del carrito
        //         existingCart.productos = [];
        
        //         // Guardar el carrito actualizado
        //         await existingCart.save();
        
        //         return res.json({
        //             ok: true,
        //             message: 'Todos los productos del carrito han sido eliminados.',
        //         });
        //     } catch (error) {
        //         console.error('Error al eliminar todos los productos del carrito:', error);
        //         return res.status(500).json({
        //             ok: false,
        //             error: 'Error interno del servidor.',
        //         });
        //     }
        // });

        router.delete('/carts/:cid',cartCtrl.deleteCart);
        
        // router.get('/vercarrito/:cid',handlePolicies(["USER"]),async(req,res)=>{
        //     try {
        //         const cartId=req.params.cid;

        //         const {carrito}=await cartModel.find({_id: cartId}).populate("productos.producto",{ title:1, description:1, price:1});
        //         return res.json({
        //             message: 'carrito list',
        //             carrito,
        //         });
        //     } catch (error) {
        //         console.log("🚀 ~ CartRoutes ~ this.router.ger ~ error:", error)
                
        //     }
        // });

        router.get('/vercarrito/:cid',cartCtrl.showCart);

module.exports=router;