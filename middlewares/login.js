/**
 * Handles user login by verifying credentials.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const bcrypt = require('bcrypt');


    /**
     * Validates that username and password are provided
     *
     * @param username - Username from request
     * @param password - Password from request
     * @returns {string|null} - Error message or null if valid
     */
    function validateLoginCredentials(username, password) {
        if (!username || !password)
            return 'Username and password are required.';

        return null;
    }


    /**
     * Sets up the user session after successful authentication
     *
     * @param req - Request object
     * @param res - Response object
     * @param next - Next middleware function
     * @param user - Authenticated user
     */
    function setupUserSession(req, res, next, user) {
        req.session.regenerate(err => {
            if (err) return next(err);

            req.session.userId = user._id;
            req.session.username = user.username;
            req.session.email = user.email;
            req.session.isAuthenticated = true;

            console.log('User logged in successfully:', user.username);

            req.session.save(err => {
                if (err) return next(err);
                return res.redirect('/');
            })
        });
    }


    /**
     * Authenticates a user by username and password
     *
     * @param res - Response object
     * @param next - Next middleware function
     * @param username - Username to authenticate
     * @param password - Password to verify
     */
    function authenticateUser(res, next, username, password) {
        objRepo.UserModel.findOne({username})
            .then(user => {
                if (!user)
                    return res.status(401).send('Invalid username or password.');

                return bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if (!isMatch)
                            return res.status(401).send('Invalid username or password.');
                        setupUserSession(res.req, res, next, user);
                    })
            })
            .catch(err => {
                console.error('Error during login process:', err);
                return next(err);
            });
    }


    return (req, res, next) => {
        const {username, password} = req.body;

        const validationError = validateLoginCredentials(username, password);
        if (validationError)
            return res.status(400).send(validationError);

        authenticateUser(res, next, username, password);
    };
}
