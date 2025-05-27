import { addDoc, collection, db, deleteDoc, doc } from "../firebase";

//add users
const addUser = async (name) => {
  try {
    const usersCollectionRef = collection(db, "users");
    const docRef = await addDoc(usersCollectionRef, { name });
    const userId = docRef.id;

    // Sauvegarder le dictionnaire { name, id } dans le localStorage
    const user = { name, id: userId };
    localStorage.setItem("user", JSON.stringify(user));

    return userId;
  } catch (error) {
    console.error("Error adding user: ", error);
  }
};

const deleteUser = async (userId) => {
  try {
    const user = doc(db, "users", userId);
    await deleteDoc(user);

    localStorage.removeItem("user");
    console.log("Budget supprimé avec succès");
  } catch (error) {
    console.error("Error removing user: ", error);
  }
};

export { addUser, deleteUser };
