import {
  getSelectedContact,
  displayUserData,
  setSenderId,
} from "../chat/chat.data-handler.js";
import { fetchUserData } from "../../services/fetch.main-user.js";
import { displayCurrentSender } from "../switch-user.js";

const [selectedContact, mainUser] = await Promise.all([
  getSelectedContact(),
  fetchUserData(),
]);

function loadCurrentSender() {
  const checkSenderId = localStorage.getItem("currentSenderId");

  if (checkSenderId === null) {
    displayUserData();
    setSenderId();
    // console.log("ran displayUserData");
  } else {
    displayCurrentSender();
    // console.log("did not run displayUserData function");
  }
}
loadCurrentSender();

// Render sender messages
async function renderMessages() {
  const messageContainer = document.querySelector(".message-container");

  const messages = JSON.parse(
    localStorage.getItem(`${selectedContact.fullName}`) || "[]"
  );

  messages.sort((a, b) => a.timestamp - b.timestamp);

  messages.forEach((message) => {
    const messageTemplate = createMessageTemplate();
    const profilePictureElement = messageTemplate.querySelector(
      ".message-sender-picture"
    );
    const messageBubble = messageTemplate.querySelector(".message-bubble");
    const floatDirection = messageTemplate.querySelector(".message-content");

    // Set profile picture based on sender
    if (message.senderId === mainUser.id) {
      profilePictureElement.src = mainUser.profilePicture;
      messageBubble.classList.add("selected-contact-message-bubble");
      floatDirection.classList.add("message-content-right");
    } else {
      profilePictureElement.src = selectedContact.profilePicture;
      messageBubble.classList.add("main-user-message-bubble");
      floatDirection.classList.add("message-content-left");
    }

    messageTemplate.querySelector(".message-text").textContent = message.text;
    messageContainer.appendChild(messageTemplate);
  });
}

// Create receiver message speech bubble template
function createMessageTemplate() {
  const messageTemplate = document.getElementById("message-template");
  return messageTemplate.content.cloneNode(true);
}

renderMessages();

export { createMessageTemplate };
