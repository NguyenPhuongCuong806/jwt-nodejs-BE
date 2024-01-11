import express from "express";
import homeController from "../controller/homeController"
import apiController from "../controller/apiController"

const router = express.Router();

/**
 * 
 * @param {*} app 
 */

const initWebRoutes = (app) => {
    router.get("/", homeController.handleHelloword)
    router.get("/user", homeController.handleUser)
    router.post("/users/create-user", homeController.handleCreateUser)
    router.get("/delete-user/:id", homeController.handleDeleteUser)

    router.get("/api/test-api", apiController.testApi)

    return app.use("/", router);
}

export default initWebRoutes;