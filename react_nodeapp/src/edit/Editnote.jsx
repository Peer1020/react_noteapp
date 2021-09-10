import React, {Component, useEffect} from 'react';
import ReactMarkdown from "react-markdown";
import Select, {components} from "react-select";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@material-ui/core/Checkbox";


const importance = [
    {value: '', label: 'Select importance',},
    {value: 1, label: 'Blocker'},
    {value: 2, label: 'Critical'},
    {value: 3, label: 'Major'},
    {value: 4, label: 'Minor'},
    {value: 5, label: 'Trivial'},
];


const CustomSelectProps = props => {
    const [clickCount, setClickCount] = useState(0);

    const onClick = e => {
        setClickCount(clickCount + 1);
        e.preventDefault();
        e.stopPropagation();
    };
}

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
    control: base => ({
        ...base,
        height: '5vh'
    }),
    input: base => ({
        ...base,
        height: '5px'
    })
};


function Update(id_temp, title_temp, content_temp, importance_temp, due_temp) {

    let response = fetch("/notes/" + id_temp, {
        method: "PUT",
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
    });
}


const Editnote = ({activeNote, onUpdateNote}) => {

        const onEditField = (field, value) => {
            onUpdateNote({
                ...activeNote,
                [field]: value,
                due: value,
            });
        };

        const [notes3, setNotes3] = useState([]);

        useEffect(() => {
            const fetchSingleData = async () => {
                const response = await fetch('/notes/',notes3._id);
                const json = await response.json();
                setNotes3(json);
            }
            fetchSingleData(notes3._id);

        }, [setNotes3]);


        const [selectedValue, setSelectedValue] = useState(0);
        const [startDate, setStartDate] = useState(new Date());

        const handleChange = e => {
            setSelectedValue(e.value)
        };

        const [finishState, setFinishedState] = React.useState({
            checkedA: true,
            checkedB: false,
        });

        const handleCheckbox = (event) => {
            setFinishedState({...finishState, [event.target.name]: event.target.checked});
        };


        if (!activeNote) return <div className="no-active-note">No Active Note</div>;

        return (
            <div className="app-main">
                <div className="app-main-note-edit">
                    <strong>{notes3.title}</strong>
                    <input
                        type="text"
                        id="title"
                        placeholder="Note Title"
                        value={activeNote.title}
                        onChange={(e) => onEditField("title", e.target.value)}
                        autoFocus
                    />
                    <textarea
                        id="content"
                        placeholder="Write your note here..."
                        value={activeNote.content}
                        onChange={(e) => onEditField("content", e.target.value)}
                    />
                    <Select
                        {...CustomSelectProps}
                        className="app-main-note-edit-dropdown-importance"
                        styles={customStyles}
                        id="importance"
                        options={importance}
                        defaultValue={importance[0]}
                        onChange={handleChange}
                    />
                    <DatePicker
                        id="due"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        styles={customStylesDatepicker}
                    />
                    <Checkbox
                        id="finished"
                        checked={finishState.checkedB}
                        onChange={handleCheckbox}
                    />
                    <button
                        onClick={(e) => Update(activeNote._id, activeNote.title, activeNote.content, selectedValue, startDate)}>Submit
                    </button>
                </div>
                <div className="app-main-note-preview">
                    <h1 className="preview-title">{activeNote.title}</h1>
                    <ReactMarkdown className="markdown-preview">
                        {activeNote.content}
                    </ReactMarkdown>
                </div>
            </div>
        );
    }
;

export default Editnote;