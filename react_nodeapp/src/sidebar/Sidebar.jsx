import {useEffect, useState} from "react";

function Call() {
    const [data, setData] = useState([]);

    useEffect(() => {
        callBackendAPI();
    }, []);

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
    return data
}


const Sidebar = ({
                     notes,
                     onAddNote,
                     onDeleteNote,
                     activeNote,
                     setActiveNote,
                 }) => {

    //  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);
    notes = Call();
    const sortedNotes = notes;


    return (
        <div className="app-sidebar">
            <div className="app-sidebar-header">
                <h1>Notes</h1>
                <button onClick={onAddNote}>Add</button>
            </div>
            <div className="app-sidebar-notes">
                {sortedNotes.map(({id, title, body, lastModified}, i) => (
                    <div
                        className={`app-sidebar-note ${id === activeNote && "active"}`}
                        onClick={() => setActiveNote(id)}>
                        <div className="sidebar-note-title">
                            <strong>{title}</strong>
                            <button onClick={(e) => onDeleteNote(id)}>Delete</button>
                        </div>

                        <p>{body && body.substr(0, 100) + "..."}</p>
                        <small className="note-meta">
                            Last Modified{" "}
                            {new Date(lastModified).toLocaleDateString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;