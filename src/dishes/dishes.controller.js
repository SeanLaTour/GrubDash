const path = require("path");

// Use the existing dishes data
const dishes = require(path.resolve("src/data/dishes-data"));

// Use this function to assign ID's when necessary
const nextId = require("../utils/nextId");

// Validation
function validateName(req, res, next) {
  res.locals.name = req.body.data.name;
  const name = res.locals.name;
  if (name) {
    return next();
  } else {
      next({status: 400, message: 'Dish must include a name'})
  }
}

function validateDescription(req, res, next) {
  res.locals.description = req.body.data.description;
  const desc = res.locals.description;
  if (desc) {
    return next();
  } else {
      next({status: 400, message: 'Dish must include a description'})
  }
}

function validateImage(req, res, next) {
  res.locals.image_url = req.body.data.image_url;
  const image = res.locals.image_url;
  if (image) {
    return next();
  } else {
      next({status: 400, message: 'Dish must include a image_url'})
  }
}

function validatePrice(req, res, next) {
  res.locals.price = req.body.data.price;
  const price = res.locals.price;
  if (price) {
    return next();
  } else {
      next({status: 400, message: 'Dish must include a price'})
  }
}

function validatePriceIsNotZero(req, res, next) {
  const price = res.locals.price;
  if (price > 0) {
    return next();
  } else {
      next({status: 400, message: 'Dish must include a price'})
  }
}

function dishNotFound(req, res, next) {
  const id = req.params.dishId;
  const dish = dishes.find(dish => dish.id === id)
  if (dish) {
    return next()
  } else {
    next({status: 404, message: `'Dish not found'`})
  }
}

function ensureMatchIds (req, res, next) {
  const id = req.params.dishId;
  const dataId = req.body.data.id;
  if (dataId === id || !dataId) {
    return next();
  } else {
    next({status: 400, message: `Dish id does not match route id. Dish: ${dataId}, Route: ${id}`})
  }
}

function checkName (req, res, next) {
  if (res.locals.name) {
    next();
  } else {
    next({status: 400, message: "Dish must have name"})
  }
}

function checkDesc (req, res, next) {
  if (res.locals.description) {
    next();
  } else {
    next({status: 400, message: "Dish must have description"})
  }
}

function checkImg (req, res, next) {
  if (res.locals.image_url) {
    next();
  } else {
    next({status: 400, message: "Dish must have image_url"})
  }
}

function checkPrice (req, res, next) {
  const price = res.locals.price;
  if (price > 0) {
    next();
  } else {
    next({status: 400, message: "Dish must have price"})
  }
}

function checkPriceIsNumber (req, res, next) {
  const price = res.locals.price;
  if (typeof price === 'number') {
    next();
  } else {
    next({status: 400, message: "Dish must have price"})
  }
}


// Functions

function list(req, res, next) { // List
  res.json({ data: dishes});
}

function create(req, res, next) { // Create
    const { data } = req.body;
    const id = nextId();
  const newObj = {
    ...data, id
  }
    dishes.push(newObj);
    res.status(201).json({ data: newObj })
}

function read(req, res, next) { // Read
  const id = req.params.dishId;
  const dish = dishes.find(dish => dish.id === id)
    res.status(200).json({ data: dish })
}

function update(req, res, next) { // Update
  const id = req.params.dishId;
  let dataId;
  if (!req.body.data.id) {dataId = id}
  else {
    dataId = req.body.data.id;
  }
  const newMaterial = {
    id: dataId,
    name: res.locals.name,
    description: res.locals.description,
    price: res.locals.price,
    image_url: res.locals.image_url
  };
  dishes.forEach(dish =>{ if (dish.id === id) {
    dish = newMaterial;
  }})
  res.status(200).json({ data: newMaterial })
}

module.exports = {
  list: [list],
  create: [validateName, validatePriceIsNotZero, validateDescription, validateImage, validatePrice, create],
  read: [dishNotFound, read],
  update: [dishNotFound, ensureMatchIds, checkName, checkDesc, checkImg, checkPrice, checkPriceIsNumber, update]
};
