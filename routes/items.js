const { Router } = require('express');

const { getItems, getItem } = require('../controllers/items');
const { validateFields } = require('../middleware/validate-fields');

const router = Router();

router.get('/', [validateFields] , getItems );
router.get('/:id',[validateFields], getItem );

module.exports = router;
