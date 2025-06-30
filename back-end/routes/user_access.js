const express = require('express');
const router = express.Router();
const controller = require('../controllers/user_access')

router.post('/', controller.createAccess);
router.get('/useraccess',controller.getAll);
router.get('/:user_id', controller.getAccess);
router.put('/:user_id', controller.updateAccess);
router.get('/:user_id/:department', controller.checkDepartmentAccess);
module.exports = router;
