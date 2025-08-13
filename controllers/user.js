const User = require('../models/user.js');



module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signup = async(req,res)=>{  
      try{
         let {username, email, password} = req.body;
       const newUser = new User({username,email})
       let registeredUser = await User.register(newUser, password)
       req.login(registeredUser,(err) => {
        if(err){
            return next(err);
        }
       req.flash('success', 'You are registered!')
       res.redirect('/listings')
       })
       
      }catch(err){
        req.flash('error', err.message)
        res.redirect('/signup')
      }  
       
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")

}


module.exports.login = async(req,res) => {
    req.flash('success', 'You are logged in!')
    res.redirect(res.locals.redirectUrl || '/listings');
}

module.exports.logout =  (req,res,next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash('success', 'You are logged out!')
    // res.redirect('/listings')
    res.redirect('/listings')

    })  
}


