const Category = require("../models/CategoryModel");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Categories Not Found " });
  }
};

module.exports = { getCategories };
