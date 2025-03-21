/**
 * Logs out the user by destroying the session.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        return next();
    }
}