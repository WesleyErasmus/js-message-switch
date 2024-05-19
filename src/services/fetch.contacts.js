import { createContactsFromData } from "../models/Contact.js";
import contactsData from "../data/contacts.js";
async function fetchContacts() {
  try {
    const contacts = createContactsFromData(contactsData);
    return contacts;
  } catch (error) {
    console.error("Error fetching contacts", error);
    throw error;
  }
}

export { fetchContacts };
