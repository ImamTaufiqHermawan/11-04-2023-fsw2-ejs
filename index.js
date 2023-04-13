// import atau panggil package2 yg kita mau pakai di aplikasi kita
const express = require('express');
const path = require('path');

// manggil models/table disini
const { product } = require('./models');

// framework express = framework utk http server
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// setting view engine
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.render("index", {
        title: "FSW-2"
    })
})

// ini untuk page lihat semua produk dari database
app.get('/admin/product', async (req, res) => {
    // get data dari database pake sequelize method findAll
    const products = await product.findAll();

    // proses akhir = response yg render ejs file kalian
    res.render('products/index', {
        products
    })
})

// ini utk render page create product
app.get('/admin/product/create', (req, res) => {
    res.render("products/create")
})

// ini untuk create product baru 
app.post('/products', (req, res) => {
    // request body => req.body.name
    const { name, price, stock } = req.body

    // proses insert atau create data yg dari request body ke DB/tabel 
    // pakai sequelize method create utk proses data baru ke table/model nya
    product.create({
        name,
        price,
        stock,
        size: req.body.size
    })

    // response redirect page
    res.redirect(201, "/admin/product")
})

// ini utk render page edit product
app.get('/admin/product/edit/:id', async (req, res) => {
    // proses ambil detail product sesuai id yg di params
    const data = await product.findByPk(req.params.id)
    const productDetail = data.dataValues
    res.render("products/update", {
        productDetail,
        sizeOptions: ['small', 'medium', 'large']
    })
})

// ini untuk update product 
app.post('/products/edit/:id', (req, res) => {
    // req.params.id
    // request body => req.body.name
    const { name, price, stock } = req.body
    const id = req.params.id

    // proses insert atau create data yg dari request body ke DB/tabel 
    // pakai sequelize method create utk proses data baru ke table/model nya
    product.update({
        name,
        price,
        stock,
        size: req.body.size
    }, {
        where: {
            id
        }
    })

    // response redirect page
    res.redirect(200, "/admin/product")
})

app.listen(PORT, () => {
    console.log(`App Running on localhost: ${PORT}`)
})