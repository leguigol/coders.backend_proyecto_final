const { Router }=require('express');

const userModel=require('../dao/model/user.model');
const { createHash, isValidPasswd }=require("../utils/encrypt");
const { generateJWT,SECRET_JWT }=require('../utils/jwt')
const passport=require('passport');
const handlePolicies = require('../middleware/handle-policies.middleware');

const router=Router();

router.post ('/login',async(req,res)=>{

    try {
        const { email, password}=req.body;
        // const session=req.session        
        // console.log("🚀 ~ router.get ~ session:", session)
        if(email!=='adminCoder@coder.com'){
            const findUser=await userModel.findOne({email});
            if(!findUser) return res.json({
                message: 'usuario no registrado',
            });
    
            const isValidComparedPsw=await isValidPasswd(password,findUser.password);
            if(!isValidComparedPsw){
                return res.json({ message: 'Contraseña incorrecta'});
            }

            const signUser={
                email,
                role: findUser.role,
                id: findUser._id,
            }

            req.session.user={
                ...findUser,
            };  

            const token=await generateJWT({ ...signUser });
            console.log("🚀 ~ router.post ~ token:", token)
    
            // Establece la cookie con el token JWT
            res.cookie('jwt', token, { httpOnly: true });
            return res.redirect('/api/v1/views/products');
            // req.session.user={
            //     ...findUser,
            // };    
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

            // console.log('usuario logueado:',req.session.user);

        return res.redirect('/api/v1/views/products');
    } catch (error) {

    }
})

router.post('/register',async(req,res)=>{
    try {
       const {first_name,last_name,email,age,password,role}=req.body;
       // TODO validar todos los campos del body
       const pswHashed=await createHash(password);
       const newUser=await userModel.create({
           first_name,last_name,email,age,role,
           password:pswHashed,
       })

       if(!newUser){
        return res.json({
            message: 'problemas en el registro del usuario',
        })
       }

       return res.json({
           message: 'usuario creado', user: newUser 
       })
    } catch (error) {
       console.log("🚀 ~ router.post ~ error:", error)
       
    }
})

router.get('/current',handlePolicies("USER") ,async (req, res) => {
    res.json(req.user);
});

module.exports=router;