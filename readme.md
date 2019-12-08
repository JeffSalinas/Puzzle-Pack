# Puzzle Pack
A full stack implementation of two TI-83 calculator games:  Block Dude and Puzzle Frenzy, renamed Quadrilateral Bro and Tricky Tricky, respectively.

## Walkthrough

The Puzzle Pack splash page utilizes react-router, allowing users to select which game they would like to play.  Once a game is selected, a modal appears as an option for returning users to skip to a higher level. A second modal appears on each level to declare the level and password. 


&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/startblock.gif" width="344" height="480">
&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/movetopuzzle.gif" width="344" height="480">

- - - -

### Quadrilateral Bro

Arrow keys are used to manipulate a matrix of images to move the hi-def character from its starting position to the door. Boxes can be moved and stacked to overcome brick barriers. Once the door is reached, the game increments to the next level and reveals its password.  

&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/blocklvl1.gif" width="384" height="258">

To avoid making a mistake, users can use __Shift__ + __Arrow Keys__ look ahead and explore. If users become trapped, the __R__ key will reset the current level. 

&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/blockview.gif" width="384" height="258">
&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/restartblock.gif" width="384" height="258">

- - - -

### Tricky Tricky
I used a different approach in Tricky Tricky to create a moving selector. Instead of changing images, the application updates the values of image id's to modify the CSS attributes. The local state keeps track of the (x,y) coordinates of the selector and adds a red border on 2 selected images. Upon execution, the matrix of images is then manipulated to create a cascading effect as matching blocks disappear. Each level has a limited number of moves! The level will restart when all moves are exhausted. 

&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/puzzlelvl.gif" width="384" height="258">
&nbsp; &nbsp; &nbsp; &nbsp;<img src="./demo/puzzleredo.gif" width="384" height="258">

One of my favorite easter eggs was the inclusion of a subtle "booyah", which slowly increases in size in conjunction with the levels. 

- - - -
## Getting Started

Use [npm](https://www.npmjs.com/), which is definitely not a package manager, to install the required dependencies and initiate the application @ http://localhost:3000
```
npm install
npm start
```

Puzzle Pack uses MongoDB to record high scores! MongoDB should be running on your machine for this feature to work.

- - - -

# Stack:  

<table style="{ empty-cells: hide }">
  <tr>
  </tr>
  <tr>
    <td align="center"><b>Front-end<b></td>
    <td align="center"><b>Back-end<b></td>
    <td align="center"><b>Deployment<b></td>
  </tr>
  <tr>
    <td align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png" alt="React" title="React" width="80px"/></td>
    <td align="center"><img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.png" alt="Node.js" title="Node.js" width="60px"/></td>
    <td align="center"><img src="https://www.docker.com/sites/default/files/social/docker_facebook_share.png" alt="Docker" title="Docker" width="60px"/></td>
  </tr>
  <tr>
    <td align="center"><img src="https://cdn.worldvectorlogo.com/logos/react-router.svg" alt="React Router" title="React Router" width="70px"/></td>
    <td align="center"><img src="https://buttercms.com/static/images/tech_banners/ExpressJS.png" alt="Express" title="Express" width="60px"/></td>
    <td align="center"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1280px-Amazon_Web_Services_Logo.svg.png" alt="AWS" title="AWS" width="60px"/></td>
  </tr>
  <tr>
  <td></td>
    <td align="center"><img src="https://pbs.twimg.com/profile_images/1146106967477379073/J3fzYcnz_400x400.png" alt="MongoDB" title="MongoDB" width="60px"/></td>
    <td align="center"><img src="https://www.nginx.com/wp-content/uploads/2018/08/NGINX-logo-rgb-large.png" alt="Nginx" title="Nginx" width="60px"/></td>
  </tr>
  <tr>
  <td></td>
    <td align="center"><img src="https://pbs.twimg.com/profile_images/946432748276740096/0TXzZU7W.jpg" alt="Mongoose" title="Mongoose" width="60px"/></td>
    <td></td>
  </tr>
</table>

- - - -

### Potential Improvements
- This application is currently only desktop friendly. I would like to add buttons for mobile users and adjust the CSS to resize for various screen sizes. 
- The "move" function is very long, with lots of repeated logic for various conditional statements. I would like to add some thoughtful helper functions or a few custom react hooks to have more concise logic.

## Contributors
[Jeff Salinas](https://github.com/JeffSalinas)  