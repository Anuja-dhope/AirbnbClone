const User=require("../model/user");

//SignUp 
module.exports.signUpForm=(req,res)=>{
    res.render("./users/SignUp.ejs");
};
module.exports.signUp=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
    let newUser=new User({username,email});
    let registerdUser=await User.register(newUser,password);
    req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to WanderLust!!!");
        res.redirect("/listings");
    })
    }catch(e){
        req.flash("error","User Already Exists:(");
        res.redirect("/signUp");
    }
};

//Login
module.exports.loginForm=(req,res)=>{
    res.render("./users/Login.ejs");
};
module.exports.login=async(req,res)=>{
    let{username}=req.body;
    req.flash("success",`Welcome back to WanderLust ${username}!!!`);
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout
module.exports.logOut=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
    });
    req.flash("success","Logged out successfully...!");
    res.redirect("/listings");
};