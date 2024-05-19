import { fetchContacts } from "../../services/fetch.contacts.js";
import { fetchUserData } from "../../services/fetch.main-user.js";

// Open chat page using contact
async function openChat(contactId) {
  try {
    const selectedContactId = parseInt(contactId);

    // Clear any existing selected contact ID
    localStorage.removeItem("selectedContactId");
    localStorage.removeItem("currentSenderId");

    const contacts = await fetchContacts();
    const mainUser = await fetchUserData();

    // Find the contact object based on the clicked contact ID
    const selectedContact = contacts.find(
      (contact) => contact.id === selectedContactId
    );

    if (!selectedContact) {
      console.error("Contact not found");
      return;
    }

    localStorage.setItem("currentSenderId", mainUser.id)

    localStorage.setItem("selectedContactId", selectedContactId);
    // console.log("Clicked Contact:", selectedContact);

    window.location.href = `./chat.html?contact=${selectedContact.fullName}`;
  } catch (error) {
    console.error("Error fetching contact data", error);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const contactList = document.getElementById("my-contacts");

  contactList.addEventListener("click", function (event) {
    const target = event.target.closest(".contact-container");
    if (target) {
      const contactId = target.dataset.contactId;
      openChat(contactId);
    }
  });
});
