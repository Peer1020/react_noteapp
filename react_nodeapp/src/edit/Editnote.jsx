import React, {useEffect} from 'react';
import ReactMarkdown from "react-markdown";
import Select from "react-select";
import {useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Checkbox from "@material-ui/core/Checkbox";
import {useParams} from "react-router";


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
    FormControlLabel: base => ({
        ...base,
        height: '5vh'
    }),
    input: base => ({
        ...base,
        height: '5px'
    })
};


function Update(id_temp, title_temp, content_temp, importance_temp, due_temp,finished_temp) {

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
            finished: finished_temp
        }),
    }).then((response) => {
        console.log(response);
    });
}


const Editnote = ({activeNote, onEditNote, onUpdateNote}) => {
        const onEditField = (field, value) => {
            onUpdateNote({
                ...notes3,
                [field]: value,
            });
        };

        const [notes3, setNotes3] = useState([]);
        const location = useParams();

        useEffect(() => {
            const fetchSingleData = async () => {
                const response = await fetch('/notes/'+location.id);
                console.log(response);
                const json = await response.json();
                setNotes3(json);
            }
            fetchSingleData();

        }, [setNotes3]);

        const [selectedValue, setSelectedValue] = useState(
            0);
        const [startDate, setStartDate] = useState(0);



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

        function handleCheckboxCurrentState(){
            if(notes3.finished===true){
                return "true";}
                else return "";
            }

            function handleDate(){
            const date=Date.parse(notes3.due);
            return date;
            }

            function handleImportance(){
            const key=notes3.importance;
            return importance[key];
            }


        return (
            <div className="app-main">
                <div className="app-main-note-edit">
                    <input
                        type="text"
                        id="title"
                        placeholder="Note Title"
                        value={notes3.title}
                        onChange={(e) => onEditField("title", e.target.value)}
                        autoFocus
                    />
                    <textarea
                        id="content"
                        placeholder="Write your note here..."
                        value={notes3.content}
                        onChange={(e) => onEditField("content", e.target.value)}
                    />
                    <Select
                        {...CustomSelectProps}
                        className="app-main-note-edit-dropdown-importance"
                        styles={customStyles}
                        id="importance"
                        options={importance}
                        value={handleImportance()}
                        onChange={handleChange}
                    />
                    <DatePicker
                        id="due"
                        selected={handleDate()}
                        onChange={(date) => setStartDate(date)}
                        styles={customStylesDatepicker}
                    />
                    <p>Finished
                    <Checkbox
                        label="Finished"
                        id="finished"
                        checked={handleCheckboxCurrentState()}
                        onChange={handleCheckbox}
                    />
                    </p>
                    <div>
                    <button
                        onClick={(e) => Update(location.id,notes3.title, notes3.content, notes3.importance, notes3.due,notes3.finished)}>Update
                    </button>
                    </div>
                </div>
                <div className="app-main-note-preview">
                    <h1 className="preview-title">{notes3.title}</h1>
                    <ReactMarkdown className="markdown-preview">
                        {notes3.content}
                    </ReactMarkdown>
                </div>
            </div>
        );
    }
;

export default Editnote;