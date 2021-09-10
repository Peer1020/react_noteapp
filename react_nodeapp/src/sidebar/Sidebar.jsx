import React, {Component, useEffect, useState} from "react";
import history from '../history';

   const Sidebar = ({
                   notes,
                   onAddNote,
                   onUpdateNote,
                    onEditNote,
                   activeNote,
                   setActiveNote,
                   sortedDueNotes
               }) => {

             const [notes2, setNotes2] = useState([]);

             useEffect(() => {
                 const fetchData = async () => {
                     const response = await fetch('/notes');
                     const json = await response.json();
                     setNotes2(json);
                 }
                 fetchData();

             }, [setNotes2]);



                function sortByCreatedDate() {
                    setNotes2([...notes2].sort((a, b) => a._id.localeCompare(b._id)))
                }

                function sortByDate() {
                    setNotes2([...notes2].sort((a, b) => Date.parse(b.due) - Date.parse(a.due)))
                }

                function sortByImportance() {
                    setNotes2([...notes2].sort((a, b) => b.importance - a.importance))
                }

                    return (
                        <div className="app-sidebar">
                            <div className="app-sidebar-header">
                                <h1>Notes</h1>
                                <button onClick={onAddNote}>Add</button>
                                <button onClick={sortByCreatedDate}>Sort Created Date</button>
                                <button onClick={sortByDate}>Sort By Due Date</button>
                                <button onClick={sortByImportance}> Sort By Importance</button>
                            </div>
                            <div className="app-sidebar-notes">
                                 {notes2.map(({_id, title, content, importance, due, finished}, i) => (
                                    <div className={`app-sidebar-note ${_id === activeNote && "active"}`}>
                                        <div className="sidebar-note-title">
                                            <strong>{title}</strong>
                                            <button onClick={onEditNote}>Edit</button>
                                        </div>

                                        <p>{content && content.substr(0, 100) + "..."}</p>
                                        <p>{importance}</p>
                                        <small className="note-meta">
                                            Due{" "}
                                            {new Date(due).toLocaleDateString("en-GB", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </small>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );

            ;
}
export default Sidebar;