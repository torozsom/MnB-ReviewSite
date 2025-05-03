/**
 * Renders an HTML page using the appropriate template.
 * @param objRepo
 * @param view
 * @param options
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view, options) => {
    return (req, res, next) => {
        // Merge options with session information
        const renderOptions = {
            ...options,
            isAuthenticated: req.session?.isAuthenticated || false
        };
        res.render(view, renderOptions);
    }
}
