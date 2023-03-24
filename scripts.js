let sideBar = false;
const menu = document.getElementById("nav-desktop");
const tinter = document.getElementById("tinter");

// open and close the sidebar on mobile
function toggleMenu() {
    // if sidebar is closed, open it
    if (!sideBar) {
        menu.style.transitionDuration = "0.3s";
        // make tinter display but set its opacity to 0
        tinter.style.display = "block";
        tinter.style.opacity = 0;
        // fade tinter in underneath sidebar
        setTimeout(() => {
            tinter.style.opacity = 0.7;
        }, this.animationDelay + 20);
        // make sidebar display, and have it slide in from left
        menu.style.display = "flex";
        menu.style.left = "-300px";
        setTimeout(() => {
            menu.style.left = "0px";
        }, this.animationDelay + 20);

        sideBar = true;
    }
    // if sidebar is open, close it
    else {
        closeMenu();
    }
}

// close the menu
function closeMenu() {
    if (sideBar) {
        setTimeout(() => {
            menu.style.left = "-300px";
        }, this.animationDelay + 20);
        setTimeout(() => {
            tinter.style.opacity = 0;
        }, this.animationDelay + 20);
        setTimeout(() => {
            menu.style.display = "none";
            tinter.style.display = "none";
            menu.style.left = "0px";
        }, 500);
        sideBar = false;
    }
}

// make sure screen resizes don't break sidebar functionality
window.addEventListener('resize', function (event) {
    // check the current width of the window
    const width = window.innerWidth;
    // make sure top-menu is reset
    if (width > 768) {
        menu.style.transitionDuration = "0s";
        menu.style.display = "flex";
        tinter.style.display = "none";
        sideBar = false;
    // if the side menu was open, leave it open
    } else if (width <= 768 && sideBar) {
        menu.style.display = "flex";
    // if the sidebar was closed, leave it close
    } else if (width <= 768 && !sideBar) {
        menu.style.transitionDuration = "0.3s";
        menu.style.display = "none";
        tinter.style.display = "none";
    }
});

// grab project card text
const descriptions = document.querySelectorAll(".card-text");

// hide project card text by default
descriptions.forEach(element => {
    element.style.display = "none";
});

// toggle project card displays
function showHideDescription(textID, buttonID, ellipsisID) {
    const text = document.querySelector(textID);
    const button = document.querySelector(buttonID);
    const ellipsis = document.querySelector(ellipsisID);

    if (text.style.display === "none") {
        text.style.display = "block";
        button.innerHTML = "Show less";
        ellipsis.style.display = "none";
    } else {
        text.style.display = "none";
        button.innerHTML = "Show more";
        ellipsis.style.display = "inline";
    }
}