const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin');

const router = express.Router();



router.get('/add-product', adminController.getAddProduct);

router.post('/add-product', adminController.postAddProduct);

router.get('/products', adminController.getAdminProducts);

router.post('/edit-product', adminController.postEditProduct);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/delete-product/:productId', adminController.postDeleteProduct);



module.exports = router;