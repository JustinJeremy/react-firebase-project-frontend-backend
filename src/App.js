import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
} from "firebase/firestore";
import "./App.css";
function App() {
const [note, setNote] = useState("");
const [notes, setNotes] = useState([]);
const notesCollection = collection(db, "notes");
// CREATE
const addNote = async () => {
if (note.trim() === "") return;
await addDoc(notesCollection, {
text: note,
createdAt: new Date()
});
setNote("");
fetchNotes();
};
// READ
const fetchNotes = async () => {
const data = await getDocs(notesCollection);
setNotes(
data.docs.map((doc) => ({
...doc.data(),
id: doc.id
}))
);
};
// DELETE
const deleteNote = async (id) => {
const noteDoc = doc(db, "notes", id);
await deleteDoc(noteDoc);
fetchNotes();
};
useEffect(() => {
fetchNotes();
}, []);
return (
  <div className="container">
    <h1>Frontend and Backend Demo</h1>
    
    <div className="input-section">
      <input
        type="text"
        placeholder="Write a thought..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <button onClick={addNote}>Add</button>
    </div>

    <div className="notes">
      {notes.map((n) => (
        <div className="note" key={n.id}>
          <p>{n.text}</p>
          <button onClick={() => deleteNote(n.id)}>Remove</button>
        </div>
      ))}
    </div>
  </div>
);
}
export default App;