import React, {useCallback, useEffect, useState} from "react";
import history from '../history';
import {CheckBox} from "react-native-web";
import {FormControlLabel, makeStyles} from "@material-ui/core";
import importance_array from '../utils/array_importance';
import {NotesEndpoint} from "../api";

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
                     setActiveNote
                 }) => {


    const [sortBy, setSortBy] = useState(loadSortByFromStorage())

    const [filterDone, setFilterDone] = useState(loadFilterFromStorage())

    const [notes, setNotes] = useState([])

    const [error, setError] = useState(null);


    useEffect(() => {
        loadNotes();
    }, [setNotes])

    async function loadNotes() {
        const fetchData = async () => {
            const response = await fetch(NotesEndpoint);
            if (response.status === 200) {
                const json = await response.json();
                setNotes(json);
            } else {
                setError("Error fetching data from Server.");
            }
        }
        fetchData();
    }

    function loadSortByFromStorage() {
        const sortBy = localStorage.getItem("sortBy")
        if (sortBy === null) {
            localStorage.setItem("sortBy", "create-date");
            return "create-date" // Default sorting
        } else {
            return sortBy;
        }
    }

    function loadFilterFromStorage(){
        const filter = localStorage.getItem("filter_state")
        if (filter === "default") {
            return false
        } else {
            return true;
        }
    }

    function changeSortBy(sortBy) {
        setSortBy(sortBy)
        localStorage.setItem("sortBy", sortBy);
    }

    function changeFilter(sortBy) {
        setFilterDone(prev => !prev);
        if (filterDone===false) {
            localStorage.setItem("filter_state", sortBy);
            changeSortBy("filter");
        }
        else {
            localStorage.setItem("filter_state", "default");
            changeSortBy("filter_out");
        }
    }

    const label = {inputProps: {'arial-label': 'Checkbox'}};

    const classes = filterStyles();

    function _navigateToUrl(url) {
        history.push({
            pathname: url
        });
        window.location.reload(true);
    }

    const getSortedAndFilteredNotes = () =>  {

        let temp = notes

        if (filterDone) {
            temp = temp.filter(note => note.finished === true);
        }

        if (sortBy === "create-date") {
            return [...temp].sort((a,b) => b._id.localeCompare(a._id));
        } else if (sortBy === "due-date") {
            return [...temp].sort((a, b) => Date.parse(b.due) - Date.parse(a.due));
        } else if (sortBy === "importance") {
            return [...temp].sort((a, b) => b.importance - a.importance);
        } else if (sortBy === "filter") {
            return [...temp].filter(note => note.finished === true);
        } else {
            return temp;
        }
    }

    return (
        <div className="app-sidebar">
            <div className="app-sidebar-header">
                <h1>Notes</h1>
                <button onClick={onAddNote}>Add</button>
                <button onClick={() => changeSortBy("create-date")}>Sort Created Date</button>
                <button onClick={() => changeSortBy("due-date")}>Sort Due Date</button>
                <button onClick={() => changeSortBy("importance")}> Sort Importance</button>
            </div>
            <FormControlLabel
                classes={classes}
                label={"Filter finished notes"}
                control={
                    <CheckBox
                        {...label}
                        classes={classes}
                        value={filterDone}
                        onClick={() => changeFilter("filter")}
                    >Checkbox</CheckBox>
                }
            />
            {error && <h4 role="alert">{error}</h4>}
            <div className="app-sidebar-notes">
                {notes && getSortedAndFilteredNotes().map(({_id, title, content, importance, due, finished}, i) => (
                    <div key={i} className={`app-sidebar-note ${_id === activeNote && "active"}`}
                         onClick={() => setActiveNote(_id)}>
                        <div className="sidebar-note-title">
                            <strong>{title}</strong>
                            <button onClick={() => _navigateToUrl('notes/' + _id)}>Edit</button>
                        </div>
                        <p>{content && content.substr(0, 100) + "..."}</p>
                        <p>{importance_array[importance].label}</p>
                        <small className="note-meta">
                            Due{" "}
                            {new Date(due).toLocaleDateString("en-GB", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </small>
                        <div> Finished <CheckBox key={i} value={finished}/></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Sidebar;