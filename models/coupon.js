const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        allownull: true,
        defaultValue: false
    },
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date,
    },
    percentage: {
        type: Number,
        required: true

    },
    upto_discount: {
        type: Number,
        required: true

    },
    amount: {
        type: Number,
        required: true

    },
    maximum_no_of_use: {
        type: Number,
        required: true
    },
    minimum_order_amount: {
        type: Number,
        required: true
    },
    maximum_use_per_customer: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        allownull: true
    },
    description: {
        type: String,
        allownull: true
    },
    terms_and_conoditions: {
        type: String,
        allownull: true
    },
    created_by: {
        type: 'number',
        allownull: true
    },
    created_date: {
        type: 'date',
        allownull: true
    },
    modified_by: {
        type: 'number',
        allownull: true
    },
    modified_date: {
        type: 'date',
        allownull: true
    }
}, { timestamps: true });

couponSchema.plugin(uniqueValidator, { message: 'Error, expected {PATH} to be unique.' });

const coupon = mongoose.model('coupon', couponSchema);

module.exports = coupon;