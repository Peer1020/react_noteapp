import React, {useState} from 'react';
import uuid from "react-uuid";
import '../App.css';
import Main from '../main/Main';
import Sidebar from '../sidebar/Sidebar';


function Home() {
    const [notes, setNotes] = useState(
        localStorage.notes ? JSON.parse(localStorage.notes) : []
        );

    const [activeNote, setActiveNote] =
        useState(false);

            const onAddNote = () => {

                const newNote = {
                    id: uuid(),
                    title: "Untitled Note",
                    content: "",
                    importance: "",
                    due: "",
                    finished: "finished"
                };

                setNotes([newNote, ...notes]);
                setActiveNote(newNote.id);
            };

            const onUpdateNote = (updatedNote) => {
                    const updatedNotesArr = notes.map((note) => {
                        if (note.id === updatedNote.id) {
                            return updatedNote;
                        }

                        return note;
                    });

                    setNotes(updatedNotesArr);
                };


            const getActiveNote = () => {
                    return notes.find(({id}) => id === activeNote);
                };

            return (
                <div className="App">
                    <Sidebar
                        notes={notes}
                        onAddNote={onAddNote}
                        activeNote={activeNote}
                        setActiveNote={setActiveNote}
                    />
                    <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>
                </div>
            );
}
export default Home;

