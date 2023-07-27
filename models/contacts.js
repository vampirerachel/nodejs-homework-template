const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');

async function listContacts() {
  return readContactsFile();
}
async function readContactsFile() {
  try {
    const data = await fs.readFile(contactsPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return [];
  }
}
async function removeContact(id) {
  try {
    const contacts = await readContactsFile();
    const updatedContacts = contacts.filter((contact) => contact.id !== id);
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    return true;
  } catch (err) {
    console.error('Error removing contact:', err);
    return false;
  }
}
async function getContactById(contactId) {
  try {
    const contacts = await readContactsFile();
    return contacts.find((contact) => contact.id === contactId);
  } catch (err) {
    console.error('Error in getContactById:', err);
    throw err;
  }
}
async function addContact(name, email, phone) {
  try {
    const contacts = await readContactsFile();
    const existingContact = contacts.find(
      (contact) => contact.name === name && contact.email === email && contact.phone === phone
    );
    if (existingContact) {
      console.log('Contact with the same details already exists:', JSON.stringify(existingContact, null, 2));
      return null; 
    }
    const newContact = {
      id: uuidv4(), 
      name,
      email,
      phone,
    };
    contacts.push(newContact);
    console.log('New contact to be added:', JSON.stringify(newContact, null, 2));
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
  } catch (err) {
    console.error('Error in addContact:', err);
    return null;
  }
}
async function updateContact(contactId, updatedContactData) {
  try {
    const contacts = await readContactsFile();
    const contactIndex = contacts.findIndex((contact) => contact.id === contactId);
    if (contactIndex === -1) {
      console.log('Contact not found for updating:', contactId);
      return null;
    }
    const updatedContact = { ...contacts[contactIndex], ...updatedContactData };
    contacts[contactIndex] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log('Contact updated:', JSON.stringify(updatedContact, null, 2));
    return updatedContact;
  } catch (err) {
    console.error('Error in updateContact:', err);
    return null;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
