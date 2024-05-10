const userService=require('../services/user.services');
const { createHash,isValidPasswd }=require("../utils/encrypt");
const { generateJWT,SECRET_JWT }=require('../utils/jwt')

const getUserByEmail=async(req,res)=>{
    try {

        const { email, password}=req.body;
        console.log(email,password);
        if(email!=='adminCoder@coder.com'){
            const findUser=await userService.getUserByEmail(email);
            // const findUser=await userModel.findOne({email});
            if(!findUser) return res.json({
                message: 'usuario no registrado',
            });
    
            console.log('usuario encontrado:',findUser)
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
        return res.redirect('/api/v1/views/products');
    } catch (error) {
        console.log("🚀 ~ getUserByEmail ~ error:", error)

    }
};

const registerUser=async(req,res)=>{
    try {
        const {first_name,last_name,email,age,password,role}=req.body;
        console.log(req.body)
        // TODO validar todos los campos del body
        const pswHashed=await createHash(password);
        // const newUser=await userService.registerUser({
        //     first_name,last_name,email,age,role,
        //     password:pswHashed,
        // })
        const newUser=await userService.registerUser(req.body);
 
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
 
};

const getCurrentUser = async (req, res) => {
    try {
        const currentUser = req.user;
        res.json(currentUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports={
    getUserByEmail,
    registerUser,
    getCurrentUser,
}