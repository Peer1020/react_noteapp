import React, {Component, useEffect, useState} from 'react';
import uuid from "react-uuid";
import './App.css';
import Main from './main/Main';
import Sidebar from './sidebar/Sidebar';

function App() {

    const [notes, setNotes] = useState(
        localStorage.notes ? JSON.parse(localStorage.notes) : []
    );
    const [activeNote, setActiveNote] = useState(false);

    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    const onAddNote = () => {
        const newNote = {
            id: uuid(),
            title: "Untitled Note",
            body: "",
            lastModified: Date.now(),
        };

        setNotes([newNote, ...notes]);
        setActiveNote(newNote.id);
    };

    const onDeleteNote = (noteId) => {
        setNotes(notes.filter(({ id }) => id !== noteId));
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
        return notes.find(({ id }) => id === activeNote);
    };


    /*
    useEffect(() => {
        callBackendAPI();
    }, []);

    const [data, setData] = useState([]);
    //data.map((item) => <p>{item.title},{item.content}</p>


    //   {
    //     data.map(({title, content, importance, due, finished}, i) => (
    //       <p> {title},
    //         {content},
    //       {importance},
    //     {due},
    //   {finished} </p>
    //     ))
    //   }


// fetching the GET route from the Express server which matches the GET route from server.js
    const callBackendAPI = async () => {
        const response = await fetch('/notes', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(function (response) {
            console.log(response)
            return response.json();
        }).then(function (myJson) {
            console.log(myJson)
            setData(myJson);
        });

    }

*/
    return (
        <div className="App">
            <Sidebar
                notes={notes}
                onAddNote={onAddNote}
                onDeleteNote={onDeleteNote}
                activeNote={activeNote}
                setActiveNote={setActiveNote}
            />
            <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
        </div>


    );
}

export default App;
