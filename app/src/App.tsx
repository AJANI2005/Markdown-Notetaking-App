import { createContext, useState, useContext, useEffect, useRef } from 'react';
import './App.css'
import markdownit from "markdown-it";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface AppState {
  notes: Note[];
  currentNote: Note;
  markdownRef: React.RefObject<HTMLDivElement | null>;

  // methods
  saveNote: (title: string, content: string) => void;
  newNote: () => void;
  editNote: (note: Note) => void;
  deleteNote: (id: string) => void;
  showMarkdown: (note: Note) => void;
}

const appContext = createContext<AppState | null>(null)
const useApp = () => {
  const context = useContext(appContext);
  if (context === null) {
    throw new Error("useApp must be used within a AppProvider");
  }
  return context
}


const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note>({
    id: crypto.randomUUID(),
    title: "",
    content: "",
  });
  const markdownRef = useRef<HTMLDivElement | null>(null);



  const serverURL = "http://localhost:5000"


  // init
  useEffect(() => {
    // load notes 
    fetch(`${serverURL}/notes`)
      .then((res) => res.json())
      .then((data) => {
        setNotes(data.notes)
      })
  }, [])


  const saveNote = async (title: string, content: string) => {
    const newNote = {
      id: currentNote.id,
      title,
      content,
    };
    // send to server
    const res = await fetch(`${serverURL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    })
    if (res.ok) {
      const note = notes.find((note) => note.id === newNote.id);
      if (!note) {
        setNotes((prevNotes) => [...prevNotes, newNote]);
      }
      setCurrentNote(newNote);
      showMarkdown(newNote);
    } else {
      alert("Failed to save note")
    }
  };

  const deleteNote = async (id: string) => {
    // ask for confirmation
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    const res = await fetch(`${serverURL}/notes/${id}`, {
      method: "DELETE",
    })
    if (res.ok) {
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
    } else {
      alert("Failed to delete note")
    }
  }

  const newNote = () => {
    setCurrentNote({
      id: crypto.randomUUID(),
      title: "",
      content: "",
    });
  }

  const editNote = (note: Note) => {
    showMarkdown(note);
    setCurrentNote(note);
  }

  const showMarkdown = (note: Note) => {
    if (!markdownRef.current) { return }
    const md = markdownit();
    markdownRef.current.innerHTML = md.render(note.content)
  }

  const value: AppState = {
    notes,
    currentNote,
    markdownRef,


    saveNote,
    deleteNote,
    newNote,
    editNote,
    showMarkdown

  }

  return (
    <appContext.Provider value={value}>
      {children}
    </appContext.Provider>
  )
}


function NoteEditor() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { newNote, saveNote, deleteNote, currentNote, showMarkdown } = useApp();

  // sync ui with current note
  useEffect(() => {
    setTitle(currentNote.title)
    setContent(currentNote.content)
  }, [currentNote])

  return (
    <div className="note-editor">
      <header className="note-editor-header">
        <div className="note-editor-icon">📝</div>
        <h1>Markdown Editor</h1>
      </header>
      <div className="note-title">
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div className="note-body">
        <textarea placeholder="Take a note..." value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <div className="note-editor-actions">
        <button className="btn new-btn" onClick={() => {
          newNote()
          setTitle("")
          setContent("")
        }}>New</button>
        <button className="btn save-btn" onClick={() => { saveNote(title, content) }}>Save</button>
        <button className="btn view-btn" onClick={() => showMarkdown(currentNote)}>View</button>
        <button className="btn delete-btn" onClick={() => { deleteNote(currentNote.id) }}>Delete</button>
      </div>
    </div>
  )
}

function NotesList() {
  const { notes, editNote, showMarkdown } = useApp();
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <div className="note" key={note.id}>
          <h2>{note.title}</h2>
          <button onClick={() => showMarkdown(note)}>View</button>
          <button onClick={() => editNote(note)}>Edit</button>
        </div>
      ))}
    </div>
  )
}

function MarkdownViewer() {
  const { markdownRef } = useApp();
  return (
    <div className="markdown-viewer">
      <div id="markdown" ref={markdownRef}></div>
    </div>
  )
}

function App() {

  return (
    <AppContextProvider>
      <div className="app">
        <div className="container">
          <NoteEditor />
          <MarkdownViewer />
        </div>
        <NotesList />
      </div>
    </AppContextProvider>
  )

}

export default App
