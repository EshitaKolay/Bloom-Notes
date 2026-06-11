let folders = JSON.parse(localStorage.getItem("folders")) || [];

let currentFolder = null;
let currentNote = null;

const saveNoteManualBtn = document.getElementById("saveNoteManualBtn");

const folderList = document.getElementById("folderList");
const notesList = document.getElementById("notesList");
const folderTitle = document.getElementById("folderTitle");

const noteTitle = document.getElementById("noteTitle");
const editor = document.getElementById("editor");

const addFolderBtn = document.getElementById("addFolderBtn");
const addNoteBtn = document.getElementById("addNoteBtn");

const folderModal = document.getElementById("folderModal");
const noteModal = document.getElementById("noteModal");

const folderNameInput = document.getElementById("folderNameInput");
const noteNameInput = document.getElementById("noteNameInput");

const saveFolderBtn = document.getElementById("saveFolderBtn");
const saveNoteBtn = document.getElementById("saveNoteBtn");

const cancelFolderBtn = document.getElementById("cancelFolderBtn");
const cancelNoteBtn = document.getElementById("cancelNoteBtn");

const boldBtn = document.getElementById("boldBtn");
const underlineBtn = document.getElementById("underlineBtn");

const imageBtn = document.getElementById("imageBtn");
const imageInput = document.getElementById("imageInput");

const deleteNoteBtn = document.getElementById("deleteNoteBtn");
const shareNoteBtn = document.getElementById("shareNoteBtn");

const themeToggle = document.getElementById("themeToggle");
const searchInput = document.getElementById("searchInput");

let folderEditMode = false;
let folderEditId = null;

let noteEditMode = false;
let noteEditId = null;

/* -------------------- SAVE -------------------- */

function saveData() {
    localStorage.setItem("folders", JSON.stringify(folders));
}

/* -------------------- WELCOME SCREEN -------------------- */

function showWelcomeScreen() {
    notesList.innerHTML = `
        <div class="empty-state">
            <h2>🌸 Welcome to Bloom Notes</h2>

            <br>

            <p>Create or select a folder to begin taking notes.</p>

            <br>

            <p>📁 Create a Folder</p>
            <p>📝 Create a Note</p>
            <p>✍️ Start Writing</p>
            <p>💾 Notes Save Automatically</p>

            <br>

            <p>✨ Happy Note Taking!</p>
        </div>
    `;
}

/* -------------------- FOLDERS -------------------- */

function renderFolders() {

    folderList.innerHTML = "";

    folders.forEach(folder => {

        const div = document.createElement("div");
        div.className = "folder";

        if(currentFolder && currentFolder.id === folder.id){
            div.classList.add("active");
        }

        div.innerHTML = `
            <span class="folder-name">📁 ${folder.name}</span>

            <div class="folder-actions">

                <button class="icon-btn edit-folder">
                    ✏️
                </button>

                <button class="icon-btn delete-folder">
                    🗑️
                </button>

            </div>
        `;

        div.addEventListener("click", (e) => {
            if(
                e.target.classList.contains("edit-folder") ||
                e.target.classList.contains("delete-folder")
            ){
                return;
            }
            currentFolder = folder;
            /* Clear editor when switching folders */
            currentNote = null;
            noteTitle.value = "";
            editor.innerHTML = "";
            renderFolders();
            renderNotes();
        });
        div.querySelector(".edit-folder")
            .addEventListener("click", () => {

                folderEditMode = true;
                folderEditId = folder.id;

                folderNameInput.value = folder.name;
                folderModal.classList.add("show");
            });

        div.querySelector(".delete-folder")
            .addEventListener("click", () => {

                if(!confirm("Delete folder?")) return;

                folders = folders.filter(f => f.id !== folder.id);

                if(currentFolder?.id === folder.id){
                    currentFolder = null;
                    currentNote = null;

                    folderTitle.textContent = "Select Folder";

                    noteTitle.value = "";
                    editor.innerHTML = "";

                    showWelcomeScreen();
                }

                saveData();
                renderFolders();
            });

        folderList.appendChild(div);
    });

}

/* -------------------- NOTES -------------------- */

function renderNotes() {

    if(!currentFolder){
        showWelcomeScreen();
        return;
    }

    folderTitle.textContent = currentFolder.name;

    notesList.innerHTML = "";

    if(currentFolder.notes.length === 0){

        notesList.innerHTML = `
            <div class="empty-state">
                <h3>📝 No Notes Yet</h3>
                <br>
                <p>Click "+ Note" to create your first note.</p>
            </div>
        `;

        return;
    }

    currentFolder.notes.forEach(note => {

        const card = document.createElement("div");
        card.className = "note-card";

        if(currentNote && currentNote.id === note.id){
            card.classList.add("active");
        }

        card.innerHTML = `
            <div class="note-title">
                ${note.title}
            </div>

            <div class="note-preview">
                ${(note.content || "").replace(/<[^>]*>/g,"").slice(0,60)}
            </div>

            <div class="note-actions">

                <button class="icon-btn edit-note">
                    ✏️
                </button>

                <button class="icon-btn delete-note">
                    🗑️
                </button>

            </div>
        `;

        card.addEventListener("click", (e) => {

            if(
                e.target.classList.contains("edit-note") ||
                e.target.classList.contains("delete-note")
            ){
                return;
            }

            currentNote = note;

            noteTitle.value = note.title;
            editor.innerHTML = note.content || "";

            renderNotes();
        });

        card.querySelector(".edit-note")
            .addEventListener("click", () => {

                noteEditMode = true;
                noteEditId = note.id;

                noteNameInput.value = note.title;
                noteModal.classList.add("show");
            });

        card.querySelector(".delete-note")
            .addEventListener("click", () => {

                if(!confirm("Delete note?")) return;

                currentFolder.notes =
                    currentFolder.notes.filter(
                        n => n.id !== note.id
                    );

                if(currentNote?.id === note.id){
                    currentNote = null;
                    noteTitle.value = "";
                    editor.innerHTML = "";
                }

                saveData();
                renderNotes();
            });

        notesList.appendChild(card);
    });

}

/* -------------------- ADD FOLDER -------------------- */

addFolderBtn.addEventListener("click", () => {

    folderEditMode = false;
    folderNameInput.value = "";

    folderModal.classList.add("show");
});

saveFolderBtn.addEventListener("click", () => {

    const name = folderNameInput.value.trim();

    if(!name) return;

    if(folderEditMode){

        const folder =
            folders.find(f => f.id === folderEditId);

        folder.name = name;

        if(currentFolder?.id === folder.id){
            folderTitle.textContent = name;
        }

    }else{

        folders.push({
            id: Date.now(),
            name,
            notes:[]
        });

    }

    saveData();
    renderFolders();

    folderModal.classList.remove("show");
});

cancelFolderBtn.addEventListener("click", () => {
    folderModal.classList.remove("show");
});

/* -------------------- ADD NOTE -------------------- */

addNoteBtn.addEventListener("click", () => {

    if(!currentFolder){
        alert("Create or select a folder first.");
        return;
    }

    noteEditMode = false;
    noteNameInput.value = "";

    noteModal.classList.add("show");
});

saveNoteBtn.addEventListener("click", () => {

    const title = noteNameInput.value.trim();

    if(!title) return;

    if(noteEditMode){

        const note =
            currentFolder.notes.find(
                n => n.id === noteEditId
            );

        note.title = title;

        if(currentNote?.id === note.id){
            noteTitle.value = title;
        }

    }else{

        currentFolder.notes.push({
            id: Date.now(),
            title,
            content:""
        });

    }

    saveData();
    renderNotes();

    noteModal.classList.remove("show");
});

cancelNoteBtn.addEventListener("click", () => {
    noteModal.classList.remove("show");
});

/* -------------------- TEXT FORMAT -------------------- */

boldBtn.addEventListener("click", () => {
    document.execCommand("bold");
});

underlineBtn.addEventListener("click", () => {
    document.execCommand("underline");
});

/* -------------------- IMAGE UPLOAD -------------------- */

imageBtn.addEventListener("click", () => {
    imageInput.click();
});

imageInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if(!file) return;

    const reader = new FileReader();

    reader.onload = function(event){

        document.execCommand(
            "insertImage",
            false,
            event.target.result
        );

        saveCurrentNote();
    };

    reader.readAsDataURL(file);
});

/* -------------------- AUTO SAVE -------------------- */

function saveCurrentNote(){

    if(!currentNote) return;

    currentNote.title = noteTitle.value;
    currentNote.content = editor.innerHTML;

    saveData();
    renderNotes();
}


noteTitle.addEventListener("input", saveCurrentNote);
editor.addEventListener("input", saveCurrentNote);

/* -------------------- MANUAL SAVE -------------------- */

saveNoteManualBtn.addEventListener("click", () => {

    if(!currentFolder){
        alert("📁 Select a folder first.");
        return;
    }

    const title = noteTitle.value.trim();
    const content = editor.innerHTML;

    if(!title){
        alert("📝 Enter a note title.");
        return;
    }

    if(!currentNote){

        const newNote = {
            id: Date.now(),
            title: title,
            content: content
        };

        currentFolder.notes.push(newNote);

        currentNote = newNote;

    }else{

        currentNote.title = title;
        currentNote.content = content;

    }

    saveData();
    renderNotes();

    alert("💾 Note Saved Successfully!");
});

/* -------------------- SHARE NOTE -------------------- */

shareNoteBtn.addEventListener("click", async () => {

    if(!currentNote){
        alert("Select a note first.");
        return;
    }

    const text = `
${currentNote.title}

${editor.innerText}
`;

    try{

        if(navigator.share){

            await navigator.share({
                title: currentNote.title,
                text: editor.innerText
            });

        }else{

            await navigator.clipboard.writeText(text);

            alert("📤 Note copied to clipboard!");
        }

    }catch(error){
        console.log(error);
    }

});

/* -------------------- DELETE CURRENT NOTE -------------------- */

deleteNoteBtn.addEventListener("click", () => {

    if(!currentFolder || !currentNote) return;

    if(!confirm("Delete current note?")) return;

    currentFolder.notes =
        currentFolder.notes.filter(
            n => n.id !== currentNote.id
        );

    currentNote = null;

    noteTitle.value = "";
    editor.innerHTML = "";

    saveData();
    renderNotes();
});

/* -------------------- SEARCH -------------------- */

searchInput.addEventListener("input", () => {

    const value =
        searchInput.value.toLowerCase();

    const cards =
        document.querySelectorAll(".note-card");

    cards.forEach(card => {

        const text =
            card.innerText.toLowerCase();

        card.style.display =
            text.includes(value)
            ? "block"
            : "none";
    });

});

/* -------------------- DARK MODE -------------------- */

function updateThemeIcon(){

    if(document.body.classList.contains("dark")){
        themeToggle.textContent = "🌞";
    }else{
        themeToggle.textContent = "🌙";
    }

}

if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark");
}

updateThemeIcon();

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark")
            ? "dark"
            : "light"
    );

    updateThemeIcon();
});

/* -------------------- DRAG DROP IMAGE -------------------- */

editor.addEventListener("dragover", e => {

    e.preventDefault();
    editor.classList.add("dragover");
});

editor.addEventListener("dragleave", () => {
    editor.classList.remove("dragover");
});

editor.addEventListener("drop", e => {

    e.preventDefault();

    editor.classList.remove("dragover");

    const file = e.dataTransfer.files[0];

    if(!file) return;

    if(!file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = function(event){

        document.execCommand(
            "insertImage",
            false,
            event.target.result
        );

        saveCurrentNote();
    };

    reader.readAsDataURL(file);
});

/* -------------------- INITIAL -------------------- */

renderFolders();

if(folders.length > 0){

    currentFolder = folders[0];

    renderFolders();
    renderNotes();

}else{

    showWelcomeScreen();

}
