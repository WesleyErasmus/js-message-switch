import { fetchUserData } from "../services/fetch.main-user.js";
import {
  getSelectedContact,
  getSenderId,
} from "../utils/chat/chat.data-handler.js";

const [selectedContact, mainUser] = await Promise.all([
  getSelectedContact(),
  fetchUserData(),
]);

// Handle switch user button visibility
window.addEventListener("storage", () => {
  handleUserSwitch();
});

let currentSender;

export async function handleUserSwitch() {
  const storedChat = JSON.parse(
    localStorage.getItem(`${selectedContact.fullName}`) || "[]"
  );

  if (!storedChat) {
    localStorage.setItem(`${selectedContact.fullName}`, "[]");
  }

  const switchUserButton = document.getElementById("switch-user-button");

  if (storedChat?.length > 0) {
    switchUserButton.classList.remove("hidden");
  } else {
    switchUserButton.classList.add("hidden");
  }

  const currentSenderId = localStorage.getItem("currentSenderId");

  if (currentSenderId && currentSenderId !== "main-user") {
    currentSender = await getSelectedContact();
  } else {
    currentSender = mainUser;
  }

  // Update localStorage with current sender ID
  localStorage.setItem("currentSenderId", currentSender.id);
}
handleUserSwitch();

export async function switchSender() {
  const selectedContact = await getSelectedContact();

  const senderProfilePicture = document.getElementById(
    "switched-user-profile-picture"
  );
  senderProfilePicture.src = currentSender.profilePicture;
  const switchedUserName = document.getElementById("switched-user-name");
  switchedUserName.textContent = currentSender.fullName;

  currentSender = currentSender.id === mainUser.id ? selectedContact : mainUser;

  localStorage.setItem("currentSenderId", currentSender.id);

  const senderUserNameElement = document.querySelector(".sender-user-name");
  senderUserNameElement.textContent = currentSender.fullName;

  // console.log("New sender ID is", currentSender.id);
  // console.log(currentSender);
}

export async function displayCurrentSender() {
  const currentSenderId = await getSenderId();

  const senderProfilePicture = document.getElementById(
    "switched-user-profile-picture"
  );
  const senderUserNameElement = document.getElementById("switched-user-name");
  const senderUserName = document.querySelector(".sender-user-name");

  const mainUserProfilePicture = document.querySelectorAll(
    ".main-user-profile-picture"
  );
  mainUserProfilePicture.forEach((profilePicture) => {
    profilePicture.src = mainUser.profilePicture;
  });

  if (currentSenderId === "main-user") {
    senderProfilePicture.src = selectedContact.profilePicture;
    senderUserName.textContent = mainUser.fullName;
    senderUserNameElement.textContent = selectedContact.fullName;
  } else {
    senderProfilePicture.src = mainUser.profilePicture;
    senderUserName.textContent = selectedContact.fullName;
    senderUserNameElement.textContent = mainUser.fullName;
  }
}
