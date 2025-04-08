/**
 * Renders an HTML page using the appropriate template.
 * @param objRepo
 * @param view
 * @param options
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view, options) => {
    return (req, res, next) => {
        res.render(view, options);
    }
}