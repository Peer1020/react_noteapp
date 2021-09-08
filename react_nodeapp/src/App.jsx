import React, {Component, useEffect, useState} from 'react';
import {NavigationContainer} from "@react-navigation/native";

import uuid from "react-uuid";
import './App.css';
import Main from './main/Main';
import Sidebar from './sidebar/Sidebar';
import Home from './home/Home'
import Editnote from './edit/Editnote';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {Drawer} from "@material-ui/core";
import Routes from "./Routes";

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
                return notes.find(({id}) => id === activeNote);
            };

        return (
            <div className="App">
                <Sidebar
                    notes={notes}
                    onAddNote={onAddNote}
                    onDeleteNote={onDeleteNote}
                    activeNote={activeNote}
                    setActiveNote={setActiveNote}
                    sortedDueNotes={sortedDueNotes}
                />
                <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote}/>
                <Routes />
            </div>
        );
}
export default App;
