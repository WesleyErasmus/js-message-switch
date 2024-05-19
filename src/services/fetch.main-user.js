import { User } from "../models/User.js";
import mainUser from "../data/main-user.js";

async function fetchUserData() {
  try {
    // Create a User instance with the mainUser data
    const user = new User(
      mainUser.id,
      mainUser.fullName,
      mainUser.profilePicture,
      mainUser.messages
    );

    return user;
  } catch (error) {
    console.error("Error fetching user data", error);
    throw error;
  }
}

export { fetchUserData };
