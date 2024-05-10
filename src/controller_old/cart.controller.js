    const cartService=require('../services/cart.services');
    
    const mongoose=require('mongoose');
    const ObjectId = mongoose.Types.ObjectId;

    const getCartById=async(req,res)=>{
        try {
            const cartId = req.params.cid.trim();

            // Verifica la validez del ID del carrito
            if (!mongoose.Types.ObjectId.isValid(cartId)) {
                return res.status(400).json({
                    ok: false,
                    error: 'El ID del carrito proporcionado no es válido.'
                });
            }            

            const carrito = await cartService.getCartById(cartId);
            if (!carrito) {
                return res.status(404).json({
                    ok: false,
                    error: 'No se encontró ningún carrito con el ID proporcionado.'
                });
            }
            
            console.log('carrito:',carrito);
            return res.render('cart', carrito);
        } catch (error) {
            console.error('Error al obtener el carrito con productos y paginación:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }
        
    };

    const getAllCartView=async(req,res)=>{
        try {
            const cart = await cartService.getAllCart();
            console.log(cart)
            return res.render('carts', cart);
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }      

    };

    const getAllCart=async(req,res)=>{
        try {
            const cart = await cartService.getAllCart();
            console.log(cart)
            return res.json({
                message: 'getAllCart',
                cart
            });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }      

    };

    const deleteProduct=async(req,res)=>{
        try {
            const cartId = new ObjectId(req.params.cid);
            const productId = req.params.pid;
    
            // Verificar si el carrito existe
            // const existingCart = await cartModel.findOne({_id: cartId});
            const existingCart=await cartService.getCartById(cartId);
            if (!existingCart) {
                return res.status(404).json({
                    ok: false,
                    message: 'El carrito no existe.',
                });
            }
    
            // Filtrar los productos del carrito excluyendo el producto a eliminar
            existingCart.productos = existingCart.productos.filter(item => {
                return item.producto.toString() !== productId;
            });
    
            // Guardar el carrito actualizado
            await existingCart.save();
    
            return res.json({
                ok: true,
                message: 'Producto eliminado del carrito exitosamente.',
            });
        } catch (error) {
            console.error('Error al eliminar producto del carrito:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }

    };

    const updateProductsInCart=async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const { productos } = req.body;
    
            // Verificar si el carrito existe
            const existingCart = await cartService.getCartById(cartId);
            if (!existingCart) {
                return res.status(404).json({
                    ok: false,
                    message: 'El carrito no existe.',
                });
            }
    
            // Actualizar los productos del carrito con el nuevo arreglo
            existingCart.productos = productos;
    
            await existingCart.save();
    
            return res.json({
                ok: true,
                message: 'Carrito actualizado exitosamente.',
            });
        } catch (error) {
            console.error('Error al actualizar el carrito:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }


    };
    const updateQuantityProductInCart=async(req,res)=>{
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const { quantity } = req.body;
    
            // Verificar si el carrito existe
            const existingCart = await cartModel.findById(cartId);
            if (!existingCart) {
                return res.status(404).json({
                    ok: false,
                    message: 'El carrito no existe.',
                });
            }
    
            // Buscar el índice del producto en el carrito
            const productIndex = existingCart.productos.findIndex(item => item.producto.toString() === productId);
    
            // Verificar si el producto está en el carrito
            if (productIndex === -1) {
                return res.status(404).json({
                    ok: false,
                    message: 'El producto no está en el carrito.',
                });
            }
    
            // Actualizar la cantidad de ejemplares del producto
            existingCart.productos[productIndex].quantity = quantity;
    
            // Guardar el carrito actualizado
            await existingCart.save();
    
            return res.json({
                ok: true,
                message: 'Cantidad de ejemplares actualizada exitosamente.',
            });
        } catch (error) {
            console.error('Error al actualizar la cantidad de ejemplares del producto:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }

    };

    const deleteCart=async(req,res)=>{
        try {
            const cartId = req.params.cid;
    
            // Verificar si el carrito existe
            const existingCart = await cartService.getCartFindById(cartId);
            if (!existingCart) {
                return res.status(404).json({
                    ok: false,
                    message: 'El carrito no existe.',
                });
            }
    
            // Eliminar todos los productos del carrito
            existingCart.productos = [];
    
            // Guardar el carrito actualizado
            await existingCart.save();
    
            return res.json({
                ok: true,
                message: 'Todos los productos del carrito han sido eliminados.',
            });
        } catch (error) {
            console.error('Error al eliminar todos los productos del carrito:', error);
            return res.status(500).json({
                ok: false,
                error: 'Error interno del servidor.',
            });
        }

    };

    const showCart = async (req, res) => {
        try {
            const cartId = req.params.cid.trim().toString();
    
            // const carrito = await CartModel.findOne({ _id: cartId }).populate("productos.producto", { title: 1, description: 1, price: 1 }).lean();
            const carrito = await cartService.getCartOne(cartId);
    
            if (!carrito) {
                return res.status(404).json({
                    message: 'No se encontró ningún carrito con el ID proporcionado.'
                });
            }
    
            return res.json({
                message: 'Carrito encontrado',
                carrito,
            });
        } catch (error) {
            console.error("Error al mostrar el carrito:", error);
            return res.status(500).json({
                error: 'Error interno del servidor.'
            });
        }
    };
    

    module.exports={
        getAllCart,
        getCartById,
        getAllCartView,
        deleteProduct,
        updateProductsInCart,
        updateQuantityProductInCart,
        deleteCart,
        showCart,
    }