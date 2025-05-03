/**
 * Logs out the user by destroying the session.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return next(err);
                }
                return res.redirect('/');
            });
        } else return res.redirect('/');
    };
}
