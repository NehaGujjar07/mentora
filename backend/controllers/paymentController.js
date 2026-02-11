const Stripe = require('stripe');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

let stripe;
if (process.env.STRIPE_SECRET_KEY) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
} else {
    console.error("STRIPE_SECRET_KEY is missing in environment variables.");
}

// @desc    Create Stripe Payment Intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
const createPaymentIntent = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ message: "Stripe configuration missing on server." });
        }
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: course.price * 100, // Amount in cents
            currency: 'usd', // Changed to USD for broader Stripe support, or 'inr' if Indian export usage
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                courseId: courseId,
                userId: req.user._id.toString()
            }
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Payment and Enroll User
// @route   POST /api/payment/confirm-enrollment
// @access  Private
const confirmEnrollment = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(500).json({ message: "Stripe configuration missing on server." });
        }
        const { paymentIntentId, courseId } = req.body;

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Check if already enrolled to avoid duplicates
            const user = await User.findById(req.user._id);
            if (user.enrolledCourses.includes(courseId)) {
                return res.json({ message: 'Already enrolled' });
            }

            const course = await Course.findById(courseId);

            const enrollment = await Enrollment.create({
                user: req.user._id,
                course: courseId,
                paymentId: paymentIntentId,
                orderId: paymentIntentId, // reusing ID for schema compatibility
                amount: course.price
            });

            // Update user's enrolledCourses
            await User.findByIdAndUpdate(req.user._id, {
                $addToSet: { enrolledCourses: courseId }
            });

            res.json({ message: 'Payment verified and enrolled', enrollment });
        } else {
            res.status(400).json({ message: 'Payment not successful or pending' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPaymentIntent, confirmEnrollment };
