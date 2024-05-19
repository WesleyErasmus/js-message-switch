export class Contact {
  constructor(id, fullName, profilePicture, messages = []) {
    this.id = id;
    this.fullName = fullName;
    this.profilePicture = profilePicture;
    this.messages = messages;
  }
}

export function createContactsFromData(data) {
  return data.map(({ id, fullName, profilePicture, messages }) => {
    return new Contact(id, fullName, profilePicture, messages);
  });
}
