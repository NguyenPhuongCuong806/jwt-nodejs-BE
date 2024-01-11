import db from '../models/index';
import loginRegisterService from './loginRegisterService';

const getAllUser = async () => {
    try {
        let user = await db.User.findAll({
            attributes: ['id', 'username', 'email', 'phone', 'sex'],
            include: { model: db.Group, attributes: ['name', 'description'] }
        });
        if (user) {
            return {
                EM: 'get data success',
                EC: 0,
                DT: user
            }
        } else {
            return {
                EM: 'get data success',
                EC: 0,
                DT: []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'something wrong with server',
            EC: 1,
            DT: []
        }
    }
}

const createNewUser = async (data) => {
    try {
        let isEmailExist = await loginRegisterService.checkEmailExist(data.email);
        if (isEmailExist === true) {
            return {
                EM: 'The email is already exist',
                EC: 1,
                DT: "email"
            }
        }
        let isPhoneExist = await loginRegisterService.checkPhoneExist(data.phone);
        if (isPhoneExist === true) {
            return {
                EM: 'The phone number is already exist',
                EC: 1,
                DT: "phone"
            }
        }
        let hashPassword = loginRegisterService.hashUserPassword(data.password);

        await db.User.create({ ...data, password: hashPassword });
        return {
            EM: 'create new user success',
            EC: 0,
            DT: ""
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'something wrong with server',
            EC: 1,
            DT: []
        }
    }
}

const updateUser = async (data) => {
    try {
        if (!data.groupId) {
            return {
                EM: 'update error with groupId empty',
                EC: 1,
                DT: "group"
            }
        }
        let user = await db.User.findOne({
            where: {
                id: data.id
            }
        })
        if (user) {
            await user.update({
                username: data.username,
                address: data.address,
                sex: data.sex,
                groupId: data.groupId
            })
        } else {
            return {
                EM: 'user not found',
                EC: 2,
                DT: ""
            }
        }
        return {
            EM: 'update user success',
            EC: 0,
            DT: ""
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'something wrong with server',
            EC: 1,
            DT: []
        }
    }
}

const deleteUser = async (id) => {
    try {
        let user = await db.User.findOne({
            where: {
                id: id
            }
        })
        if (user) {
            await user.destroy();
            return {
                EM: 'delete user success',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'not found user',
                EC: 0,
                DT: []
            }
        }
    } catch (error) {
        console.log(error)
        return {
            EM: 'error from server',
            EC: 1,
            DT: []
        }
    }
}

const getUserwithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;

        let { count, rows } = await db.User.findAndCountAll({
            offset: offset,
            limit: limit,
            attributes: ['id', 'username', 'email', 'phone', 'sex', 'address',],
            include: { model: db.Group, attributes: ['name', 'description', 'id'] },
            order: [['id', 'DESC']]
        })

        let totalPages = Math.ceil(count / limit);

        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows
        }

        return {
            EM: 'get data success',
            EC: 0,
            DT: data
        }

    } catch (error) {
        console.log(error)
        return {
            EM: 'something wrong with server',
            EC: 1,
            DT: []
        }
    }
}

module.exports = {
    getAllUser, createNewUser, updateUser, deleteUser, getUserwithPagination
}