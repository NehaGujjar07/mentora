import { useState, useContext } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const CheckoutForm = ({ clientSecret, courseId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { refreshUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/course/${courseId}`,
            },
            redirect: 'if_required',
        });

        if (error) {
            setMessage(error.message);
            setIsLoading(false);
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            // Payment successful, now enroll
            try {
                await api.post('/payment/confirm-enrollment', {
                    paymentIntentId: paymentIntent.id,
                    courseId
                });

                // Refresh user data to update UI to "Enrolled" state
                if (refreshUser) {
                    await refreshUser();
                }

                alert('Payment successful! You are now enrolled.');
                // Navigate to lesson view or reload to show updated state
                // Using navigate(0) effectively reloads the current route, 
                // but since we updated context, a simple redirect might be better.
                // Or just window.location.reload() to be safe and clear any stripe components.
                window.location.reload();
            } catch (err) {
                console.error(err);
                setMessage('Enrollment success, but system update failed. Please refresh.');
                setIsLoading(false);
            }
        } else {
            setMessage('Unexpected state');
            setIsLoading(false);
        }
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit} className="mt-4">
            <PaymentElement id="payment-element" />
            <button
                disabled={isLoading || !stripe || !elements}
                id="submit"
                className="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner">Processing...</div> : "Pay now"}
                </span>
            </button>
            {message && <div id="payment-message" className="mt-2 text-red-500 text-sm">{message}</div>}
        </form>
    );
};

export default CheckoutForm;
