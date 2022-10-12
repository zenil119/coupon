const express = require('express');
const { route } = require('express/lib/application');
const routes = express.Router();

const coupon_controller = require('../controller/coupon_controller');

routes.get('/', coupon_controller.coupon);

// For insert coupon

routes.post('/addCoupon', coupon_controller.addCoupon);

// For show table

routes.get('/coupon_data', coupon_controller.coupon_data);

// For delete and update coupon and search

routes.get('/search', coupon_controller.search);
routes.get('/delete_record/', coupon_controller.delete_record);
routes.get('/update_record', coupon_controller.update_record);
routes.post('/updateCoupon', coupon_controller.updateCoupon);

module.exports = routes;