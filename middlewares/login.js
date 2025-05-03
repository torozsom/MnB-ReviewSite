/**
 * Handles user login by verifying credentials.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

    const UserModel = objRepo.UserModel;

    return (req, res, next) => {

        const username = req.body.username;
        const password = req.body.password;

        if (!username || !password)
            return res.status(400).send('⚠️ Username and password are required.');

        UserModel.findOne({username})
            .then(user => {
                if (!user)
                    return res.status(400).send('⚠️ Invalid username or password.');

                if (user.password !== password)
                    return res.status(400).send('⚠️ Invalid username or password.');

                req.session.userId = user._id;
                req.session.username = user.username;
                req.session.email = user.email;
                req.session.isAuthenticated = true;

                console.log('✅ User logged in successfully:', user.username);
                res.redirect('/');
            })
            .catch(next);
    };

};
