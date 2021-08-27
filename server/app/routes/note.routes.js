module.exports = (app) => {
    const notes = require("../controllers/note.controllers.js");

    // Create a new Note
    app.post("/notes", notes.create);

    // Retrieve all Notes
    app.get("/notes", notes.findAll);

    // Retrieve a single Note with noteId
    app.get("/notes/:noteId", notes.findOne);

    app.get("/notes/sortBy/:sortId", notes.findAll);

    // Update a Note with noteId
    app.put("/notes/:noteId", notes.update);
    app.put("/notes/finished/:noteId", notes.updateFinished);

    // Delete a Note with noteId
    app.delete("/notes/:noteId", notes.delete);
};