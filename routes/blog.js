const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const Blog = require('../models/blog');
const Comment = require('../models/comment')

const router = Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: storage })

router.post('/', upload.single("coverImage"), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);

    const { title, body } = req.body;
    // const {} = req.file;

    const blog = await Blog.create({
        title: title,
        body: body,
        coverImgURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${blog._id}`);
})


router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    })
})

router.get('/:id', async (req,res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const comments = await Comment.find({blogId: req.params.id}).populate('createdBy')
    return res.render("blog", {
        user: req.user,
        blog,
        comments,
    })
})

router.get('/yourblogs', async (req,res) => {

    try {
        const blogs = await Blog.find({ createdBy: req.user._id });
        return res.render("yourBlog", {blogs});
    } catch (error) {
        console.error(err);
        return res.status(500).send("An error occurred while retrieving blogs.");
    }
})

router.post('/comment/:blogId', async (req,res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id,
    })
    return res.redirect(`/blog/${req.params.blogId}`);
})

module.exports = router;