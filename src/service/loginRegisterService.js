import db from '../models/index';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import { getGroupWithRole } from './JWTService'
import { createJWT } from '../middleware/JWTAction'

require('dotenv').config();

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (password) => {
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
}


const checkEmailExist = async (email) => {
    let user = await db.User.findOne({
        where: { email: email }
    })
    if (user) {
        return true;
    }
    return false;
}

const checkPhoneExist = async (phone) => {
    let user = await db.User.findOne({
        where: { phone: phone }
    })
    if (user) {
        return true;
    }
    return false;
}

const registerNewUser = async (rawUserData) => {
    try {
        let isEmailExist = await checkEmailExist(rawUserData.email);
        if (isEmailExist === true) {
            return {
                EM: 'The email is already exist',
                EC: 1
            }
        }
        let isPhoneExist = await checkPhoneExist(rawUserData.phone);
        if (isPhoneExist === true) {
            return {
                EM: 'The phone number is already exist',
                EC: 1
            }
        }
        let hashPassword = hashUserPassword(rawUserData.password);

        await db.User.create({
            email: rawUserData.email,
            username: rawUserData.username,
            password: hashPassword,
            phone: rawUserData.phone,
            groupId: 4
        })
        return {
            EM: 'A user is created successfully!',
            EC: 0
        }
    } catch (error) {
        return {
            EM: 'Something wrongs is service...',
            EC: -2
        }
    }
}

const checkPassword = (inputpassword, hashPassword) => {
    return bcrypt.compareSync(inputpassword, hashPassword)
}

const handleUserLogin = async (rawData) => {
    try {

        let user = await db.User.findOne({
            where: {
                [Op.or]: [
                    { email: rawData.valueLogin },
                    { phone: rawData.valueLogin }
                ]
            }
        })
        if (user) {
            let isCorrectPassword = checkPassword(rawData.password, user.password);
            if (isCorrectPassword === true) {
                // let token = 

                let groupwithRole = await getGroupWithRole(user);
                let payload = {
                    email: user.email,
                    groupwithRole,
                    username: user.username,
                }
                let token = createJWT(payload)
                return {
                    EM: 'ok',
                    EC: 0,
                    DT: {
                        access_token: token,
                        data: groupwithRole,
                        email: user.email,
                        username: user.username
                    }
                }
            }
        }
        return {
            EM: 'The phone number/email or password is not exist',
            EC: 1,
            DT: ''
        }

    } catch (error) {
        return {
            EM: 'Something wrongs is service...',
            EC: -2
        }
    }
}

module.exports = {
    registerNewUser, handleUserLogin, hashUserPassword, checkEmailExist, checkPhoneExist
}