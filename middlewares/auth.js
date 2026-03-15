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
        if (req.session?.isAuthenticated && req.session.userId) {
            res.locals.user = {
                id: req.session.userId,
                username: req.session.username,
                email: req.session.email
            }
            return next();
        }

        if (req.xhr || req.headers.accept.indexOf('json') > -1)
            return res.status(401).json({error: 'Unauthorized'});

        return res.redirect('/login');
    };
}
