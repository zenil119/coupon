const mongoose = require('mongoose');


const coupon_customerSchema = mongoose.Schema({
    customer_id: {
        type: Number,
        required: true
    },
    coupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupon',
        required: true
    }
}, { timestamps: true });

const coupon_customer = mongoose.model('coupon_customer', coupon_customerSchema);

module.exports = coupon_customer;