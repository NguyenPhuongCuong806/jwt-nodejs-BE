import mysql from 'mysql2/promise';
import bluebird from 'bluebird';
import bcrypt from 'bcryptjs';
import db from '../models/index'


const salt = bcrypt.genSaltSync(10);


const hashUserPassword = (password) => {
    let hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
}

const createNewUser = async (email, password, username) => {
    let hashPassword = hashUserPassword(password);
    try {
        await db.User.create({
            username: username,
            email: email,
            password: hashPassword
        })
    } catch (error) {
        console.log('check error', error)
    }


}

const getUserList = async () => {

    // const connection = await mysql.createConnection({
    //     host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird
    // });
    let user = [];
    user = await db.User.findAll();

    // try {
    //     const [rows, fields] = await connection.execute('select * from user');
    //     return rows;
    // } catch (error) {
    //     console.log('check error', error)
    // }
    return user;

}

const deleteUser = async (id) => {
    // DELETE FROM user WHERE id = 'Alfreds Futterkiste';
    // const connection = await mysql.createConnection({
    //     host: 'localhost', user: 'root', database: 'jwt', Promise: bluebird
    // });
    await db.User.destroy({
        where: {
            id: id
        }
    })
    // try {
    //     const [rows, fields] = await connection.execute('DELETE FROM user WHERE id = ?', [id]);
    //     return rows;
    // } catch (error) {
    //     console.log('check error', error)
    // }
}

module.exports = {
    createNewUser, getUserList, deleteUser
}