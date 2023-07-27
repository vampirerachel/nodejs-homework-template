const { listContacts, getContactById, addContact, removeContact, updateContact } = require('../../models/contacts');
const Joi = require('joi');
const express = require('express')
const router = express.Router()

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});
router.get('/', async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    console.error('Error fetching contacts:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.get('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const contact = await getContactById(contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    console.error('Error fetching contact:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Missing required name, email, or phone field' });
    }
        const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: 'Validation error', details: error.details });
    }
const newContact = await addContact(name, email, phone);
    if (newContact === null) {
      return res.status(400).json({ message: 'A contact with the same details already exists' });
    }
    return res.status(201).json(newContact)
  } catch (err) {
    console.error('Error adding contact:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
})

router.delete('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const isDeleted = await removeContact(contactId);
    if (isDeleted) {
      res.status(200).json({message: 'contact deleted'})
    } else {
      res.status(404).json({message: 'not found'})
    }
  }catch(err){
      console.error('Error removing contact:', err);
    res.status(500).json({ message: 'Server Error' });}
})

router.put('/:contactId', async (req, res, next) => {
  const contactId = req.params.contactId;
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({message:  'Validation error', details: error.details})
    }
    const updatedData = req.body;
        if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: 'Request body is empty' });
    }
  if (!updatedData || !updatedData.name || !updatedData.email || !updatedData.phone) {
    return res.status(400).json({ message: 'missing fields' });
  }
    const updatedContact = await updateContact(contactId, updatedData);
    if (updatedContact) {
      return res.status(200).json(updatedContact);
    } else {
      return res.status(404).json({ message: 'Not found' });
    }
  } catch (err) {
    console.error('Error updating contact:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router
