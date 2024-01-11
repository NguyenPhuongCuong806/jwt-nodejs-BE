import express from "express";
import apiController from "../controller/apiController"
import userController from '../controller/userController'
import groupController from '../controller/groupController';
import roleController from '../controller/roleController';
import { checkUserJWT, checkUserPermission } from '../middleware/JWTAction'
const router = express.Router();

/**
 * 
 * @param {*} app 
 */






const initAPIRoutes = (app) => {

    router.all('*', checkUserJWT, checkUserPermission)

    router.post("/register", apiController.handleRegister)
    router.post("/login", apiController.handleLogin)
    router.post("/logout", apiController.handleLogout)

    router.get('/account', userController.getUserAccount)

    router.get("/user/show", userController.read);
    router.post("/user/create", userController.create);
    router.delete("/user/delete", userController.deletes);
    router.put("/user/update", userController.update);

    router.get("/role/show", roleController.read);
    router.post("/role/create", roleController.create);
    router.delete("/role/delete", roleController.deletes);
    router.put("/role/update", roleController.update);
    router.get("/role/by-group/:groupId", roleController.getrolebygroup);
    router.post("/role/assign-to-group", roleController.assignRoleToGroup);


    router.get("/group/show", groupController.read);

    return app.use("/api/", router);
}

export default initAPIRoutes;