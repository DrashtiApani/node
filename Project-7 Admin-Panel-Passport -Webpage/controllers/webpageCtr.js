const blogModel = require("../model/blogModel");

module.exports.webpage = async (req, res) => {
    try {
        // Sab blogs fetch karo
        const data = await blogModel.find();

        // Render webpage.ejs aur data bhejo
        res.render("webpage/webpage", { data });
    } catch (err) {
        console.log("Error in webpage:", err);
        res.send("Something went wrong");
    }
};


module.exports.readMore = async (req, res) => {
    try {
        let blog = await blogModel.findById(req.params.id);
        res.render("webpage/readMore", { blog });
    } catch (err) {
        console.log("Error in readMore:", err);
        res.send("Something went wrong");
    }
};