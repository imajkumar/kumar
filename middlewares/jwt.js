const jwt = require("express-jwt");
const apiResponse = require("../helpers/apiResponse");
const secret = process.env.JWT_SECRET;

// const authenticate = jwt({
// 	secret: secret,
//     algorithms: ['HS256']
// });
const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403);
            }

            req.user = user;
            next();
        });
    } else {
        return apiResponse.unauthorizedResponse(res, "Unauthorized Access contact Admin");

        //res.sendStatus(401);
    }
};


module.exports = authenticate;