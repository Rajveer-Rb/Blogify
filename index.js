const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const {connectDB} = require('./connection');
const { checkAuthCookie } = require('./middlewares/auth');

const Blogs = require('./models/blog');

const app = express();
const port = 3000;

connectDB('mongodb://localhost:27017/blogify').then(() => console.log("MongoDB connected")).catch((err) => console.log("MongoDB error", err));

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use(express.static(path.resolve("./public")));
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkAuthCookie("token"));                     // run at each render

app.get('/', async (req,res) => {
    const allBlogs = await Blogs.find({});
    res.render("homepage", {
        user: req.user,
        blogs: allBlogs,
    });
})

// initializing routes
app.use('/user', userRoute);
app.use('/blog', blogRoute);

app.listen(port, () => {
    console.log(`server running at port: ${port}`);
})