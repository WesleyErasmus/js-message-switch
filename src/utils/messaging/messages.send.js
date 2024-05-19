import { fetchUserData } from "../../services/fetch.main-user.js";
import { getSelectedContact } from "../chat/chat.data-handler.js";
import { getSenderId } from "../chat/chat.data-handler.js";
import { createMessageTemplate } from "../messaging/messages.handler.js";
import { handleUserSwitch } from "../switch-user.js";
import { switchSender } from "../switch-user.js";

const [selectedContact, mainUser] = await Promise.all([
  getSelectedContact(),
  fetchUserData(),
]);

// Event listener function for the send message text area
document.getElementById("sendMessageBtn").addEventListener("click", () => {
  const messageTextarea = document.getElementById("messageTextarea");
  const message = messageTextarea.value.trim();

  if (message) {
    sendMessage(message);
    messageTextarea.value = "";
  } else {
    console.error("Message cannot be empty");
  }
});

document.getElementById("switch-user-button").addEventListener("click", () => {
  switchSender(mainUser, selectedContact);
});

// Send message to local storage messages array
async function sendMessage(message) {
  if (!selectedContact) {
    console.error("No contact ID found in URL");
    return;
  }

  try {
    if (selectedContact) {
      let messages = JSON.parse(
        localStorage.getItem(`${selectedContact.fullName}`) || "[]"
      );

      const currentSenderId = await getSenderId();
      // console.log(selectedContact);

      let newMessage;
      const timestamp = Date.now();

      if (currentSenderId === "main-user") {
        // console.log("The main user just sent a message");
        newMessage = {
          sender: mainUser.fullName,
          senderId: mainUser.id,
          receiver: selectedContact.fullName,
          receiverId: selectedContact.id,
          text: message,
          timestamp: timestamp,
        };
      } else {
        // console.log("Selected contact just sent a message");
        newMessage = {
          sender: selectedContact.fullName,
          senderId: selectedContact.id,
          receiver: mainUser.fullName,
          receiverId: mainUser.id,
          text: message,
          timestamp: timestamp,
        };
      }

      messages.push(newMessage);

      localStorage.setItem(
        `${selectedContact.fullName}`,
        JSON.stringify(messages)
      );

      document.getElementById("messageTextarea").value = "";

      const messageTemplate = createMessageTemplate();
      const messageContainer = document.querySelector(".message-container");

      if (currentSenderId === mainUser.id) {
        messageTemplate.querySelector(".message-sender-picture").src =
          mainUser.profilePicture;
        messageTemplate.querySelector(".message-text").textContent = message;
        messageTemplate
          .querySelector(".message-bubble")
          .classList.add("selected-contact-message-bubble");
        messageTemplate
          .querySelector(".message-content")
          .classList.add("message-content-right");

        messageContainer.appendChild(messageTemplate);
      } else {
        messageTemplate.querySelector(".message-sender-picture").src =
          selectedContact.profilePicture;
        messageTemplate.querySelector(".message-text").textContent = message;
        messageTemplate
          .querySelector(".message-bubble")
          .classList.add("main-user-message-bubble");
        messageTemplate
          .querySelector(".message-content")
          .classList.add("message-content-left");

        messageContainer.appendChild(messageTemplate);
      }
      
      handleUserSwitch();
    }
  } catch (error) {
    console.error("Send Message Error:", error);
  }
}
