const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// Validation
function validateDeliverTo(req, res, next) { // validateDeliverTo
  res.locals.deliverTo = req.body.data.deliverTo;
  deliverTo = res.locals.deliverTo;
  if (deliverTo) {
    return next();
  } else {
      next({status: 400, message: 'Order must include a deliverTo'})
  }
}

function validateMobileNumber(req, res, next) { // validateMobileNumber
  res.locals.mobileNumber = req.body.data.mobileNumber;
  const mobileNumber = res.locals.mobileNumber;
  if (mobileNumber) {
    return next();
  } else {
      next({status: 400, message: 'Order must include a mobileNumber'})
  }
}

function validateDishesExist(req, res, next) { // validateDishesExist
  res.locals.dishes = req.body.data.dishes;
  const dishes = res.locals.dishes;
  if (dishes) {
    return next();
  } else {
      next({status: 400, message: 'Order must include dishes'})
  }
}

function validateDishesLength(req, res, next) { // validateDishesLength
  const dishes = res.locals.dishes;
  if (dishes.length > 0) {
    return next();
  } else {
      next({status: 400, message: 'Order must include dishes'})
  }
}

function validateIsArray(req, res, next) { // validateIsArray
  const dishes = res.locals.dishes;
  if (Array.isArray(dishes)) {
    return next();
  } else {
      next({status: 400, message: 'Order must include dishes'})
  }
}

function validateQuantity(req, res, next) { // validateQuantity
  const dishes = res.locals.dishes;
  let errorObject = {};
  // Beginning of loop
  dishes.forEach((dish, index) => {
    if (!dish.quantity) {
      errorObject = {
        index,
        dish
      }
    }
  })
  // Outside loop
  if (!errorObject.index) {
    return next();
  } else {
      next({status: 400, message: `Dish ${errorObject.index} must have a quantity that is an integer greater than 0`})
  }
}

function validateQuantityIsNotZero(req, res, next) { // validateQuantityIsNotZero
  const dishes = res.locals.dishes;
  let errorObject = {};
  // Beginning of loop
  dishes.forEach((dish, index) => {
    if (dish.quantity === 0) {
      errorObject = {
        index,
        dish
      }
    }
  })
  // Outside loop
  if (!errorObject.dish) {
    return next();
  } else {
      next({status: 400, message: `Dish ${errorObject.index} must have a quantity that is an integer greater than 0`})
  }
}

function validateQuantityIsInt(req, res, next) { // validateQuantityIsNotZero
  const dishes = res.locals.dishes;
  let errorObject = {};
  // Beginning of loop
  dishes.forEach((dish, index) => {
    if (typeof dish.quantity !== 'number') {
      errorObject = {
        index,
        dish
      }
    }
  })
  // Outside loop
  if (!errorObject.dish) {
    return next();
  } else {
      next({status: 400, message: `Dish ${errorObject.index} must have a quantity that is an integer greater than 0`})
  }
}

function orderNotFound(req, res, next) {
  res.locals.orderId = req.params.orderId;
  const id = res.locals.orderId;
  const foundOrder = orders.find(order => order.id === id);
  if (foundOrder) {
    return next();
  } else {
    next({status: 404, message: `Order id does not match route id. Order: ${id}, Route: ${foundOrder}`})
  }
}

function ensureMatchIds (req, res, next) {
  const id = res.locals.orderId;
  const dataId = req.body.data.id;
  if (dataId === id || !dataId) {
    return next();
  } else {
    next({status: 400, message: `Dish id does not match route id. Dish: ${dataId}, Route: ${id}`})
  }
}

function checkDeliverTo(req, res, next) {
  if (res.locals.deliverTo) {
    return next();
  } else {
    next({status: 400, message: 'Order must have deliverTo'})
  }
}

function checkMobile(req, res, next) {
  if (res.locals.mobileNumber) {
    return next();
  } else {
    next({status: 400, message: 'Order must have mobileNumber'})
  }
}

function checkDishes(req, res, next) {
  if (res.locals.dishes) {
    return next();
  } else {
    next({status: 400, message: 'Order must have dishes'})
  }
}

function checkDishesLength(req, res, next) {
  const dishes = res.locals.dishes;
  if (dishes.length > 0) {
    return next();
  } else {
    next({status: 400, message: 'Order must have dishes'})
  }
}

function checkDishesIsArray(req, res, next) {
  const dishes = res.locals.dishes;
  if (Array.isArray(dishes)) {
    return next();
  } else {
    next({status: 400, message: 'Each dish must be in an array'})
  }
}

function checkStatus(req, res, next) {
  const id = res.locals.orderId;
  const foundOrder = orders.find(order => order.id === id);
  const status = foundOrder.status;
  if (status === 'pending') {
    return next()
  } else {
    next({status: 400, message: 'Order is pending'})
  }
}

function validateStatusExists(req, res, next) {
  res.locals.status = req.body.data.status;
  const status = res.locals.status;
  if (status) {
    return next()
  } else {
    next({status: 400, message: 'Order must contain status'})
  }
}

function validateStatusIsValid(req, res, next) {
  const status = res.locals.status;
  if (status !== 'invalid') {
    return next()
  } else {
    next({status: 400, message: 'Order status must be valid'})
  }
}

// Functions
function list(req, res, next) { // List
  res.json({ data: orders })
}

function create(req, res, next) { // Create
  const { data } = req.body;
  const id = nextId();
  const newObj = {
    ...data, id
  }
    orders.push(newObj);
    res.status(201).json({ data: newObj })
}

function read(req, res, next) { // Read
  const id = res.locals.orderId;
  const foundOrder = orders.find(order => order.id === id);
  res.status(200).json({ data: foundOrder });
}

function update(req, res, next) { // Update
  const id = res.locals.orderId;
  const foundOrder = orders.find(order => order.id === id);
  let dataId;
  if (!req.body.data.id) {dataId = id}
  else {
    dataId = req.body.data.id;
  }
  const newOrder = {
    id: dataId,
    deliverTo: res.locals.deliverTo,
    mobileNumber: res.locals.mobileNumber,
    status: res.locals.status,
    dishes: res.locals.dishes
  }
  orders.forEach(order => {
    if (order === newOrder) order = newOrder
  })
  res.status(200).json({ data: newOrder })
}

function destroy(req, res, next) {
  const id = res.locals.orderId;
  const foundOrder = orders.find(order => order.id === id);
  orders.splice(foundOrder, 1);
  res.status(204).json({ data: foundOrder })
}

module.exports = {
  create: [validateDeliverTo, validateMobileNumber, validateDishesExist, validateDishesLength, validateIsArray, validateQuantity, validateQuantityIsNotZero, validateQuantityIsInt, create],
  list,
  read: [orderNotFound, read],
  update: [orderNotFound, ensureMatchIds, checkDeliverTo, checkMobile, checkDishes, checkDishesLength, checkDishesIsArray, validateQuantity, validateQuantityIsNotZero, validateQuantityIsInt, validateStatusExists, validateStatusIsValid, update],
  delete: [orderNotFound, checkStatus, destroy]
}