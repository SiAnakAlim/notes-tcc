document.addEventListener("DOMContentLoaded", () => {
    // === Bagian Otentikasi ===
    const authContainer = document.getElementById("authContainer");
    const appContainer = document.getElementById("appContainer");
    const registerSection = document.getElementById("registerSection");
    const loginSection = document.getElementById("loginSection");
    const showLogin = document.getElementById("showLogin");
    const showRegister = document.getElementById("showRegister");

    const registerBtn = document.getElementById("registerBtn");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const registerMsg = document.getElementById("registerMsg");
    const loginMsg = document.getElementById("loginMsg");
    
    // === Bagian Aplikasi Notes ===
    const notesList = document.getElementById("notesList");
    const addNoteButton = document.getElementById("addNote");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const pagination = document.getElementById("pagination");
    

    let allNotes = [];
    let currentPage = 1;
    const notesPerPage = 5;

    // Fungsi untuk Refresh Token
    const refreshToken = async () => {
        try {
            const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
                method: "POST",
                credentials: "include", // Mengirim httpOnly cookie
            });

            if (!res.ok) {
                throw new Error("Sesi habis, silakan login kembali.");
            }

            const data = await res.json();
            localStorage.setItem("accessToken", data.accessToken);
            return data.accessToken;
        } catch (error) {
            // Jika refresh gagal, hapus token dan paksa login
            localStorage.removeItem("accessToken");
            updateUI();
            throw error;
        }
    };

    // Wrapper untuk fetch API yang menangani otentikasi & refresh token
    const apiFetch = async (url, options = {}) => {
        let res = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
            },
        });

        // Jika token kedaluwarsa (401 Unauthorized)
        if (res.status === 401) {
            try {
                const newAccessToken = await refreshToken();
                // Ulangi request dengan token baru
                res = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${newAccessToken}`,
                    },
                });
            } catch (error) {
                // Jika refresh token gagal, lempar error untuk ditangani oleh pemanggil
                throw new Error("Gagal memperbarui sesi. Silakan login ulang.");
            }
        }

        return res;
    };

    // Mengatur tampilan UI berdasarkan status login
    const updateUI = () => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            authContainer.style.display = "none";
            appContainer.style.display = "block";
            fetchNotes(); // Langsung ambil data notes jika sudah login
        } else {
            authContainer.style.display = "block";
            appContainer.style.display = "none";
            registerSection.style.display = "none";
            loginSection.style.display = "block";
        }
    };

    // Toggle form login/register
    showRegister.addEventListener("click", (e) => {
        e.preventDefault();
        loginSection.style.display = "none";
        registerSection.style.display = "block";
    });
    showLogin.addEventListener("click", (e) => {
        e.preventDefault();
        registerSection.style.display = "none";
        loginSection.style.display = "block";
    });


    // Register
    registerBtn.addEventListener("click", async () => {
        const username = document.getElementById("regUsername").value.trim();
        const email = document.getElementById("regEmail").value.trim();
        const password = document.getElementById("regPassword").value.trim();
        registerMsg.textContent = "";

        if (!username || !email || !password) {
            registerMsg.textContent = "Semua field wajib diisi!";
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            registerMsg.textContent = res.ok ? "Register berhasil! Silakan login." : (data.message || "Register gagal.");
        } catch (err) {
            registerMsg.textContent = "Terjadi error saat register.";
        }
    });

    // Login
    loginBtn.addEventListener("click", async () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();
        loginMsg.textContent = "";

        if (!email || !password) {
            loginMsg.textContent = "Email dan password wajib diisi!";
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/auth/login`, {
            // const res = await fetch(`http://localhost:3000/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Penting agar refreshToken dalam cookie bisa di-set oleh backend
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("accessToken", data.accessToken);
                updateUI();
            } else {
                loginMsg.textContent = data.message || "Login gagal.";
            }
        } catch (err) {
            loginMsg.textContent = "Terjadi error saat login.";
        }
    });

    // Logout
    logoutBtn.addEventListener("click", async () => {
        try {
            await apiFetch(`${BASE_URL}/auth/logout`, { method: "POST" });
        } catch (error) {
            console.error("Logout error:", error.message);
        } finally {
            localStorage.removeItem("accessToken");
            updateUI();
        }
    });

    // --- LOGIKA APLIKASI NOTES ---

    const fetchNotes = async () => {
        try {
            const response = await apiFetch(`${BASE_URL}/api/notes`);
            if (!response.ok) throw new Error("Gagal mengambil data notes.");
            allNotes = await response.json();
            currentPage = 1; // Reset ke halaman pertama setiap kali fetch
            displayNotes();
        } catch (error) {
            console.error("Error fetching notes:", error);
            // Jika error karena sesi habis, updateUI akan menangani redirect ke login
            if (error.message.includes("login ulang")) {
                updateUI();
            }
        }
    };

    const displayNotes = () => {
        notesList.innerHTML = "";
        const start = (currentPage - 1) * notesPerPage;
        const end = start + notesPerPage;
        const paginatedNotes = allNotes.slice(start, end);

        paginatedNotes.forEach(note => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");
            noteElement.innerHTML = `
                <div>
                    <strong>${note.title}</strong>
                    <p>${note.content}</p>
                </div>
                <div class="note-actions">
                    <button class="update-btn">✏️</button>
                    <button class="delete-btn">&times;</button>
                </div>
            `;
            // Menambahkan event listener secara dinamis (lebih aman dari inline onclick)
            noteElement.querySelector(".update-btn").addEventListener("click", () => updateNote(note.id, note.title, note.content));
            noteElement.querySelector(".delete-btn").addEventListener("click", () => deleteNote(note.id));
            notesList.appendChild(noteElement);
        });

        updatePagination();
    };

    const updatePagination = () => {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(allNotes.length / notesPerPage);

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
            const res = await apiFetch(`${BASE_URL}/api/notes`, {
                method: "POST",
                body: JSON.stringify({ title, content })
            });
            if (!res.ok) throw new Error("Gagal menambah note.");
            titleInput.value = "";
            contentInput.value = "";
            fetchNotes();
        } catch (error) {
            console.error("Error adding note:", error);
        }
    });

    const deleteNote = async (id) => {
        if (confirm("Anda yakin ingin menghapus catatan ini?")) {
            try {
                const res = await apiFetch(`${BASE_URL}/api/notes/${id}`, { method: "DELETE" });
                if (!res.ok) throw new Error("Gagal menghapus note.");
                fetchNotes();
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    const updateNote = async (id, oldTitle, oldContent) => {
        const newTitle = prompt("Masukkan judul baru:", oldTitle);
        const newContent = prompt("Masukkan konten baru:", oldContent);

        if (newTitle !== null && newContent !== null) {
            try {
                const res = await apiFetch(`${BASE_URL}/api/notes/${id}`, {
                    method: "PUT",
                    body: JSON.stringify({ title: newTitle, content: newContent })
                });
                if (!res.ok) throw new Error("Gagal memperbarui note.");
                fetchNotes();
            } catch (error) {
                console.error("Error updating note:", error);
            }
        }
    };

    // Inisialisasi: Periksa status login saat halaman dimuat
    updateUI();
});