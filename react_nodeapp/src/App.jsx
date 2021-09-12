import React, {Component, useEffect, useState} from 'react';

import uuid from "react-uuid";
import './App.css';
import Main from './main/Main';
import Sidebar from './sidebar/Sidebar';
import Editnote from './edit/Editnote';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Drawer, Link, Switch} from "@material-ui/core";
import Routes from "./Routes";
import {BrowserRouter, Route} from "react-router-dom";

const Stack = createNativeStackNavigator();


function App() {

    const [notes, setNotes] =
        useState(localStorage.notes
                 ? JSON.parse(localStorage.notes) : []
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
            return fetch('/notes/'+singleNote.id, {
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
                    id: uuid(),
                    title: "Untitled Note",
                    content: "",
                    importance: "",
                    due: Date.now(),
                    finished: "finished"
                };

            {
                setNotes([newNote, ...notes]);
            }                setActiveNote(newNote.id);
            };


        /* test */
        const onEditNote = (i) => {

                const EditNote = {
                    id: uuid(),
                    title: "Untitled Note",
                    content: "",
                    importance: "",
                    due: Date.now(),
                    finished: "finished"
                };

            {
                setSingleNote([EditNote[i], ...singleNote]);
            }                setActiveNote(EditNote[i]);
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
                       <Route path="/">
                            <Sidebar
                                notes={notes}
                                onAddNote={onAddNote}
                                onDeleteNote={onDeleteNote}
                                activeNote={activeNote}
                                setActiveNote={setActiveNote}
                                sortedDueNotes={sortedDueNotes}
                                onEditNote={onEditNote}
                            />
                            <Main
                                activeNote={getActiveNote()}
                                onUpdateNote={onUpdateNote}
                            />
                        </Route>
                             <Route path="/notes/">
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
