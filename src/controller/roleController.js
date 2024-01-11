import roleAPIService from '../service/roleAPIService'

const read = async (req, res) => {
    try {

        let data = await roleAPIService.getAllRole();
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from sever',
            EC: '-1',
            DT: '',
        })
    }
}

const create = async (req, res) => {
    try {
        let data = await roleAPIService.createNewRole(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from sever',
            EC: '-1',
            DT: '',
        })
    }
}

const update = async (req, res) => {
    try {
        let data = await userAPIService.updateUser(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from sever',
            EC: '-1',
            DT: '',
        })
    }
}

const deletes = async (req, res) => {
    try {
        let data = await roleAPIService.deleteRole(req.body.id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from sever',
            EC: '-1',
            DT: '',
        })
    }
}


const getrolebygroup = async (req, res) => {
    try {
        let id = req.params.groupId

        let data = await roleAPIService.getrolebygroupId(id);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from sever',
            EC: '-1',
            DT: '',
        })
    }
}

const assignRoleToGroup = async (req, res) => {
    try {
        let data = await roleAPIService.assignRoleToGroups(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT,
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            EM: 'error from sever',
            EC: '-1',
            DT: '',
        })
    }
}

module.exports = {
    read, update, deletes, create, getrolebygroup, assignRoleToGroup
}