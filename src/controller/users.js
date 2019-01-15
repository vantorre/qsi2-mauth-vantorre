const omit = require('lodash.omit');
const {Users} = require('../model');
const logger = require('../logger');

const createUser = ({firstName, lastName, email, password}) =>
    Users.create({
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        hash: password
    }).then(user =>
        omit(
            user.get({
                plain: true
            }),
            Users.excludeAttributes
        )
    );


const updateUser = (userId, {firstName, lastName, email, password}) =>
    Users.update({
        id: userId,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        hash: password
    },{where: {id: userId}}).then(user =>
        omit(
            // user.get({
            //     plain: true
            // }),
            // Users.excludeAttributes
        )
    ).catch(err => {
        logger.error(`💥 Failed to update user : ${err.stack}`);
    });

const loginUser = ({email, password}) =>
    Users.findOne({
        where: {
            email
        }
    }).then(user =>
        user && !user.deletedAt
            ? Promise.all([
                omit(
                    user.get({
                        plain: true
                    }),
                    Users.excludeAttributes
                ),
                user.comparePassword(password)
            ])
            : Promise.reject(new Error('UNKOWN OR DELETED USER'))
    );

const getUser = ({id}) =>
    Users.findOne({
        where: {
            id
        }
    }).then(user =>
        user && !user.deletedAt
            ? omit(
            user.get({
                plain: true
            }),
            Users.excludeAttributes
            )
            : Promise.reject(new Error('UNKOWN OR DELETED USER'))
    );

module.exports = {
    createUser,
    getUser,
    loginUser,
    updateUser
};
