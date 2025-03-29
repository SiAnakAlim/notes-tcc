

document.addEventListener("DOMContentLoaded", () => {
    const notesList = document.getElementById("notesList");
    const addNoteButton = document.getElementById("addNote");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const pagination = document.getElementById("pagination");

    let notes = [];
    let currentPage = 1;
    const notesPerPage = 2;

    const fetchNotes = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/notes`);
            notes = await response.json();
            displayNotes();
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    const displayNotes = () => {
        notesList.innerHTML = "";
        const start = (currentPage - 1) * notesPerPage;
        const end = start + notesPerPage;
        const paginatedNotes = notes.slice(start, end);

        paginatedNotes.forEach(note => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");
            noteElement.innerHTML = `
                <strong>${note.title}</strong>
                <p>${note.content}</p>
                <button class="update-btn" onclick="updateNote(${note.id}, '${note.title.replace(/'/g, "\\'")}', '${note.content.replace(/'/g, "\\'")}')">✏️</button>
                <button class="delete-btn" onclick="deleteNote(${note.id})">&times;</button>
            `;
            notesList.appendChild(noteElement);
        });

        updatePagination();
    };

    const updatePagination = () => {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(notes.length / notesPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.classList.add("page-btn");
            if (i === currentPage) pageBtn.classList.add("active");

            pageBtn.addEventListener("click", () => {
                currentPage = i;
                displayNotes();
            });

            pagination.appendChild(pageBtn);
        }
    };

    addNoteButton.addEventListener("click", async () => {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        if (!title || !content) return;

        try {
            await fetch(`${BASE_URL}/api/notes`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content })
            });

            titleInput.value = "";
            contentInput.value = "";
            fetchNotes();
        } catch (error) {
            console.error("Error adding note:", error);
        }
    });

    window.deleteNote = async (id) => {
        if (confirm("Are you sure you want to delete this note?")) {
            try {
                await fetch(`${BASE_URL}/api/notes/${id}`, { method: "DELETE" });
                fetchNotes();
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    window.updateNote = async (id, oldTitle, oldContent) => {
        const newTitle = prompt("Enter new title:", oldTitle);
        const newContent = prompt("Enter new content:", oldContent);

        if (newTitle !== null && newContent !== null) {
            try {
                await fetch(`${BASE_URL}/api/notes/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ title: newTitle, content: newContent })
                });

                fetchNotes();
            } catch (error) {
                console.error("Error updating note:", error);
            }
        }
    };

    fetchNotes();
});