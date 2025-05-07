/**
 * Checks if the user is authenticated.
 * If the user is authenticated, it calls the next middleware.
 * If the user is not authenticated, it redirects to the login page.
 *
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        if (req.session?.isAuthenticated)
            return next();
        else
            return res.redirect('/login');
    };
}
