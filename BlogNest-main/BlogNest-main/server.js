require("dotenv").config();

const express = require("express");
const path = require("path");

const connectDatabase = require("./database");
const Blog = require("./models/Blog");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

const PORT = 8080;

connectDatabase();

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(
    path.join(__dirname, "public")
));


// AI ROUTES
app.use("/api/ai", aiRoutes);


// HOME
app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "index.html"
        )
    );

});


// CREATE PAGE
app.get("/create", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "create.html"
        )
    );

});


// GET ALL BLOGS
app.get("/api/blogs", async (req, res) => {

    try {

        const blogs = await Blog.find()
            .sort({
                createdAt: -1
            });

        res.json(blogs);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });

    }

});


// GET SINGLE BLOG
app.get("/api/blogs/:id", async (req, res) => {

    try {

        const blog = await Blog.findById(
            req.params.id
        );

        if (!blog) {

            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });

        }

        res.json(blog);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get blog"
        });

    }

});


// CREATE BLOG
app.post("/create-blog", async (req, res) => {

    try {

        const {
            title,
            content
        } = req.body;

        if (!title || !content) {

            return res.status(400).send(
                "Title and content are required."
            );

        }

        const blog = new Blog({
            title: title,
            content: content
        });

        await blog.save();

        res.redirect("/");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to create blog."
        );

    }

});


// EDIT PAGE
app.get("/edit/:id", (req, res) => {

    res.sendFile(
        path.join(
            __dirname,
            "views",
            "edit.html"
        )
    );

});


// UPDATE BLOG
app.post("/edit-blog/:id", async (req, res) => {

    try {

        const {
            title,
            content
        } = req.body;

        await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title: title,
                content: content
            }
        );

        res.redirect("/");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to update blog."
        );

    }

});


// DELETE BLOG
app.post("/delete-blog/:id", async (req, res) => {

    try {

        await Blog.findByIdAndDelete(
            req.params.id
        );

        res.redirect("/");

    } catch (error) {

        console.error(error);

        res.status(500).send(
            "Failed to delete blog."
        );

    }

});


// 404
app.use((req, res) => {

    res.status(404).send(
        "Page not found."
    );

});


// START SERVER
app.listen(PORT, () => {

    console.log(
        `BlogNest server running at http://localhost:${PORT}`
    );

});