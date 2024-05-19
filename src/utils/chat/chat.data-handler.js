import { User } from "../../models/User.js";
import { fetchUserData } from "../../services/fetch.main-user.js";
import { fetchContacts } from "../../services/fetch.contacts.js";

export async function getSelectedContact() {
  const storedContactId = localStorage.getItem("selectedContactId");

  const contacts = await fetchContacts();
  const selectedContact = contacts.find(
    (contact) => contact.id === parseInt(storedContactId)
  );
  return selectedContact;
}

export async function setSenderId() {
  try {
    const mainUser = await fetchUserData();
    const mainUserId = mainUser.id;
    const selectedContact = await getSelectedContact();
    const selectedContactId = selectedContact.id;

    const storedContactId = localStorage.getItem("selectedContactId");

    if (storedContactId !== selectedContactId) {
      localStorage.setItem("selectedContactId", selectedContactId);
      // console.log("New ID set to", selectedContactId);
    } else {
      localStorage.setItem("selectedContactId", mainUserId);
      // console.log("New ID set to", mainUserId);
    }
  } catch (error) {
    console.error("Error fetching user or contact data:", error);
  }
}

export async function getSenderId() {
  const senderId = localStorage.getItem("currentSenderId");

  // console.log("The current sender Id is: ", senderId);
  return senderId;
}

// Function to display contact details on the chat page
export async function displayContact(contact) {
  if (contact) {
    const contactProfilePicture = document.querySelectorAll(
      ".header-profile-picture"
    );
    contactProfilePicture.src = contact.profilePicture;
    const userName = document.querySelector(".contact-user-name");
    userName.textContent = contact.fullName;
  } else {
    console.error("Contact not found");
  }
}

// Function to display user data on the chat page
export async function displayMainUser(user) {
  if (user) {
    const mainUser = new User(
      user.id,
      user.fullName,
      user.profilePicture,
      user.messages
    );

    const mainUserProfilePicture = document.querySelectorAll(
      ".main-user-profile-picture"
    );
    mainUserProfilePicture.forEach((profilePicture) => {
      profilePicture.src = mainUser.profilePicture;
    });
  } else {
    console.error("Failed to load user data");
  }
}

async function closeChat() {
  try {
    localStorage.removeItem("selectedContactId");
    localStorage.removeItem("currentSenderId");

    window.location.href = "../../index.html";
  } catch (error) {
    console.error("Error clearing selected contact ID:", error);
  }
}
const exitChatButton = document.getElementById("exit-chat-button");
exitChatButton.addEventListener("click", async () => {
  await closeChat();
});

export async function displayUserData() {
  const selectedContact = await getSelectedContact();
  const mainUser = await fetchUserData();

  displayMainUser(mainUser);
  displayContact(selectedContact);
}
