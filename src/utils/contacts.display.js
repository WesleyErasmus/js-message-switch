import { fetchContacts } from "../services/fetch.contacts.js";

function createContactTemplate() {
  const contactTemplate = document.getElementById("contact-template");
  return contactTemplate.content.cloneNode(true);
}

// Display contacts on the home page (index.html) contact list component
async function displayContacts() {
  try {
    const contacts = await fetchContacts();
    const contactList = document.getElementById("my-contacts");

    contacts.forEach((contact) => {
      const contactElement = createContactTemplate();
      const checkForMessages = localStorage.getItem(contact.fullName);

      contactElement.querySelector(".contact-container").dataset.contactId =
        contact.id;
      contactElement.querySelector(".contact-profile-picture").src =
        contact.profilePicture;
      contactElement.querySelector(".contact-name").textContent =
        contact.fullName;

      const isMessageNotification = contactElement.querySelector(".messages");

      if (checkForMessages) {
        isMessageNotification.textContent = "You Have Messages";
        isMessageNotification.style.color = "#4682B4";
        isMessageNotification.style.fontWeight = "bold";
      } else {
        isMessageNotification.textContent = "No Messages";
      }

      contactList.appendChild(contactElement);
    });
  } catch (error) {
    console.error("Error displaying contacts", error);
  }
}
displayContacts();

async function clearAllChats() {
  const contacts = await fetchContacts();

  contacts.forEach((contact) => {
    const checkForMessages = localStorage.getItem(contact.fullName);
    if (checkForMessages) {
      localStorage.removeItem(contact.fullName);
    }
  });
}

document.getElementById("clear-chats-button").addEventListener("click", () => {
  clearAllChats();
  window.location = window.location.href;
});