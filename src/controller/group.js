const omit = require('lodash.omit');
const {Group} = require('../model');
const logger = require('../logger');

const createGroup = (userId, {title, description, metadatas}) =>
    Group.create({
        title,
        description,
        metadatas: metadatas || '',
        owner_id : userId
    }).then(group =>
        omit(
            group.get({
                plain: true
            }),
            Group.excludeAttributes
        )
    );


module.exports = {
    createGroup
};
