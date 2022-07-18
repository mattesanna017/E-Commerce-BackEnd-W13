const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// FIND ALL CATEGORIES
router.get('/', async (req, res) => {
  try {
    const CategoryData = await Category.findAll({

      // be sure to include its associated Products
      include: [{ model: Product }],
    });
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});



// FIND ONE category by its `id` value
router.get('/:id',async (req, res) => {
  try {
    const CategoryData = await Category.findByPk(req.params.id, {

      // be sure to include its associated Products
      include: [{ model: Product }],
    });

    if (!CategoryData) {
      res.status(404).json({ message: 'Category not found, plese enter another id' });
      return;
    }

    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


// CREATE a new category
router.post('/',async (req, res) => {
  try {
    const CategoryData = await Category.create({
      category_name: req.body.category_name
    });
    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});



// UPDATE a category by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const CategoryData = await Category.update(req.body,{
      where: {
        id: req.params.id,
      },
    });

    if (!CategoryData) {
      res.status(404).json({ message: 'Category not found, plese enter another id' });
      return;
    }

    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});



// DELETE a category by its `id` value
router.delete('/:id',async (req, res) => {
  try {
    const CategoryData = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!CategoryData) {
      res.status(404).json({ message: 'Category not found, plese enter another id' });
      return;
    }

    res.status(200).json(CategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
