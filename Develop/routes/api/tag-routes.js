const router = require('express').Router();
const { Tag, Product } = require('../../models');

// The `/api/tags` endpoint

 // FIND ALL TAGS
router.get('/', async (req, res) => {

  try{
    const tagData = await Tag.findAll({

      // be sure to include its associated Product data
      include: [{model:Product}],
    });

    res.status(200).json(tagData);
  }

  catch(err){
    res.status(500).json(err)
  }
});


 // FIND  single TAGS by its `id`
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id,{

      // be sure to include its associated Product data
      include: [{model:Product}],
    });

    if (!tagData) {
      res.status(404).json({message: 'Tag not found, plese enter another id'});
      return;
    }

    res.status(200).json(tagData);
  }

  catch (err) {
    res.status(500).json(err);
  }
  
});




 // CREATE NEW TAG (tag_name)
router.post('/', async (req, res) => {
  try{
    const tagData = await Tag.create ({
      tag_name : req.body.tag_name,
    });

    res.status(200).json(tagData);
  }

  catch (err) {
    res.status(500).json(err);
  }
});



// UPDATE  a tag's name by its `id` value
router.put('/:id', async (req, res) => {
  try {
    const tagData = await Tag.update ({
      where: {
        id: req.params.id,
      },
    });

    if(!tagData) {
      res.status(404).json({message: 'Tag not found, plese enter another id' });
      return;
    }

    res.status(200).json(tagData);
  }

  catch (err) {
    res.status(500).json(err);
  }
});



// DELETE on tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.destroy ({
      where: {
        id: req.params.id,
      },
    });

    if(!tagData) {
      res.status(404).json({message: 'Tag not found, plese enter another id' });
      return;
    }

    res.status(200).json(tagData);
  }

  catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
