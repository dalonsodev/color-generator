// GLOBAL VARIABLES
// DOM Elements
const themeToggle = document.getElementById("theme-toggle")
const seedColor = document.getElementById("seed-color")
const selectScheme = document.getElementById("select-scheme")
const selectDisplay = document.querySelector(".select-display")
const options = document.getElementById("options")
const getSchemeBtn = document.getElementById("get-scheme-btn")

// Color bars & HEX codes
const colorBars = [
    document.getElementById("color-one"), 
    document.getElementById("color-two"), 
    document.getElementById("color-three"), 
    document.getElementById("color-four"), 
    document.getElementById("color-five")
]
const hexCodes = [
    document.getElementById("hex-one"),
    document.getElementById("hex-two"),
    document.getElementById("hex-three"),
    document.getElementById("hex-four"),
    document.getElementById("hex-five")
]

const baseUrl = "https://www.thecolorapi.com"
let selectedMode = "monochrome" // default value

// FUNCTIONS
function buildEndpoint() {
    const hexValue = seedColor.value.slice(1)
    return `/scheme?hex=${hexValue}&mode=${selectedMode}&count=5`
}

function getColors(data) {
    const colorsArr = data.colors.map(color => color.hex.value)
    return colorsArr
}

function renderColors(colorsArr) {
    // verify that the arr indeed has 5 elements
    if (colorsArr.length !== 5) {
        console.error(
            "Error: Expected 5 colors but received", colorsArr.length)
        return
    }
    colorBars.forEach((bar, i) => {
        bar.style.background = colorsArr[i]
        hexCodes[i].textContent = colorsArr[i]
    })
}

// EVENT LISTENERS
// Toggle dark/light mode
const domElements = [
    document.getElementById("main"),
    document.getElementById("select-scheme"),
    document.getElementById("options"),
    document.getElementById("get-scheme-btn"),
    document.getElementById("site-title"),
    ...document.querySelectorAll("#options li"),
    ...hexCodes,
]
themeToggle.addEventListener("click", () => {
    domElements.forEach(element => {
        element.classList.toggle("dark")
    })
})

// Add eventListener to each custom select option
const optionItems = document.querySelectorAll("#options li")
optionItems.forEach(item => {
    item.addEventListener("click", (e) => {
        optionItems.forEach(opt => 
            opt.classList.remove("selected-option"))
        item.classList.add("selected-option")
        selectedMode = item.dataset.value
        selectDisplay.textContent = item.textContent
        e.stopPropagation()
    })
})

// Click selectScheme -> Toggle options visibility
selectScheme.addEventListener("click", () => {
    options.classList.toggle("hidden")
})

// Close options container when click outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".select-wrapper")) {
        options.classList.add("hidden")
    }
})

// Click getSchemeBtn btn
getSchemeBtn.addEventListener("click", () => {
    fetch(`${baseUrl}${buildEndpoint()}`)
        .then(res => {
            if (!res.ok) throw new Error("API response error")
            return res.json()
        })
        .then(data => getColors(data))
        .then(colorsArr => renderColors(colorsArr))
        .catch(err => {
            console.log(err)
            alert("Unable to get color scheme. Please, try again later.")
        })
})


// INITIAL LOAD (default colors) ----> it smells!!
fetch(`${baseUrl}${buildEndpoint()}`)
    .then(res => {
        if (!res.ok) throw new Error("API response error");
        return res.json();
    })
    .then(data => getColors(data))
    .then(colorsArr => renderColors(colorsArr))
    .catch(err => console.error(err));