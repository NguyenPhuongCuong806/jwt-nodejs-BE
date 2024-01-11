import db from '../models/index'

const createNewRole = async (role) => {
    try {
        let currentRoles = await db.Role.findAll({
            attributes: ['url', 'description'],
            raw: true
        })

        const persists = role.filter(({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url1 === url2));
        if (persists.length === 0) {
            return {
                EM: 'nothing to create',
                EC: 1,
                DT: []
            }
        }
        await db.Role.bulkCreate(persists);
        return {
            EM: `Create roles success ${persists.length} roles ...`,
            EC: 0,
            DT: []
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

const getAllRole = async () => {
    try {
        let data = await db.Role.findAll();
        return {
            EM: 'get All roles success',
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

const deleteRole = async (id) => {
    try {
        let role = await db.Role.findOne({
            where: {
                id: id
            }
        })
        if (role) {
            await role.destroy();
            return {
                EM: 'delete role success',
                EC: 0,
                DT: []
            }
        } else {
            return {
                EM: 'not found role',
                EC: 1,
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

const getrolebygroupId = async (id) => {
    try {
        if (!id) {
            return {
                EM: 'not found any roles',
                EC: 1,
                DT: []
            }
        }
        let data = await db.Group.findOne({
            where: {
                id: id
            },
            attributes: ['id', 'name', 'description'],
            include: [{ model: db.Role, attributes: ['id', 'url', 'description'], through: { attributes: [] } }]

        });
        return {
            EM: 'get roles by group success',
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

const assignRoleToGroups = async (data) => {
    try {
        await db.Group_Role.destroy({
            where: {
                groupId: +data.groupId
            }
        })
        await db.Group_Role.bulkCreate(data.groupRoles)
        return {
            EM: 'get roles by group success',
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
    createNewRole, getAllRole, deleteRole, getrolebygroupId, assignRoleToGroups
}