const express = require('express');
const path = require('path');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();



router.get('/add-product', isAuth, adminController.getAddProduct);

router.post('/add-product',isAuth, adminController.postAddProduct);

router.get('/products',isAuth, adminController.getAdminProducts);

router.post('/edit-product',isAuth, adminController.postEditProduct);

router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

router.post('/delete-product/:productId',isAuth, adminController.postDeleteProduct);



module.exports = router;