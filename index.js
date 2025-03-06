let versesData = [];

async function loadExcelData() {
    try {
        const response = await fetch("assets/verses.xlsx");
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        versesData = XLSX.utils.sheet_to_json(sheet);

        console.log("Excel Data Loaded:", versesData);
    } catch (error) {
        console.error("Error loading Excel file:", error);
        document.getElementById("verseDisplay").innerHTML = 
            "<p class='text-danger'>Error loading verses. Please check your file.</p>";
    }
}

async function searchVerse() {
    if (versesData.length === 0) {
        await loadExcelData();
    }

    const emotion = document.getElementById("emotionSelect").value.trim().toLowerCase();
    if (!emotion) {
        alert("Please select an emotion.");
        return;
    }

    console.log("Searching for emotion:", emotion);
    const filteredVerses = versesData.filter(row => 
        row.Emotion && row.Emotion.trim().toLowerCase() === emotion
    );

    console.log("Filtered Verses:", filteredVerses);

    if (filteredVerses.length > 0) {
        const randomVerse = filteredVerses[Math.floor(Math.random() * filteredVerses.length)];
        document.getElementById("verseDisplay").innerHTML = `
            <p><strong>${randomVerse.Reference}</strong></p>
            <p>${randomVerse.Verse}</p>
        `;
    } else {
        document.getElementById("verseDisplay").innerHTML = 
            "<p class='text-danger'>No verse found for this emotion.</p>";
    }
}

// Theme Toggle
const toggleThemeButton = document.getElementById("toggleTheme");

function setTheme(mode) {
    if (mode === "dark") {
        document.body.classList.add("dark-mode");
        toggleThemeButton.innerHTML = "☀️";
    } else {
        document.body.classList.remove("dark-mode");
        toggleThemeButton.innerHTML = "🌙";
    }
    localStorage.setItem("theme", mode);
}

toggleThemeButton.addEventListener("click", () => {
    const currentMode = document.body.classList.contains("dark-mode") ? "light" : "dark";
    setTheme(currentMode);
});

// Load saved theme on startup
document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    loadExcelData();
});
