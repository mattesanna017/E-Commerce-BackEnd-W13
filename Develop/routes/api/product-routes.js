const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET ALL PRODUCTS
router.get('/', async (req, res) => {
  try {
    const ProductData = await Product.findAll ({

      // be sure to include its associated Category and Tag data
      include :[{model: Category}, {model: Tag}],
    });

    res.status(200).json(ProductData);
  }
  
  catch(err) {
    res.status(500).json(err);
  }

});


// GET ONE PRODUCT by its `id`
router.get('/:id', async (req, res) => {

  try {
    const ProductData = await Product.findByPk({

      // be sure to include its associated Category and Tag data
      include :[{model: Category}, {model: Tag}],
    });

    if (!ProductData) {
      res.status(404).json({message: 'Product not found, plese enter another id'});
      return;
    }

    res.status(2000).json(ProductData);
  }

  catch(err) {
    res.status(500).json(err);
  }
});



// CREATE NEW PRODUCT
router.post('/', (req, res) => {
 
  Product.create ({
    product_name: req.body.product_name,
    price: req.body.price,
    stock: req.body.stock,
    category_id: req.body.category_id,
    tagIds: req.body.tagIds,
  })
  
    .then((product) => {

      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });

        return ProductTag.bulkCreate(productTagIdArr);
      }

      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});



// UPDATE PRODUCT
router.put('/:id', (req, res) => {

  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {

      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {

      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })

    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {

      // console.log(err);
      res.status(400).json(err);
    });
});



// DELETE ONE PRODUCT BY ITS 'ID' VALUE
router.delete('/:id', async (req, res) => {
  try {
    const ProductData = await Product.destroy({
      where:{
        id: req.params,id,
      },
    });

    if(!ProductData) {
      res.status(404).json({message:'Product not found, plese enter another id'});
      return;
    }

    res.status(200).json(ProductData);
  }
  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
