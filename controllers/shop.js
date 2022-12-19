const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts =  (req,res,next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list',
            {prods: products, 
            pageTitle: 'Products',
            path:'/products'});
        })
        .catch(err => console.log(err));
};

exports.getProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => console.log(err));
};

exports.getIndex = (req,res,next)=>{
    Product.find()
        .then(products => {
            res.render('shop/index',
            {prods: products, 
            pageTitle: 'Index',
            path:'/'});
        })
        .catch(err => console.log(err))
};

exports.getCart = (req,res,next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                products: products,
                pageTitle: 'Your Cart'
            });
        })
        .catch(err => console.log(err));
};

exports.postCart = (req,res,next)=>{
    if (!req.session.isLoggedIn){
        res.redirect('/login');
    }
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};


exports.cartDeleteItem = (req,res,next) => {
    const prodId = req.body.productId;
    req.user
        .deleteFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req,res,next) => {
    Order.find({"user.userId": req.user._id})
        .then(orders => {
            res.render('shop/orders',
            {pageTitle: 'Your Orders',
             path: '/orders',
             orders: orders}); 
        })
};

exports.postOrder = (req,res,next) => {
    req.user
        .populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return {quantity: i.quantity, product: {...i.productId._doc}};
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
        
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',
        {pageTitle: 'Checkout',
        path: '/checkout'});  
};