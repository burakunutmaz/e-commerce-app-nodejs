const Product = require('../models/product');


exports.getAddProduct = (req,res,next) => {
    if (!req.session.isLoggedIn){
        return res.redirect('/login');
    }
    res.render('admin/edit-product',
        {pageTitle:'Add Product',
        path:'/admin/add-product',
        editing: false,
        loggedIn: req.session.isLoggedIn});
};

exports.postAddProduct =  (req,res,next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });
    product
        .save()
        .then(result => {
            console.log("Created!");
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.getEditProduct = (req,res,next) => {
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('admin/edit-product',
            {pageTitle:'Edit Product',
            product: product,
            path:'/admin/add-product',
            editing: true,
            loggedIn: req.session.isLoggedIn});
        })
        .catch(err => console.log(err));

};

exports.postEditProduct = (req,res,next)=>{
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.imageUrl = updatedImageUrl;
            product.description = updatedDesc;
            return product.save()
                .then(result => {
                    console.log("Updated Product.");
                    res.redirect('/admin/products');
                })
                .catch(err => console.log(err));

        })
        .catch(err => console.log(err));


};

exports.postDeleteProduct = (req,res,next)=>{
    const prodId = req.params.productId;
    Product.findByIdAndRemove(prodId)
        .then(result => {
            console.log("Deleted product!");
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));

};

exports.getAdminProducts = (req,res,next)=>{
    Product.find()
        .populate('userId')
        .then(products => {
            res.render('admin/products',
                {prods: products, 
                pageTitle: 'Admin Products',
                path:'/admin/products',
                loggedIn: req.session.isLoggedIn});
        })
        .catch();
};