const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: String,
    content: String,
    importance: Number,
    due: Date,
    finished: Boolean,
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);