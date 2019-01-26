const express = require('express');
const jwt = require('jwt-simple');
const {createGroup, addMember, isOwner, deleteMember, getAllGroups} = require('../controller/group');
const logger = require('../logger');

const apiGroup = express.Router();

apiGroup.post('/', (req, res) => {
    !req.body.title || !req.body.description
        ? res.status(400).send({
            success: false,
            message: 'title and description are required'
        })
        : createGroup(req.user.id, req.body)
            .then(res.status(200).send({
                    success: true,
                    profile: req.user,
                    message: 'group created'
                })
            )
            .catch(err => {
                logger.error(`💥 Failed to create group : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
});

apiGroup.put('/members', (req, res) => {
    !req.body.groupId || !req.body.userId
        ? res.status(400).send({
            success: false,
            message: 'groupId and userId are required'
        })
        : !isOwner(req.user.id, req.body.groupId)
        ? res.status(403).send({
            success: false,
            message: 'You are not the group owner'
        })
        : addMember(req.body.userId, req.body.groupId)
            .then(res.status(200).send({
                    success: true,
                    profile: req.user,
                    message: 'member added'
                })
            )
            .catch(err => {
                logger.error(`💥 Failed to add member : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
});

apiGroup.delete('/members', (req, res) => {
    !req.body.groupId || !req.body.userId
        ? res.status(400).send({
            success: false,
            message: 'groupId and userId are required'
        })
        : !isOwner(req.user.id, req.body.groupId)
        ? res.status(403).send({
            success: false,
            message: 'You are not the group owner'
        })
        : deleteMember(req.body.userId, req.body.groupId)
            .then(res.status(200).send({
                    success: true,
                    profile: req.user,
                    message: 'member deleted'
                })
            )
            .catch(err => {
                logger.error(`💥 Failed to add member : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            })
});


const publicApiGroup = express.Router();
publicApiGroup.get('/', (req, res) => getAllGroups().then( groups => res.status(200).send(groups)
));


module.exports = {apiGroup, publicApiGroup};
