/**
 * Handles user registration by saving user data to the database.
 *
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {

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

        // Validate password length
        if (password.length < 6)
            return "⚠️  Password must be at least 6 characters long.";

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email))
            return '⚠️  Invalid email format.';

        return null;
    }


    return (req, res, next) => {
        const {username, email, password, confirmPassword} = req.body;

        // Validate registration data
        const validationError = validateRegistrationData(username, email, password, confirmPassword);
        if (validationError)
            return res.status(400).send(validationError);

        objRepo.UserModel.findOne({$or: [{username}, {email}]})
            .then(existingUser => {
                if (existingUser)
                    return res.status(400).send("⚠️  Username or email already exists.");
                const newUser = new objRepo.UserModel({username, email, password});
                return newUser.save();
            })
            .then(user => {
                if (user) {
                    console.log('✅  User registered successfully:', user.username);
                    req.session.successMessage = '✅ Successful registration! Now you can log in.';
                    return res.redirect('/login');
                }
            })
            .catch(err => {
                console.error('Error during registration process:', err);
                return next(err);
            });
    };

}
