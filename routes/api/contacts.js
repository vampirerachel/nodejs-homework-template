const express = require('express')
const Contact = require('../../models/contacts');
const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching contacts...');
    const contacts = await Contact.find().select('-__v');;
    console.log('Contacts fetched:', contacts);
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Server error', message: error.message });
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId).select('-__v'); 
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
    newContact.__v = undefined;
    res.status(201).json(newContact)
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.contactId);
    if (!deletedContact) {
      return res.status(404).json({error: 'Contact not Found'})
    }
    res.json({message: 'Contact deleted successfully'})
  }
  catch (error){
    res.status(500).json({ message: 'Server error' })
  }
})

router.put('/:contactId', async (req, res, next) => {
 try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true } 
    ).select('-__v');
    if (!updatedContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json(updatedContact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
})
router.patch('/:contactId/favorite', async (req, res, next) => {
  const contactId = req.params.contactId;
  const { favorite } = req.body;

  if (favorite === undefined) {
    return res.status(400).json({ message: 'Missing field favorite' });
  }

  try {
    const updatedContact = await updateStatusContact(contactId, { favorite });

    if (!updatedContact) {
      return res.status(404).json({ message: 'Not found' });
    }

    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

async function updateStatusContact(contactId, updates) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updates,
      { new: true }
    ).select("-__v");
    return updatedContact;
  } catch (error) {
    return null;
  }
}
module.exports = router
