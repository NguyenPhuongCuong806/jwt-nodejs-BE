import userService from "../service/userService"

const handleHelloword = (req, res) => {
    return res.render("home.ejs");
}

const handleUser = async (req, res) => {

    console.log('Cookies: ', req.cookies)


    let userlist = await userService.getUserList()
    return res.render("user.ejs", { userlist });
}

const handleCreateUser = (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    userService.createNewUser(email, password, username)
    res.redirect("/user");

}

const handleDeleteUser = (req, res) => {
    userService.deleteUser(req.params.id);
    res.redirect("/user");
}

module.exports = {
    handleHelloword, handleUser, handleCreateUser, handleDeleteUser
}