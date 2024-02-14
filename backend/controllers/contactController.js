const Contact = require("../models/contactModel")


const addRepport = async (req, res) => {
    const repport = req.body

    try {
        const contact = await Contact.create(repport)
        res.status(200).json(contact)
    } catch (error) {
        res.status(501).json({ error: "The contact could not be added" })
    }
}

module.exports = { addRepport }