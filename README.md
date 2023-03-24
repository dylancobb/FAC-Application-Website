# Planning
- I will largely follow the layout plan of my Hobby Page, as that seems appropriate here. Namely:
    - A fixed navbar at the top of the screen, with links + icons to smoothly scroll to the various page sections.
    - A large title at the top of the page, followed by smaller sectional titles.
    - A simple colour scheme, and simple and effective typography, using Open Sans for the body text, and Domine for the page title and subheadings.
- I will depart from this scheme by putting some of the HTML/CSS/JavaScript chops acquired since the Hobby Page project to use 😁, by:
    - Having the page switch to a togglable menu in the top navbar when viewed on small mobile screens, by manipulating the display of objects and using some kind of `toggleMenu()` function.
    - More actively using JavaScript DOM manipulation throughout the page in general.
# Building
- Standard HTML/CSS boilerplate code to start out.
- Top navbar implemented. For the mobile-style sliding menu, I used media queries to selectively display either the full menu, or a mobile-style single icon to open a sliding side menu. These were then further controlled via JavaScript.
- I implemented a screen-covering `<div>` just below the menu, which fades in when the mobile sidebar menu is opened, and fades out when it is closed. Before fading in and after fading out its display is set to "none" so it remains invisible, and it also has an onclick property which closes the menu, so that clicking outside the menu acts as an alternative way to close it.
- Dummy text was implemented to make the remaining basic style decisions.
- I implemented my Project Gallery code for the portfolio, but changed the functionality a little to support multi-paragraph display and be easier to open and close without having to scroll down to find the "Show Less" button.
- I slowly swapped out the dummy text with hand-written prose.
# Debugging
- Getting the menu to display correctly took a *lot* of tweaking. There were a lot of different window-resizing and menu-state eventualities to account for, and failing to do so led to the top navbar disappearing if you increased the window size after opening and closing the side-menu, and similar bugs.
- Achieving the right font size and margins/spacing at different viewport sizes took some tweaking and A/B testing different values.
- Integrating the project gallery cards with this page created a problem where hovering over image thumbnails would cause them to suddenly be rendered on top of the navbar. Adding a large z-index to the navbar fixed this.