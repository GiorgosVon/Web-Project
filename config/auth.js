module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Please log in to view this page");
        res.redirect("/");
    },
    ensureGuest: function (req, res, next) {
        if (req.isAuthenticated()) {
            res.redirect("/dashboard")
        } else {
            return next();
        }
    },
    ensureAdmin: function (req, res, next) {
        if (req.user.name === 'admin') {
            return next();
        } else {
            req.flash('danger', 'Please Login as admin');
            res.redirect('/');
        }
    }




}

