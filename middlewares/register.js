/**
 * Handles user registration by saving user data to the database.
 *
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    const UserModel = objRepo.UserModel;


    /**
     * Validates registration data
     *
     * @param username - Username from request
     * @param email - Email from request
     * @param password - Password from request
     * @param confirmPassword - Confirm password from request
     * @returns {string|null} - Error message or null if valid
     */
    function validateRegistrationData(username, email, password, confirmPassword) {
        // Check required fields
        if (!username || !email || !password || !confirmPassword)
            return '⚠️  All fields are required.';

        // Check password match
        if (password !== confirmPassword)
            return '⚠️  Passwords do not match.';

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return '⚠️  Invalid email format.';

        return null;
    }


    /**
     * Checks if a user with the same username or email already exists
     *
     * @param username - Username to check
     * @param email - Email to check
     * @returns {Promise<void>} - Promise that resolves if no existing user is found
     */
    function checkExistingUser(username, email) {
        return UserModel.findOne({$or: [{username}, {email}]})
            .then(existingUser => {
                if (existingUser)
                    throw new Error('⚠️  Username or email already taken.');
            });
    }


    /**
     * Creates and saves a new user
     *
     * @param username - Username for the new user
     * @param email - Email for the new user
     * @param password - Password for the new user
     * @returns {Promise<*>} - Promise resolving to the saved user
     */
    function createUser(username, email, password) {
        const newUser = new UserModel({username, email, password});
        return newUser.save()
            .then(savedUser => {
                console.log('✅  User registered successfully:', savedUser.username);
                return savedUser;
            });
    }


    return (req, res, next) => {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;

        // Validate registration data
        const validationError = validateRegistrationData(username, email, password, confirmPassword);
        if (validationError)
            return res.status(400).send(validationError);

        // Check for existing user and create new user if none exists
        checkExistingUser(username, email)
            .then(() => createUser(username, email, password))
            .then(() => {
                res.redirect('/');
            })
            .catch(err => {
                if (err.message.startsWith('⚠️')) {
                    return res.status(400).send(err.message);
                }
                next(err);
            });
    };

}
