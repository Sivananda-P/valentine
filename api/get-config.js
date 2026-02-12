import clientPromise from '../lib/mongodb';

export default async function handler(req, res) {
    const { id } = req.query;

    if (!id) {
        return res.status(400).json({ message: 'Link ID is required' });
    }

    try {
        const client = await clientPromise;
        const db = client.db("valentine");
        const collection = db.collection("links");

        const link = await collection.findOne({ linkId: id });

        if (!link) {
            return res.status(404).json({ message: 'Link not found' });
        }

        res.status(200).json({ encryptedData: link.encryptedData });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
