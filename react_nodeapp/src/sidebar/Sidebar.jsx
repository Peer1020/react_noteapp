import React, {useEffect, useState} from "react";
import history from '../history';
import {CheckBox} from "react-native-web";
import {FormControlLabel, makeStyles} from "@material-ui/core";
import importance_array from '../utils/array_importance';

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

    const bold_Theme = 'bold_theme';
    const [theme1, setTheme1] = useState({boldTheme: false});
    const {boldTheme} = theme1;
    let className = 'test';
    if (boldTheme) className += bold_Theme;

    const SwitchTheme = () => {
        setTheme1((prevState) => ({
            boldTheme: !prevState.boldTheme
        }))
    }


    function sortByCreatedDate() {
        setNotes2([...notes2].sort((a, b) => b._id.localeCompare(a._id)));
        setTheme1((prevState) => ({
            boldTheme: !prevState.boldTheme}));
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
                <button
                    className="test"
                    onClick={sortByCreatedDate}
                >Sort Created Date</button>
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
                    <div className={`app-sidebar-note ${_id === activeNote && "active"}`}
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
                        <p> Finished <CheckBox value={finished}/></p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default Sidebar;