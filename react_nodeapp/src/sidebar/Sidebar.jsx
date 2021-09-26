import React, {useEffect, useState} from "react";
import history from '../history';
import {CheckBox} from "react-native-web";
import {FormControlLabel, makeStyles} from "@material-ui/core";

const filterStyles = makeStyles(theme => ({
    root: {
        marginLeft: '26px'
    },
    label: {
        marginLeft: '10px',
        marginTop: '5px'
    },
}));


const Sidebar = ({
                     onAddNote,
                     activeNote,
                 }) => {

    const storedDataTemp = () => {
        const temp = localStorage.getItem("sort")
        if (temp === "null") {
            localStorage.setItem("sort", []);
            return []
        } else {
            return JSON.parse(localStorage.getItem("sort"));
        }
    };

    const storedData = storedDataTemp();

    const [notes2, setNotes2] = useState(storedData);

    useEffect(() => {
            if (notes2.length === 0) {
                const fetchData = async () => {
                    const response = await fetch('/notes');
                    const json = await response.json();
                    setNotes2(json);
                }
                fetchData();
            }
        },
        [setNotes2]);


    function sortByCreatedDate() {
        setNotes2([...notes2].sort((a, b) => a._id.localeCompare(b._id)))
    }

    function sortByDate() {
        setNotes2([...notes2].sort((a, b) => Date.parse(b.due) - Date.parse(a.due)))
    }


    function sortByImportance() {
        setNotes2([...notes2].sort((a, b) => b.importance - a.importance))
    }

    localStorage.setItem("sort", JSON.stringify(notes2));

    const [stateFinished, setStateFinished] = useState(false);
    const label = {inputProps: {'arial-label': 'Checkbox'}};

    async function filterFinished() {
        if (stateFinished === false) {
            setNotes2([...notes2].filter((a) => a.finished === true));
            setStateFinished(true);
        } else {
            setStateFinished(false);
            /*    window.location.reload(true) */
            const response = await fetch('/notes');
            const json = await response.json();
            setNotes2(json);
        }
    }

    const classes = filterStyles();

    function _navigateToUrl(notes1) {
        history.push({
            pathname: notes1
        });
        window.location.reload(true);
    }

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-header">
                <h1>Notes</h1>
                <button onClick={onAddNote}>Add</button>
                <button onClick={sortByCreatedDate}>Sort Created Date</button>
                <button onClick={sortByDate}>Sort Due Date</button>
                <button onClick={sortByImportance}> Sort Importance</button>
            </div>
            <FormControlLabel
                classes={classes}
                label={"Filter finished notes"}
                control={
                    <CheckBox
                        {...label}
                        classes={classes}
                        value={stateFinished}
                        onClick={filterFinished}
                    />}
            />
            <div className="app-sidebar-notes">
                {notes2.map(({_id, title, content, importance, due, finished}, i) => (
                    <div className={`app-sidebar-note ${_id === activeNote && "active"}`}>
                        <div className="sidebar-note-title">
                            <strong>{title}</strong>
                            <button onClick={() => _navigateToUrl('notes/' + _id)}>Edit</button>
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
                        <p> Finished <CheckBox value={finished}/></p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Sidebar;