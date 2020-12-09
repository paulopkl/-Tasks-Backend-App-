const { authSecret } = require('../.env'); // "[#$$#](Paulo_Developer)[#$$#]"
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    
    const signin = async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            // return res.status(400).json({ message: 'Dados Incorretos!' });
            return res.status(400).send('Dados Incorretos!');
        }

        const user = await app.db('users')
            .whereRaw("LOWER(email) = LOWER(?)", email)
            .first(); // get the first element

        // console.log(user);

        if (user) {  // If any user returns
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    // return res.status(401).json({ message: 'Error, invalid password!', err });
                    return res.status(401).send('Error, invalid password!');
                }

                const payload = { id: user.id }; // { id: [user id] }

                res.json({
                    name: user.name,
                    email: user.email,
                    token: jwt.encode(payload, authSecret),
                    // token: jwt.encode({ id: 6 }, "seu authSecret em string no .env")
                });
            });
        } else {
            res.status(400).json({ message: 'User Not Found!' });
            // res.status(400).send('User Not Found!');
        }
    };
    
    return { signin }
};