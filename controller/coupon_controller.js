const coupon = require('../models/coupon');
const coupon_customer = require('../models/coupon_customer');
const Joi = require('joi');


module.exports.coupon = function(req, res) {
    return res.render('coupon')
}

// Search Coupon...

module.exports.search = function(req, res) {
    if (req.query.search) {
        escapeRegExp(req.query.search)
        const regex = new RegExp(escapeRegExp(req.query.search));
        coupon.find({ code: regex }, function(err, allcoupon) {
            if (err) {
                console.log(err);
            } else {
                res.render('coupon_data', { coupon: allcoupon });
            }
        });
    } else {
        coupon.find({}, function(err, allcoupon) {
            if (err) {
                console.log(err);
            } else {
                res.render('coupon_data', { coupon: allcoupon });
            }
        });
    }
}

// Insert Coupon...

module.exports.addCoupon = function(req, res, next) {
    coupon.exists({ code: req.body.code }, function(err, data) {
        if (err) {
            console.log(err.message)
        }
        if (data) {
            req.flash('error', "This coupon is already been exists..")
            return res.redirect('back')
        }
    })
    const couponSchema = Joi.object({
        code: Joi.string().required(),
        active: Joi.boolean().allow(),
        start_date: Joi.date().required(),
        end_date: Joi.date().greater(Joi.ref('start_date')).required().error(new Error('End date must be greater than Start date')),
        percentage: Joi.number().integer().required().error(new Error('Percentage of discount is must be a number')),
        upto_discount: Joi.number().integer().required().error(new Error('Upto discount is must be a number')),
        amount: Joi.number().integer().required().error(new Error('Amount must be a number')),
        maximum_no_of_use: Joi.number().integer().required().error(new Error('Maximum no of use must be a number')),
        minimum_order_amount: Joi.number().integer().required().error(new Error('Minimum order amount must be a number')),
        maximum_use_per_customer: Joi.number().integer().required().error(new Error('Maximum use per customer must be a number')),
        customer_id: Joi.number().allow(),
        title: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        terms_and_conoditions: Joi.string().allow(null, '')
    });
    const { error } = couponSchema.validate(req.body)
    if (error) {
        req.flash('error', error.message)
        return res.redirect('back');
    }
    coupon.create(req.body, function(err, newContact) {
        if (err) {
            console.log(err.message);
            return false;
        }
        var cou = {
            customer_id: req.body.customer_id,
            coupon_id: newContact._id
        }
        coupon_customer.create(cou, function(err, contact) {
            if (err) {
                console.log(err.message);
                return false;
            }
        });
        req.flash('success', 'Coupon is successfully created');
        return res.redirect('coupon_data');
    });
}

// Show Table...

module.exports.coupon_data = async function(req, res) {

    coupon.find({}, function(err, coupon) {
        if (err) {
            console.log(err);
        }
        const page = parseInt(req.query.page);
        // console.log(page);
        const limit = parseInt(req.query.limit);
        // console.log(limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit

        const result = {};

        if (endIndex < coupon.length) {
            result.next = {
                page: page + 1,
                limit: limit
            }
        }
        if (startIndex > 0) {
            result.previous = {
                page: page - 1,
                limit: limit
            }
        }
        result.result = coupon.slice(startIndex, endIndex);
        // console.log(result.result);
        return res.render('coupon_data', {
            coupon: coupon,
            result
        });
    });
}

// sort({ 'code': -1 });

//  Delete Coupon...

module.exports.delete_record = function(req, res) {
    var id = req.query.id;
    coupon_customer.findOneAndDelete({ coupon_id: id }, function(err, contact) {
        if (err) {
            console.log(err.message);
        }
        coupon.findByIdAndDelete(id, function(err) {
            if (err) {
                console.log(err.message)
            }
        })
        req.flash('success', 'Coupon is successfully deleted');
        return res.redirect('back');
    })
}

// Show Coupondata For Update...

module.exports.update_record = function(req, res) {
    var id = req.query.id
    coupon.findById(id, function(err, coupon) {
        if (err) {
            console.log(err.message);
        }
        coupon_customer.find({ coupon_id: id }, function(err, customer) {
            if (err) {
                console.log(err.message);
            }
            return res.render('update_coupon', {
                coupondata: coupon,
                customer
            })
        })
    })
}

// Update Coupondata For Save Data...

module.exports.updateCoupon = function(req, res) {
    var id = req.query.id
    coupon.findByIdAndUpdate(req.body.coupon_id, {
        code: req.body.code,
        active: req.body.active,
        start_date: req.body.start_date,
        end_date: req.body.end_date,
        percentage: req.body.percentage,
        upto_discount: req.body.upto_discount,
        amount: req.body.amount,
        maximum_no_of_use: req.body.maximum_no_of_use,
        minimum_order_amount: req.body.minimum_order_amount,
        maximum_use_per_customer: req.body.maximum_use_per_customer,
        title: req.body.title,
        description: req.body.description,
        terms_and_conoditions: req.body.terms_and_conoditions
    }, function(err, data) {
        if (err) {
            console.log(err);
            return false;
        }
    });
    req.flash('success', 'Coupon is successfully updated');
    return res.redirect('coupon_data');
}

// $& means the whole matched string[for search]
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}