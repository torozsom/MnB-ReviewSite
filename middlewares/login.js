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
            return '⚠️  Username and password are required.';

        return null;
    }


    /**
     * Authenticates a user by username and password
     *
     * @param username - Username to authenticate
     * @param password - Password to verify
     * @returns {Promise<*>} - Promise resolving to the authenticated user
     */
    async function authenticateUser(username, password) {
        const user = await objRepo.UserModel.findOne({username});
        if (!user)
            throw new Error('⚠️  Invalid username or password.');

        const match = await bcrypt.compare(password, user.password);
        if (!match)
            throw new Error('⚠️  Invalid username or password.')

        return user;
    }


    /**
     * Sets up the user session after successful authentication
     *
     * @param req - Request object
     * @param user - Authenticated user
     */
    function setupUserSession(req, user) {
        req.session.userId = user._id;
        req.session.username = user.username;
        req.session.email = user.email;
        req.session.isAuthenticated = true;

        console.log('✅  User logged in successfully:', user.username);
    }


    return async (req, res, next) => {
        const username = req.body.username;
        const password = req.body.password;

        // Validate login credentials
        const validationError = validateLoginCredentials(username, password);
        if (validationError)
            return res.status(400).send(validationError);

        // Authenticate user
        try {
            const user = await authenticateUser(username, password);
            if (user)
                setupUserSession(req, user);
            res.redirect('/');
        } catch (err) {
            console.error('Error authenticating user:', err);
            next(err);
        }

    };

}
