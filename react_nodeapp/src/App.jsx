import React, {Component, useEffect, useState} from 'react';

import uuid from "react-uuid";
import './App.css';
import Main from './main/Main';
import Sidebar from './sidebar/Sidebar';
import Editnote from './edit/Editnote';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Drawer, Link, SwipeableDrawer, Switch} from "@material-ui/core";
import Routes from "./Routes";
import {BrowserRouter, Route, Router} from "react-router-dom";

const Stack = createNativeStackNavigator();


function App() {

    const [notes, setNotes] =
        useState( []
        );

    const fetchData = () => {
        return fetch('/notes', {
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
            setNotes(myJson);
        });
    }

    useEffect(() => fetchData(), []);

    /*test*/

    const [singleNote, setSingleNote] =
        useState(localStorage.singleNote
            ? JSON.parse(localStorage.singleNote) : []
        );


    const fetchSingleData = () => {
        return fetch('/notes/' + singleNote.id, {
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
            setSingleNote(myJson);
        });
    }

    useEffect(() => fetchSingleData(), []);


    /*  test   */

    const [activeNote, setActiveNote] =
        useState(-1);

    const sortedDueNotes = () => {
        console.log(notes.sort((a, b) => b.due - a.due));
        return notes.sort((a, b) => b.due - a.due);
    };

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


    /* test */
    const onEditNote = () => {

        console.log("edit note pressed")

        const EditNote = {
            _id: uuid(),
            title: "Untitled Note",
            content: "",
            importance: "",
            due: Date.now(),
            finished: "finished"
        };


        {
            // setSingleNote([getActiveNote(), ...singleNote]);
        }
        setActiveNote(getActiveNote());

    };


    const onDeleteNote = (noteId) => {
        setNotes(notes.filter(({id}) => id !== noteId));
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
        console.log(notes.find(({_id}) => _id === activeNote));
        return notes.find(({_id}) => _id === activeNote);
    };

    return (
        <BrowserRouter>
            <div className="App">

                <Sidebar
                    notes={notes}
                    onAddNote={onAddNote}
                    activeNote={getActiveNote()}
                    setActiveNote={setActiveNote}
                    sortedDueNotes={sortedDueNotes}
                    onEditNote={onEditNote}
                />
                <Route exact path="/">
                    <Main
                        activeNote={getActiveNote()}
                        onUpdateNote={onUpdateNote}
                    />
                </Route>
                <Route path="/notes/">
                    <Editnote
                        activeNote={getActiveNote()}
                        onEditNote={onEditNote}
                    />
                </Route>
            </div>
        </BrowserRouter>
    );
}

export default App;
