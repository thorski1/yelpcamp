var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose =require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Campground = require("./models/campground"),
    seedDB = require("./seeds"),
    User = require("./models/user"),
    Comment = require("./models/comment");

//REQUIRING ROUTES
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes = require("./routes/index");

//mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true});    
mongoose.set('useFindAndModify', false);
mongoose.connect("mongodb+srv://thorski1:golfhead86@cluster0-oo5a6.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true})
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB() //seed the database


//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I love my family",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser =req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, function() {
    console.log("YelpCamp Server Has Started!");
})