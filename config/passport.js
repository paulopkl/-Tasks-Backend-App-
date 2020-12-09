const { authSecret } = require('../.env');
const passport = require('passport'); // passport.user || passport.initialize || passport.authenticate
const passportJwt = require('passport-jwt'); // passportJwt.ExtractJwt || new passportJwt.Strategy()
const { Strategy, ExtractJwt } = passportJwt; 

module.exports = app => {
    
    const params = {
        secretOrKey: authSecret, // Secret 
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() // Where to get the jwt in the request
    }

    // const strategy = new Strategy({ secretOrKey: '', jwtFromRequest: '' }, (payload, done) => {
    const strategy = new Strategy(params, (payload, done) => {

        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(user => {
                if (user) {
                    done(null, { id: user.id, email: user.email }); // is Authenticate
                } else {
                    done(null, false); // Isn't Authenticate
                }
            })
            .catch(err => done(err, false)); // Isn't Authenticate
    });

    passport.use(strategy);

    return { 
        initialize: () => passport.initialize(), // Do anitialization
        authenticate: () => passport.authenticate('jwt', { session: false }),
        // Do authentication with ('estrategy', options)
    }
};