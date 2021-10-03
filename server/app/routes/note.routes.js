module.exports = (app) => {
    const notes = require("../controllers/note.controllers.js");

    // Create a new Note
    app.post("/api/notes", notes.create);

    // Retrieve all Notes
    app.get("/api/notes", notes.findAll);

    // Retrieve a single Note with noteId
    app.get("/api/notes/:noteId", notes.findOne);

    app.get("/api/notes/sortBy/:sortId", notes.findAll);

    // Update a Note with noteId
    app.put("/api/notes/:noteId", notes.update);
    app.put("/api/notes/finished/:noteId", notes.updateFinished);

    // Delete a Note with noteId
    app.delete("/api/notes/:noteId", notes.delete);
};