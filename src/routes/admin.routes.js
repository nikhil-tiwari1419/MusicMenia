const express = require('express');
const { authAdmin } = require('../middlewares/auth.middleware');

const { getAllusers, promoteToArtist, demoteToUser, deleteUser } = require('../controllers/admin.controller');

const router = express.Router();

//All protected Admin only 
router.get('/users', authAdmin, getAllusers);
router.patch('/promote/:userId', authAdmin, promoteToArtist);
router.patch('/demote/:userId', authAdmin, demoteToUser);
router.delete('/delete/:userId', authAdmin, deleteUser);

module.exports = router;

