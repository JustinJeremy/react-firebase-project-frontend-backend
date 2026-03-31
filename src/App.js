import { useState, useEffect } from "react";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import "./App.css";

function App() {
  // --- STATE FOR STUDENT RECORDS ---
  const [studentName, setStudentName] = useState("");
  const [course, setCourse] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [students, setStudents] = useState([]);

  // --- STATE FOR THOUGHTS ---
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);

  // Collections
  const studentsCollection = collection(db, "students");
  const notesCollection = collection(db, "notes");

  // --- STUDENT LOGIC ---
  const addStudent = async () => {
    if (!studentName.trim() || !course.trim() || !yearLevel) return;
    await addDoc(studentsCollection, {
      name: studentName,
      course: course,
      yearLevel: yearLevel,
      createdAt: new Date()
    });
    setStudentName("");
    setCourse("");
    setYearLevel("");
    fetchStudents();
  };

  const fetchStudents = async () => {
    const q = query(studentsCollection, orderBy("createdAt", "desc"));
    const data = await getDocs(q);
    setStudents(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // --- THOUGHTS LOGIC ---
  const addNote = async () => {
    if (note.trim() === "") return;
    await addDoc(notesCollection, { text: note, createdAt: new Date() });
    setNote("");
    fetchNotes();
  };

  const fetchNotes = async () => {
    const q = query(notesCollection, orderBy("createdAt", "desc"));
    const data = await getDocs(q);
    setNotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteItem = async (id, collectionName) => {
    await deleteDoc(doc(db, collectionName, id));
    collectionName === "students" ? fetchStudents() : fetchNotes();
  };

  useEffect(() => {
    fetchStudents();
    fetchNotes();
  }, []);

  return (
    <div className="container">
      {/* PART 1: STUDENT RECORD SYSTEM (TOP) */}
      <section className="section">
        <h1 className="title">Student Record System</h1>
        <div className="input-group card">
          <input 
            type="text" placeholder="Student Name" 
            value={studentName} onChange={(e) => setStudentName(e.target.value)} 
          />
          <input 
            type="text" placeholder="Course" 
            value={course} onChange={(e) => setCourse(e.target.value)} 
          />
          <select value={yearLevel} onChange={(e) => setYearLevel(e.target.value)}>
            <option value="">Select Year Level</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>
          <button className="add-btn" onClick={addStudent}>Save Record</button>
        </div>

        <div className="grid">
          {students.map((s) => (
            <div className="item-card student-card" key={s.id}>
              <h3>{s.name}</h3>
              <p>{s.course} - Year {s.yearLevel}</p>
              <button className="remove-link" onClick={() => deleteItem(s.id, "students")}>Remove</button>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" />

      {/* PART 2: THOUGHTS DEMO (BOTTOM) */}
      <section className="section">
        <h2 className="subtitle">Frontend and Backend Demo</h2>
        <div className="input-group card">
          <input
            type="text" placeholder="Write a thought..."
            value={note} onChange={(e) => setNote(e.target.value)}
          />
          <button className="add-btn" onClick={addNote}>Add</button>
        </div>

        <div className="grid">
          {notes.map((n) => (
            <div className="item-card thought-card" key={n.id}>
              <p>{n.text}</p>
              <button className="remove-link" onClick={() => deleteItem(n.id, "notes")}>Remove</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default App;