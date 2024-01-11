require("dotenv").config();
import jwt from 'jsonwebtoken';

const nonSecurePaths = ['/', '/login', '/register', '/logout'];

const createJWT = (payload) => {
    let token = null;
    try {
        token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRESIN
        });
    } catch (error) {
        console.log(error)
    }
    return token;
}

const verifyToken = (token) => {
    let decoded = null;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        console.log(error)
    }
    return decoded;

}

const extractToken = (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    let cookie = req.cookies;
    let tokenfromheader = extractToken(req);

    if ((cookie && cookie.jwt) || tokenfromheader) {
        let token = cookie && cookie.jwt ? cookie.jwt : tokenfromheader;
        let decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            req.token = token;
            next()
        } else {
            return res.status(401).json({
                EC: -1,
                DT: '',
                EM: 'not authentication the user'
            })
        }
    }

    else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'not authentication the user'
        })
    }
}

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === '/account') return next();

    if (req.user) {
        let email = req.user.email;
        let role = req.user.groupwithRole.Roles;
        let currentUrl = req.path;
        if (!role || role.length === 0) {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: 'you dont have permission to access this resource...'
            })
        }
        let canAccess = role.some(item => item.url === currentUrl || currentUrl.includes(item.url));
        if (canAccess === true) {
            next();

        } else {
            return res.status(403).json({
                EC: -1,
                DT: '',
                EM: 'you dont have permission to access this resource...'
            })
        }

    } else {
        return res.status(401).json({
            EC: -1,
            DT: '',
            EM: 'not authentication the user'
        })
    }
}

module.exports = {
    createJWT, verifyToken, checkUserJWT, checkUserPermission
}