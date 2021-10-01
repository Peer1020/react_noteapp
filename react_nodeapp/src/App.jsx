import React, {useEffect, useState} from 'react';
import uuid from "react-uuid";
import './App.css';
import Main from './main/Main';
import Sidebar from './sidebar/Sidebar';
import Editnote from './edit/Editnote';
import {Switch} from "@material-ui/core";
import {BrowserRouter, Route} from "react-router-dom";

function App() {

    const [notes, setNotes] = useState([]);

    const [error, setError] = useState(null);

    const fetchData = () => {
        return fetch('NotesEndpoint', {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            setNotes(myJson);
        }).catch(setError("Error fetching data from Server."));
    }

    useEffect(() => fetchData(), []);

    const Dark_Theme = 'dark_theme';
    const [theme, setTheme] = useState({darkTheme: false});
    const label = {inputProps: {'aria-label': 'Switch-Demo'}};
    const {darkTheme} = theme;
    let className = 'App';
    if (darkTheme) className += Dark_Theme;

    const SwitchTheme = () => {
        setTheme((prevState) => ({
            darkTheme: !prevState.darkTheme
        }))
    }

    const [activeNote, setActiveNote] =
        useState(-1);

    const onAddNote = () => {

        const newNote = {
            _id: uuid(),
            title: "Untitled Note",
            content: "",
            importance: "",
            due: Date.now(),
            finished: "finished"
        };

        {
            setNotes([newNote, ...notes]);
        }
        setActiveNote(newNote._id);
    };

    const onEditNote = () => {

        const EditNote = {
            _id: uuid(),
            title: "Untitled Note",
            content: "",
            importance: "",
            due: Date.now(),
            finished: "finished"
        };
        setActiveNote(getActiveNote());
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
        return notes.find(({_id}) => _id === activeNote);
    };

    return (
        <BrowserRouter>
            <div
                className={className}>
                <Switch
                    {...label}
                    onChange={SwitchTheme}
                />
                {error && <h4 role="alert">{error}</h4>}
                <Route exact path="/">
                    <Sidebar
                        className={className}
                        notes={notes}
                        onAddNote={onAddNote}
                        activeNote={getActiveNote()}
                        setActiveNote={setActiveNote}
                        onEditNote={onEditNote}
                    />
                    <Main
                        className={className}
                        activeNote={getActiveNote()}
                        onUpdateNote={onUpdateNote}
                    />
                </Route>
                <Route path="/notes/:id">
                    <Editnote
                        activeNote={getActiveNote()}
                        onUpdateNote={onUpdateNote}
                        onEditNote={onEditNote}
                    />
                </Route>
            </div>
        </BrowserRouter>
    );
}
export default App;