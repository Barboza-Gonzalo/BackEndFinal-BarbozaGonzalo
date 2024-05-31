const passport = require("passport");
const local = require ("passport-local")
const GitHubStrategy = require ("passport-github2")
const userModel = require ("../DAO/models/users.model.js")
const {createHash , isValidPassword} = require ("../utils.js")


const LocalStrategy = local.Strategy 

const initializePassport = ()=>{

        passport.use("register", new LocalStrategy(
        {passReqToCallback:true , usernameField :"email"}, async (req,username,password,done)=>{
            const {first_name , last_name , email , age}= req.body;
            try{
                let user = await userModel.findOne({email:username});
                if(user){ return done(null,false);
                }
                const newUser = new userModel({ first_name, last_name, email, age, password:createHash(password) });
                let result = await userModel.create(newUser);
                return done(null,result)
            }catch(error){

                return done("error al obtener usuario")

            }
        }
    ));




        passport.use('github', new GitHubStrategy({
            clientID: "Iv23liVFTgsaNCiCgDhg",
            clientSecret: "795c641e383a197d7b0804e477091e79444efcec",
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        }, async (accessToken, refreshToken, profile, done) => {
            try {
                console.log(profile)
                let user = await userModel.findOne({ email: profile._json.email })
                if (!user) {
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: "",
                        age: 20,
                        email: profile._json.email,
                        password: ""
                    }
                    let result = await userModel.create(newUser)
                    done(null, result)
                }
                else {
                    done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }));
    





    passport.serializeUser((user, done) => {
        done(null, user._id)
    });


    passport.deserializeUser(async (id, done) => {
        let user = await userModel.findById(id)
        done(null, user)
    });


    passport.use('login', new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username })
            if (!user) {
                console.log("User doesn't exists")
                return done(null, false)
            }
            if (!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}



module.exports = initializePassport;