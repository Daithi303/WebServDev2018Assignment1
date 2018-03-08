import express from 'express';
import Model from './../model/model.js';
import _ from 'lodash';
const router = express.Router(); // eslint-disable-line

//Get all users
router.get('/', (req, res) => {
  Model.User.find((err, user) => {
    if (err) return handleError(res, err);
    return res.status(200).json(user);
  });
});

//Get a user
router.get('/:userId', (req, res) => {
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    return res.status(200).json(user);
  });
});

//Add a user
router.post('/', (req, res) => {
  Model.User.create(req.body, function(err, user) {
    if (err) return handleError(res, err);
    return res.status(201).json(user);
  });
});




// Update a user
router.put('/:userId', (req, res) => {
  if (req.body._id) delete req.body._id;
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    const updated = _.merge(user, req.body);
    updated.save((err) => {
      if (err) return handleError(res, err);
      return res.status(200).json(user);
    });
  });
});

// Delete a user
router.delete('/:userId', (req, res) => {
  Model.User.findById(req.params.userId, (err, user) => {
    if (err) return handleError(res, err);
    if (!user) return res.send(404);
    user.remove(function(err) {
      if (err) return handleError(res, err);
      return res.send(204);
    });
  });
});

/**
 * Handle general errors.
 * @param {object} res The response object
 * @param {object} err The error object.
 * @return {object} The response object
 */
function handleError(res, err) {
  return res.send(500, err);
};

export default router;