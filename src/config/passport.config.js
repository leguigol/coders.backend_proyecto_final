// const passport=require('passport');
// const GithubStrategy=require('passport-github2');
// const local=require('passport-local');
// const userModel=require('../dao/model/user.model');
// const { createHash,isValidPasswd } = require('../utils/encrypt');
// const jwt = require("passport-jwt");
// const { SECRET_JWT } = require("../utils/jwt");

import passport from 'passport';
import GithubStrategy from 'passport-github2';
import local from 'passport-local';
import userModel from '../model/user.model.js';
import { createHash,isValidPasswd } from '../utils/encrypt.js';
import jwt from 'passport-jwt';
import { SECRET_JWT } from '../utils/jwt.js';

const localStrategy=local.Strategy
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const GITHUB_CLIENT_ID="f31926cb4d1ef0a2c3f0";
const GITHUB_CLIENT_SECRET="71955eb278373c2a5859a551985b0133acc31797";

   
const cookieExtractor = function(req) {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

export const initializePassport=()=>{

    passport.use(
        'github', 
        new GithubStrategy(
            {
                clientID: GITHUB_CLIENT_ID,
                clientSecret: GITHUB_CLIENT_SECRET,
                callbackURL: "http://localhost:5000/api/v1/sessions/github/callback"
            },
            async(accessToken, refreshToken, profile, done) => {
                console.log("🚀 ~ async ~ profile:", profile)
                try {
  
                    let user=await userModel.findOne({ email: profile._json?.email});
                    if(!user){
                        console.log('Usuario no registrado. Por favor, regístrese.');
                        return done(null, false, { message: 'Usuario no registrado. Por favor, regístrese.' });
                        // let addNewUser={
                        //     first_name: profile._json.name,
                        //     last_name: "",
                        //     email: profile._json?.email,
                        //     password:'',
                        //     role: 'user',
                        // };
                        // let newUser=await userModel.create(addNewUser);
                        // console.log('new user: ',newUser);
                        // done(null,newUser);
                    }else{
                        console.log('mostrando el user: ',user);
                        done(null, user); // ya existia el usuario                    
                    }
                } catch (error) {
                        done(error);
                }
            }
        )
    );

    passport.use(
        'register', 
        new localStrategy(
            {
                passReqToCallback: true, usernameField: 'email',
            },
            async(req,username,password,done)=>{

                console.log('****REGISTER STRATEGY');
                const {first_name,last_name,email,age}=req.body
                try {
                    let user=await userModel.findOne({email});
                    console.log("🚀 ~ async ~ user:", user)
                    if(user){
                        return done(null,false); //el usuario existe
                    }

                    const pswHashed=await createHash(password);

                    const addUser={
                        first_name,
                        last_name,
                        email,
                        age,
                        password: pswHashed,
                    };

                    const newUser=await userModel.create(addUser);
                    if(!newUser){
                        return res
                            .status(500)
                            .json({message: 'hay problemas en el registro del usuario'});
                    }

                    return done(null,newUser);

                } catch (error) {

                    return done(`error getting user ${error}`);
                    
                }
            }
        )
    );

    passport.use(
        'login',
        new localStrategy({
            usernameField: 'email'
        },async(username,password,done)=>{
            console.log('****LOGIN STRATEGY');
            try {
                const user=userModel.findOne({email:username});
                if(!user){
                    return done(null,false); // el usuario no existe
                }

                if(!isValidPasswd(password,user.password)){
                    return done(null,false); // las contraseñas no coinciden
                }

                return done(null,user);

            } catch (error) {
                
                return done(error);
            }
        })
    )

    passport.use(
        "jwt",
        new JWTStrategy(
          {
            jwtFromRequest: cookieExtractor, // extrae del header Authorization: Bearer atokenaskjehbdkajdhkahdka
            secretOrKey: SECRET_JWT,
          },
          async (jwtPayload, done) => {
            console.log(
              "🚀 ~ file: passport.config.js:19 ~ jwtPayload:",
              jwtPayload
            );
            try {
              return done(null, jwtPayload);
            } catch (error) {
              return done(error);
            }
          }
        )
    );

    
    passport.use(
        "current",
        new JWTStrategy(
            {
                jwtFromRequest: cookieExtractor,
                secretOrKey: SECRET_JWT,
            },
            async (jwtPayload, done) => {
                try {
                    const user = await userModel.findById(jwtPayload.sub);
                    if (!user) {
                        return done(null, false, { message: 'User not found' });
                    }
                    console.log('entre al current, user:',user);
                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user,done)=>{
        done(null,user._id)
    });

    passport.deserializeUser(async(id, done)=>{
        let user=await userModel.findById({_id: id});
        done(null,user);
    });
}

export default initializePassport;
// module.exports=initializePassport;