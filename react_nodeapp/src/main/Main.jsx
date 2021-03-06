import React from 'react';
import Select from "react-select";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import importance_array from '../utils/array_importance';
import {NotesEndpoint} from "../api";

const customStyles={
    control: base=>({
        ...base,
        height: '5vh'
    }),
    valueContainer: base=>({
        ...base,
        height: '5vh'
    })
};

const customStylesDatepicker={
    control: base=>({
        ...base,
        height: '5vh'
    }),
        input: base=>({
        ...base,
        height: '5px'
    })
};


function Post(title_temp, content_temp, importance_temp, due_temp) {

    let response = fetch(NotesEndpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title: title_temp,
            content: content_temp,
            importance: importance_temp,
            due: due_temp,
        }),
    }).then((response) => {
        console.log(response);
        window.location.reload(true);
    });
}


const Main = ({activeNote, onUpdateNote}) => {

    const [state, setState] = useState(null);

        const onEditField = (field, value) => {
            onUpdateNote({
                ...activeNote,
                [field]: value,
            });
            validateForm(field,value);
        };

    function validateForm(field, value) {
        if(!value){
            setState("Title field cannot be empty");
        } else{
            setState(null);
        }
    }

    const [selectedValue, setSelectedValue] = useState(0);
    const [startDate, setStartDate] = useState(new Date());

    const handleChange = e => {
        setSelectedValue(e.value)
    };

        if (!activeNote) return <div className="no-active-note">No Active Note</div>;

        return (
            <div className="app-main">
                <div className="app-main-note-edit">
                    <form>
                    <input
                        type="text"
                        id="title"
                        placeholder="Note Title"
                        value={activeNote.title}
                        onChange={(e) => onEditField("title", e.target.value)}
                    />
                        {state && <p className="app-main-note-error">{state}</p> }
                    </form>
                    <textarea
                        id="content"
                        placeholder="Write your note here..."
                        value={activeNote.content}
                        onChange={(e) => onEditField("content", e.target.value)}
                    />
                    <Select
                        className="app-main-note-edit-dropdown-importance"
                        styles={customStyles}
                        id="importance"
                        options={importance_array}
                        defaultValue={importance_array[0]}
                        onChange={handleChange}
                    />
                    <DatePicker
                        className="app-main-note-edit-dropdown-datepicker"
                        id="due"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        styles={customStylesDatepicker}
                    />
                    <button
                        onClick={() => Post(activeNote.title, activeNote.content, selectedValue, startDate)}>Submit
                    </button>
                </div>
            </div>
        );
    }
;
export default Main;