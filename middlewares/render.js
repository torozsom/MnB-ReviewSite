/**
 * Renders an HTML page using the appropriate template.
 * @param objRepo
 * @param view
 * @returns {function(*, *, *): *}
 */
module.exports = (objRepo, view, title, stylesheet, showNav) => {
    return (req, res, next) => {
        res.render(view, {title, stylesheet, showNav});
    }
}