var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var bcrypt = require("bcrypt-nodejs");

// google strategy
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var cookieParser = require('cookie-parser');
var session = require('express-session');

module.exports = function(app, models){

    var userModel = models.userModel;

    app.get('/api/user', findUserByUsername);
    app.get('/api/user/:uid', findUserById);
    app.put('/api/user/:uid', updateUser);
    app.delete('/api/user/:uid', deleteUser);
    app.get('/api/alluser', findAllUsers);

    /*Config Passport*/
    app.post('/api/login', passport.authenticate('LocalStrategy'), login);
    app.post('/api/logout', logout);
    app.get ('/api/loggedin', loggedin);
    app.post('/api/register', register);

    app.get('/auth/google',
        passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: '/#!/profile',
            failureRedirect: '/#!/login'
        }));

    // google oauth

    var googleConfig = {
        clientID: process.env.GOOGLE_CLIENT_ID || '438711763187-m8tbst1rpdbpo2k2vkfnp4g57kei4qlm.apps.googleusercontent.com',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '9GS_5yXBRMjnhqIvtHegzabA',
        callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback'
    };

    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    function googleStrategy(token, refreshToken, profile, done) {

        // console.log("profile: " + profile);

        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function(user) {
                    // console.log("user: " + user);
                    if(user) {
                        return done(null, user);
                    } else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            username:  emailParts[0],
                            password: "0",
                            firstName: profile.name.givenName,
                            lastName:  profile.name.familyName,
                            email:     email,
                            google: {
                                id:    profile.id,
                                token: token
                            }
                        };
                        return userModel
                            .createUser(newGoogleUser);
                    }
                },
                function(err) {
                    if (err) { return done(err); }
                }
            )
            .then(
                function(user){
                    return done(null, user);
                },
                function(err){
                    if (err) { return done(err); }
                }
            );
    }

    passport.use('LocalStrategy', new LocalStrategy(localStrategy));
    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);

    // localStrategy function
    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function(user) {
                    // console.log(user);
                    if (user === null || user === undefined) {
                        return done(null, false, {message: 'User not found!'})
                    } else if(bcrypt.compareSync(password, user.password)) {
                        // console.log("User found!");
                        return done(null, user);
                    } else {
                        console.log("User not found!");
                        return done(null, false, {message: 'Username and password does not match!'});
                    }
                },
                function(err) {
                    if (err) {
                        console.log("error: " + err);
                        return done(err);
                    }
                }
            );
    }

    // session cookie functions
    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function(user){
                    done(null, user);
                },
                function(err){
                    done(err, null);
                }
            );
    }

    // passport function implementation
    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logout();
        res.sendStatus(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        // console.log(user);
        userModel
            .createUser(user)
            .then(
                function (user) {
                    req.login(user, function (status) {
                        res.send(status);
                    })
                }
            )
    }

    /*API implementation*/

    function createUser(req, res) {

        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        // console.log(user);

        userModel
            .createUser(user)
            .then(
                function (newUser) {
                    res.json(newUser);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            );

    }

    function findUserByUsername (req, res) {

        var username = req.query.username;

        userModel
            .findUserByUsername(username)
            .then(
                function (users) {
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            )
    }

    function findAllUsers(req, res) {
        userModel
            .findAllUser()
            .then(
                function (users) {
                    // console.log(users);
                    res.json(users);
                },
                function (error) {
                    res.sendStatus(404).send(error);
                }
            )
    }

    function findUserById(req, res) {

        var params = req.params;

        if(params.uid){
            userModel
                .findUserById(params.uid)
                .then(
                    function (user){
                        // console.log(user);
                        if(user){
                            res.json(user);
                        } else {
                            user = null;
                            res.send(user);
                        }
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        }

    }

    function updateUser(req,res) {
        var uid = req.params.uid;
        var user = req.body;
        userModel
            .updateUser(uid, user)
            .then(
                function (user){
                    res.json(user)
                },
                function (error){
                    res.sendStatus(400).send(error);
                }
            );

    }

    function deleteUser(req,res) {
        var uid = req.params.uid;
        if(uid){
            userModel
                .deleteUser(uid)
                .then(
                    function (status){
                        res.sendStatus(200);
                    },
                    function (error){
                        res.sendStatus(400).send(error);
                    }
                );
        } else{
            // Precondition Failed. Precondition is that the user exists.
            res.sendStatus(412);
        }

    }
};
