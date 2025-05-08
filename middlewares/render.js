/**
 * Renders an HTML page using the appropriate template.
 *
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

        // Add success message from session if it exists
        if (req.session && req.session.successMessage) {
            renderOptions.successMessage = req.session.successMessage;
            // Clear the message after use to prevent it from showing on subsequent requests
            delete req.session.successMessage;
        }

        res.render(view, renderOptions);
    };
}
