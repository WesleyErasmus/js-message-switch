import { User } from "../models/User.js"; 
import { fetchUserData } from "../services/fetch.main-user.js";

// Function only used on for index.html page
async function displayUserData () {
    const user = await fetchUserData();

    if (user) {
        const mainUser = new User (
            user.id,
            user.fullName,
            user.profilePicture,
            user.messages
        );

        const profilePicture = document.querySelector('.main-user-profile-picture');
        profilePicture.src = mainUser.profilePicture;
        const userName = document.querySelector('.main-user-name');
        userName.textContent = mainUser.fullName;
    } else {
        console.error('Failed to load main user data');
    };
}

displayUserData();