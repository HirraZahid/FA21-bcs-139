const User = require('../models/user');

// Sign up
async function handleUsersSignUp(req, res) {
    const { name, email, password } = req.body;

    try {
        await User.create({
            name,
            email,
            password,
        });

        // Pass the title variable when rendering the homepage
        return res.render("homepage", { title: "Homepage" });
    } catch (error) {
        // Handle any errors that occur during user creation
        console.error("Error while signing up user:", error);
        // Redirect or render an error page if needed
        return res.status(500).send("Error while signing up user");
    }
}

// Login
async function handleUsersLogin(req, res) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, password });

        if (!user) {
            return res.render("login", { title: "Login", error: "Invalid username or password" });
        }

        // Assuming you set the user in the session here
        req.session.user = user;
        return res.redirect("/"); // Assuming "/" is the correct URL for the homepage
    } catch (error) {
        console.error("Error while finding user:", error);
        return res.status(500).send("Internal Server Error");
    }
}



module.exports = {
    handleUsersSignUp,
    handleUsersLogin,
    
};
