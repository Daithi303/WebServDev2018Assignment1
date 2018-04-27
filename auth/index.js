import passport from 'passport';
import passportJWT from 'passport-jwt';
import Model from './../api/model/model';
import dotenv from 'dotenv';

dotenv.config();

const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.jwtSecret;
jwtOptions.passReqToCallback = true;  
const strategy = new JWTStrategy(jwtOptions, async function(req, payload, next) {
    
    
 if(req.originalUrl.startsWith("/api/user")){
         if (req.method == "GET") {
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
    }
   
    if (req.method == "PUT") {
        if(req.params.userId){
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                if((user.userName==req.params.userId)|| user.admin==true){
                    next(null, user);
                }else{
                    next(null, false);    
                }
            } else {
                next(null, false);
            }
        }
    }
    
    if (req.method == "DELETE") {
        if(req.params.userId){
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                if((user.userName==req.params.userId)|| user.admin==true){
                    next(null, user);
                }else{
                    next(null, false);    
                }
            } else {
                next(null, false);
            }
        }
    }
     
 }
 
 if(req.originalUrl.startsWith("/api/device")){
     
    if (req.method == "GET") {
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                if(req.params.deviceId){
                const deviceArr = await Model.Device.find({deviceName: req.params.deviceId});  
                 if(deviceArr.length>0){
                if((user.admin==true)||(JSON.stringify(deviceArr[0].registeredOwner)===JSON.stringify(user.userName))){
                    next(null, user);
                }else{
                    next(null, false);    
                }}else{
                 next(null, false); 
                }
                }else{
                   
                if(user.admin==true){
                    
                    next(null, user);
                }else{
                    next(null, false);    
                }                    
                }
            } else {
                next(null, false);
            }
    }
    
    if (req.method == "PUT") {
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                if((req.params.deviceId)&& !(req.params.journeyId) && (req.originalUrl.includes('registeredOwner'))){
                next(null, user);
                }
                
                if((req.params.deviceId) && (req.params.journeyId) && !(req.originalUrl.includes('registeredOwner'))){
                const deviceArr = await Model.Device.find({deviceName:req.params.deviceId});  
                 if(deviceArr.length>0){
                if((user.admin==true)||(JSON.stringify(deviceArr[0].registeredOwner)===JSON.stringify(user.userName))){
                    next(null, user);
                }else{
                    next(null, false);    
                }}else{
                    next(null, false); 
                }
                }
                
                if((req.params.deviceId) && !(req.params.journeyId) && !(req.originalUrl.includes('registeredOwner'))){
                const deviceArr = await Model.Device.find({deviceName: req.params.deviceId});  
                 if(deviceArr.length>0){
                if((user.admin==true)||(JSON.stringify(deviceArr[0].registeredOwner)===JSON.stringify(user.userName))){
                    next(null, user);
                }else{
                    next(null, false);    
                }}else{
                    next(null, false); 
                }
                }
                
                
            } else {
                next(null, false);
            }
    }
    
    if (req.method == "POST") {
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                if(req.params.deviceId){
                const deviceArr = await Model.Device.find({deviceName: req.params.deviceId});  
                if(deviceArr.length>0){
                if((user.admin==true)||(JSON.stringify(deviceArr[0].registeredOwner)===JSON.stringify(user.userName))){
                    next(null, user);
                }else{
                    next(null, false);    
                }}else{
                    next(null, false); 
                }
                }else{
                if(user.admin==true){
                    next(null, user);
                }else{
                    next(null, false);    
                }                    
                }
            } else {
                    next(null, false);
            }
    }
    
    if (req.method == "DELETE") {
            const userArr = await Model.User.find({userName: payload});
            var user = userArr[0];
            if (user) {
                if(user.admin==true){
                    next(null, user);
                }else{
                    next(null, false);    
                }
            } else {
                next(null, false);
            }
    }
 }
});

passport.use(strategy);

export default passport;