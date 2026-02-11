const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmEnrollment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/confirm-enrollment', protect, confirmEnrollment);

module.exports = router;
