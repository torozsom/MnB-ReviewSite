/**
 * Handles user registration by saving user data to the database.
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    const UserModel = objRepo.UserModel;

    return (req, res, next) => {

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        if (!username || !email || !password || !confirmPassword)
            return res.status(400).send('⚠️ All fields are required.');

        if (password !== confirmPassword)
            return res.status(400).send('⚠️ Passwords do not match.');

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return res.status(400).send('⚠️ Invalid email format.');

        UserModel.findOne({$or: [{username}, {email}]})
            .then(existingUser => {
                if (existingUser)
                    return res.status(400).send('⚠️ Username or email already taken.');
                const newUser = new UserModel({username, email, password});
                return newUser.save();
            })
            .then(savedUser => {
                console.log('✅  User registered successfully:', savedUser.username);
                res.redirect('/');
            })
            .catch(next);
    };

};
