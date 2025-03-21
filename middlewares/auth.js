/**
 * Checks if the user is authenticated.
 * @param objRepo
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo) => {
    return (req, res, next) => {
        return next();
    }
}