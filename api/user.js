const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => { // Gera Sal
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash)); 
        });
    }

    const save = (req, res) => {
        const { name, email } = req.body;
        const validation = /^([a-z]){1,}([a-z0-9._-]){1,}([@]){1}([a-z]){2,}([.]){1}([a-z]){2,}([.]?){1}([a-z]?){2,}$/i;

        if (!validation.test(email)) {
            return res.status(401).json({ message: 'Email não válido!' });
        }

        obterHash(req.body.password, function(hash) {
            const password = hash;
            // console.log(hash);

            const data = { name, email: email.toLowerCase(), password };
            // console.log(data);

            app.db('users')
                .insert(data)
                .then(_ => res.status(204).json(data))
                .catch(err => res.status(500).json(err));
        });
    }

    return { save };
};