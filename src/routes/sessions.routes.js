const { Router }=require('express');
const userModel =require('../dao/model/user.model');
const productModel=require('../dao/model/products.model');
const { createHash,isValidPasswd}=require('../utils/encrypt');
const passport = require("passport");

const router=Router();

router.post('/register',async(req,res)=>{
    try {
        console.log('Contenido del Body:',req.body);
        const {first_name,last_name,email,password,role='usuario'}=req.body;

        const pswHashed=await createHash(password);

        const addUser={
            first_name,
            last_name,
            email,
            password: pswHashed,
            role,
        };

        const newUser=await userModel.create(addUser);

        if(!newUser){
            return res.status(500).json({
                message: 'Hubo un error creando el usuario',
            })
        }
        req.session.user={email, first_name, last_name,role};
        return res.redirect('/api/v1/views/login');
    } catch (error) {
        console.log("🚀 ~ router.post ~ error:", error)
        
    }
})

router.post ('/login',async(req,res)=>{

    try {
        const { email, password}=req.body;
        const session=req.session        
        console.log("🚀 ~ router.get ~ session:", session)
        if(email!=='adminCoder@coder.com'){
            const findUser=await userModel.findOne({email});
            if(!findUser) return res.json({
                message: 'usuario no registrado',
            });
    
            const isValidComparedPsw=await isValidPasswd(password,findUser.password);
            if(!isValidComparedPsw){
                return res.json({ message: 'Contraseña incorrecta'});
            }

            // if(findUser.password!==password) return res.json({
            //     message: 'Contraseña incorrecta',
            // })
    
            req.session.user={
                ...findUser,
            };    
        }else{
            if(password!=='adminCod3r123') return res.json({
                message: 'Contraseña incorrecta',
            })
            req.session.user={
                _doc: {
                    first_name: '',
                    last_name: '',
                    email: 'adminCoder@coder.com',
                    password: '',
                    role: 'admin,'    
                }
            };  
        }

        console.log('usuario logueado:',req.session.user);

        return res.redirect('/api/v1/views/products');
    } catch (error) {

    }
})

// router.get('/logout',async(req,res)=>{
    
//     req.session.destroy((err)=>{
//         if(!err) return res.redirect("/api/v1/views/login");
//             return res.send({ message: 'problemas en el logout', body: err})
//     });
// });

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');    
    res.redirect("/api/v1/views/login");
});

router.get(
    "/github",
    passport.authenticate("github", { scope: ["user:email"] }),
    async (req, res) => {}
);

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: "/api/v1/views/register" }),
    async (req, res) => {
      try {
        const newUserObject = {
              _doc: {
                email: req.user.email,
                role: req.user.role,
              }
          };
        // console.log('req..user;',newUserObject);
        req.session.user = newUserObject;
        return res.redirect('/api/v1/views/products');
      } catch (error) {
        console.log("🚀 ~ file: session.routes.js:115 ~ error:", error);
      }
    }
);

module.exports=router;