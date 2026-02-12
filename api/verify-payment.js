import crypto from 'crypto';
import clientPromise from './lib/mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, encryptedData } = req.body;

    // Verify Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
        try {
            const client = await clientPromise;
            const db = client.db("valentine");
            const collection = db.collection("links");

            // Generate a short readable ID
            const linkId = Math.random().toString(36).substring(2, 8);

            await collection.insertOne({
                linkId: linkId,
                encryptedData: encryptedData,
                paymentId: razorpay_payment_id,
                orderId: razorpay_order_id,
                createdAt: new Date()
            });

            res.status(200).json({ success: true, linkId: linkId });
        } catch (error) {
            console.error("DB Error:", error);
            res.status(500).json({ message: "Payment verified but DB storage failed" });
        }
    } else {
        res.status(400).json({ success: false, message: "Invalid signature" });
    }
}
