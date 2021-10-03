import React, {useEffect, useState} from 'react';
import uuid from "react-uuid";
import './App.css';
import Main from './main/Main';
import Sidebar from './sidebar/Sidebar';
import Editnote from './edit/Editnote';
import {Switch} from "@material-ui/core";
import {BrowserRouter, Route} from "react-router-dom";
import {NotesEndpoint} from "./api";

function App() {

    const [notes, setNotes] = useState([]);

    const [error, setError] = useState();

    const fetchData = () => {
        return fetch(NotesEndpoint, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        ).then(function (response) {
            return response.json();
        }).then(function (myJson) {
            setNotes(myJson);
        }).catch(error => setError("Error fetching data"))
    };

    useEffect(() => fetchData(), []);


    const Dark_Theme = 'dark_theme';
    //  const [theme, setTheme] = useState({darkTheme: false});
    const [theme, setTheme] = useState(checkStyle());
    console.log(theme);

 //   const label = {inputProps: {'aria-label': 'Switch-Demo'}};
    const[label,setLabel]=useState(checkBox);
    const {darkTheme} = theme;

    let className = 'App';
    if (darkTheme) className += Dark_Theme;


    function checkStyle() {
        const check = localStorage.getItem("style");
        if (check === null) {
            return {darkTheme: false};
        } else if (check === "true") {
            return {darkTheme: false}
        } else if (check=== "false"){
            return {darkTheme: true}
        }
        ;

    }
    function checkBox() {
        const check = localStorage.getItem("check");
        if (check === null) {
            return {checked: false};
        } else if (check === "true") {
            return {checked: false}
        } else if (check=== "false"){
            return {checked: true}
        }
        ;

    }

    const SwitchTheme = () => {
        setTheme((prevState) => ({
            darkTheme: !prevState.darkTheme
        }));
        setLabel((prevState) => ({
            checked: !prevState.checked
        }));
        localStorage.setItem("check", label.checked);
        localStorage.setItem("style", theme.darkTheme);
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
                {error && <p role="alert">{error}</p>}
                <Switch
                    {...label}
                    onChange={SwitchTheme}
                />
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