const express = require('express');
const jwt = require('jwt-simple');
const {createGroup } = require('../controller/group');
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

module.exports = {apiGroup};
