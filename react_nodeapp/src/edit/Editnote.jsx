import React, {useEffect} from 'react';
import Select from "react-select";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@material-ui/core/Checkbox";
import {useParams} from "react-router";
import history from "../history";
import importance_array from '../utils/array_importance';
import {NotesEndpoint} from "../api";

const customStyles = {
    control: base => ({
        ...base,
        height: '5vh'
    }),
    valueContainer: base => ({
        ...base,
        height: '5vh'
    })
};

const customStylesDatepicker = {
    FormControlLabel: base => ({
        ...base,
        height: '5vh'
    }),
    input: base => ({
        ...base,
        height: '5px'
    })
};


function Update(id_temp, title_temp, content_temp, importance_temp, due_temp, finished_temp) {

    let response = fetch(NotesEndpoint + "/" + id_temp, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title_temp,
            content: content_temp,
            importance: importance_temp,
            due: due_temp,
            finished: finished_temp
        }),
    }).then((response) => {
    });
    _navigateToUrl('/')
}

function _navigateToUrl(notes) {
    history.push({
        pathname: notes
    });
    window.location.reload(true);
}


const Editnote = () => {

        const [notes3, setNotes3] = useState({
            notes3: {
                title: "",
                content: "",
                importance: "",
                due: new Date(),
                finished: ""
            }
        });
        const location = useParams();

        const [state, setState] = useState(null);

        useEffect(() => {
            const fetchSingleData = async () => {
                const response = await fetch(NotesEndpoint + "/" + location.id);
                const json = await response.json();
                setNotes3(json);
            }
            fetchSingleData();

        }, [setNotes3]);

        function validateForm(field, value) {
            if (!value) {
                setState("Title field cannot be empty");
            } else {
                setState(null);
            }
        }

        const onEditField = (field, value) => {
            setNotes3({
                ...notes3,
                [field]: value,
            });
            validateForm(field, value);
        };

        return (
            <div className="app-main">
                <div className="app-main-note-edit">
                    <input
                        type="text"
                        id="title"
                        placeholder="Note Title"
                        onChange={(e) => onEditField("title", e.target.value)}
                        value={notes3.title}
                        autoFocus
                    />
                    {state && <p className="app-main-note-error">{state}</p>}
                    <textarea
                        id="content"
                        placeholder="Write your note here..."
                        value={notes3.content}
                        onChange={(e) => onEditField("content", e.target.value)}
                    />
                    <Select
                        className="app-main-note-edit-dropdown-importance"
                        styles={customStyles}
                        id="importance"
                        options={importance_array}
                        value={(importance_array[notes3.importance])}
                        onChange={(e) => onEditField("importance", e.value)}
                    />
                    <DatePicker
                        id="due"
                        selected={Date.parse(notes3.due)}
                        onChange={(e) => onEditField("due", new Date(e))}
                        styles={customStylesDatepicker}
                    />
                    <p>Finished
                        <Checkbox
                            label="Finished"
                            id="finished"
                            checked={(notes3.finished === true) ? "true" : ""}
                            onChange={(e) => onEditField("finished", e.target.checked)}
                        />
                    </p>
                    <section>
                        <button
                            onClick={(e) => Update(location.id, notes3.title, notes3.content, notes3.importance, notes3.due, notes3.finished)}>Update
                        </button>
                    </section>
                    <section>
                        <button
                            onClick={() => _navigateToUrl('/')}>Cancel
                        </button>
                    </section>
                </div>
            </div>
        );
    }
;
export default Editnote;