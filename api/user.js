const bcrypt = require('bcrypt-nodejs');

module.exports = app => {
    
    const obterHash = (password, callback) => {
        bcrypt.genSalt(10, (err, salt) => { // Gera Sal
            bcrypt.hash(password, salt, null, (err, hash) => callback(hash)); 
        });
    }

    const save = (req, res) => {
        const { name, email } = req.body;

        obterHash(req.body.password, function(hash) {
            const password = hash;
            console.log(hash);

            const data = { name, email, password };
            console.log(data);

            app.db('users')
                .insert(data)
                .then(_ => res.status(204).json(data))
                .catch(err => res.status(400).json(err));
        });
    }

    return { save };
};