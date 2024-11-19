const { validateToken } = require("../services/auth");

function checkAuthCookie(cookieName) {
    return (req, res, next) => {
        const token = req.cookies[cookieName];
        if(!token) {
            return next();
        }

        try {
            const userPayload = validateToken(token);
            req.user = userPayload;
        } catch (error) {}

        next();
    }
}

module.exports = {checkAuthCookie}