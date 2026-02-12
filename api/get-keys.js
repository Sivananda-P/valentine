export default function handler(req, res) {
    res.status(200).json({
        razorpayKeyId: process.env.RAZORPAY_KEY_ID
    });
}
