'use strict'; 
/*
 * Sets up, initialises and controls all aspects of the game
 * ---------------------------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Game
{
    constructor(screenSize)
    {       
        this.screenWidth = screenSize.width; 
        this.screenHeight = screenSize.height;
        this.backgroundColor = 0;//black
        //The length of one side of a block. 
        //Since a block is a square, all sides will have the same length.
        this.blockLength = 45; 
        //amount of space to leave to the right and left edges of the screen so that the blocks are center-aligned
        this.horizontalOffset = 0;
        //amount of space to leave to the top and bottom edges of the screen so that the blocks are center-aligned
        this.verticalOffset = 0;
        //Used to set the difficulty for each level
        //The lower the value, the harder the game gets. 
        //The higher the value, the easier the game gets. 
        this.probabilityOfGood = 0.9; 
        //determines how much the probability for good should be reduced for each level
        this.goodnessReduction = 0.05; 
        this.currentLevel = 1;//start from level 1
        this.levelCompleted = false;
        this.gameOver = false;  
        this.paused = false; 
        /*this.blockArray keeps track of game objects and the cells that they occupy in the grid.
         *The values are inteperated as follows:
         *0 - empty space,
         *1 - block 
         *2 - door 
         *3 - saw
         *4 - bug
         *5 - lavaspit
         *6 - coins
         *7 - balls*/
        this.blockArray =
        //the game objects  
        this.blocks = this.doors = this.saws = this.bugs = 
        this.lavaSpits = this.coins = this.balls = [];
        //the position of the player at the start of every level
        this.startingPlayerPosition;   
        this.player; 
        //set up prompts that will be displayed 
        //when the game is over or the game is paused
        this.setupDisplayPrompts(); 
        this.createLevel();
    }
    resize(screenSize)//when the screen is resized
    { 
        //update the screen dimensions
        this.screenWidth = screenSize.width; 
        this.screenHeight = screenSize.height;
        //recreate the current level
        this.createLevel();
    }
    //gets the color of the blocks for each level
    getBlockColorForLevel(level)
    { 
        let colors = 
        [  
            'rgba(95,158,160,0.5)',//cadetblue
            'rgba(255,69,0,0.5)',//orange red
            'rgba(0,128,128,0.5)',//green-ish
            'rgba(240,255,240,0.5)',//honeydew
            'rgba(143,188,143,0.5)',//darkseagreen
            'rgba(119,136,153,0.5)',//lightslategray
            'rgba(255,160,122,0.5)',//light salmon 
            'rgba(0,128,128,0.5)',//teal 
            'rgba(75,0,130,0.5)',//indigo
            'rgba(144,238,144,0.5)',//lightgreen
            'rgba(255,255,240,0.5)',//ivory
            'rgba(107,142,35,0.5)',//olive drab
            'rgba(205,92,92,0.5)',//indian red
            'rgba(72,61,139,0.5)',//darkslateblue
            'rgba(128,128,128,0.5)',//gray
            'rgba(111,222,210,0.5)',//green-ish
            'rgba(165,42,42,0.5)',//brown
            'rgba(0,255,255,0.5)',//cyan
            'rgba(245,245,220,0.5)',//beige
            'rgba(85,107,47,0.5)',//darkolivegreen
            'rgba(255,192,203,0.5)',//pink
            'rgba(189,183,107,0.5)',//dark khaki
            'rgba(222,184,135,0.5)',//burlywood
            'rgba(0,128,100,0.5)',//green-ish
            'rgba(250,235,215,0.5)',//antiquewhite
            'rgba(178,34,34,0.5)',//firebrick
            'rgba(216,191,216,0.5)',//thistle
            'rgba(47,79,79,0.5)',//darkslategray
            'rgba(0,191,255,0.5)',//deepskyblue
            'rgba(160,82,45,0.5)',//sienna
            'rgba(230,230,250,0.5)',//lavender
            'rgba(255,250,205,0.5)',//lemonchiffon
            'rgba(139,0,139,0.5)',//darkmagenta
            'rgba(244,164,96,0.5)',//sandybrown
            'rgba(21,255,215,0.5)',//green-ish
            'rgba(255,228,225,0.5)',//mistyrose
            'rgba(199,21,133,0.5)',//mediumvioletred
            'rgba(176,224,230,0.5)',//powderblue
            'rgba(255,218,185,0.5)',//peachpuff
            'rgba(147,112,219,0.5)',//mediumpurple
            'rgba(100,105,200,0.5)',
            'rgba(128,128,100,0.5)',
            'rgba(222,111,210,0.5)', 
            'rgba(200,128,128,0.5)',
            'rgba(128,0,128,0.5)',//purpleish
            'rgba(200,230,100,0.5)',
            'rgba(201,255,215,0.5)',
            'rgba(10,110,250,0.5)',
            'rgba(255,100,90,0.5)',//brownish
            'rgba(35,100,90,0.5)',
            'rgba(35,100,90,0.5)',//greenish
            'rgba(100,105,200,0.5)',//blue-ish
            'rgba(128,128,100,0.5)',//beigish
            'rgba(50,230,250,0.5)'  
        ];  
        let index = (level -1) % colors.length;   
        return colors[index];  
    }
    setupDisplayPrompts()
    {
        let 
        //prompt to be displayed when the game is paused
        pausedPrompt = 
        `<article id='pausedpopup' class='hide-it'>
            <header> 
                <h1>Paused</h1> 
                <p></p>
                <button type='button' id='resumegamebutton' class='btn btn-warning btn-xs'>Resume Game</button> 
                <p></p>
                <h2>Or press [Esc] to resume game.</h2>  
                <hr> 
            </header>  
            <a href='https://github.com/niitettehtsuru/LockDown'>Github</a> 
        </article>   `,
        //prompt to be displayed when the game is over
        gameoverPrompt = 
        `<article id='gameoverpopup' class='hide-it'>
            <header> 
                <h1>Game Over</h1> 
                <p></p>
                <button type='button' id='startalloverbutton' class='btn btn-primary btn-xs'>Start All Over</button> 
                <p></p>
                <button type='button' id='replaylevelbutton' class='btn btn-warning btn-xs'>Replay Level</button> 
                <p></p>    
                <hr> 
            </header>  
            <a href='https://github.com/niitettehtsuru/LockDown'>Github</a>  
        </article>   `, 
       
        gameStatsPrompt = 
        `<article id='gamestatsindicator'>
            <header> 
                <h2>Level: <span id='levelspan'>1</span></h2>  
                <h2>Lives: <span id='livespan'>3</span></h2> 
                <h2>Coins: <span id='coinspan'>0</span></h2> 
                <h2>Bombs: <span id='bombspan'>4</span></h2> 
            </header>   
        </article>   `; 
        $('body').append(pausedPrompt);  
        $('body').append(gameoverPrompt);
        $('body').append(gameStatsPrompt); 
        document.addEventListener('keydown',(event)=>
        {  
            var x = event.which || event.keyCode; 
            switch(x)
            { 
                case 27: //when esc key is pressed
                    if(!this.gameOver)//if it's not game over
                    {
                        //if game is not paused, pause it.
                        //If game is paused, resume it
                        this.togglePausedState();  
                    } 
                    break;  
            } 
        }); 
        //when player clicks button to resume a paused game
        document.getElementById('resumegamebutton').addEventListener('click',(event)=>
        {   
            this.togglePausedState();//resume the game
        });  
        //when user clicks button to start all over from level 1
        document.getElementById('startalloverbutton').addEventListener('click',(event)=>
        {    
            this.currentLevel = 1; 
            this.gameOver = false; 
            //hide the 'gameover' prompt
            document.getElementById('gameoverpopup').classList.add("hide-it");
            this.player = false;//destroy the player object
            this.createLevel();  
        });
        //when user clicks button to repeat the current level
        document.getElementById('replaylevelbutton').addEventListener('click',(event)=>
        {    
            this.gameOver = false;  
            //hide the 'gameover' prompt
            document.getElementById('gameoverpopup').classList.add("hide-it");
            this.player.lives = 3; //restore the original number of lives
            this.createLevel();   
        });
    } 
    //Pauses and resumes the game
    togglePausedState() 
    {   
        //if game is not paused, pause it.
        //If game is paused, resume it
        this.paused = !this.paused;   
        if(!this.paused)//if the game is resumed
        {   //hide the 'paused' prompt
            document.getElementById('pausedpopup').classList.add("hide-it");
        }
    }
    //sets up the game objects for each level
    createLevel() 
    {
        this.levelCompleted = false; 
        //set the difficulty of the game
        this.probabilityOfGood = 0.9 - ((this.currentLevel-1)*this.goodnessReduction);
        if(this.probabilityOfGood < 0.2)
        {
            this.probabilityOfGood = 0.2; 
        } 
        this.blockArray = [];
        //create new blocks 
        this.blocks = this.createBlocks(); 
        //the position of the player when a new level starts
        this.startingPlayerPosition = this.getStartingPlayerPosition(); 
        this.doors = []; 
        //clears a path in the grid from the player's starting position on the left wall 
        //all the way to the right wall of the screen. 
        //It also sets the position of the door. 
        this.clearPath(); 
        //create other game objects
        this.saws = this.createSaws(); 
        this.bugs = this.createBugs();
        this.lavaSpits = this.createLavaSpits();
        this.coins = this.createCoins(); 
        this.balls = this.createBalls(); 
        /*Explanation: 
         *A new player object is created at the start of each level. 
         *Hence store the number of coins and lives the old player object has. 
         *Then add the old coins and lives to the new player object.*/ 
        if(this.player)//if player already exists
        {  
            //get old coins
            let playerCoins = this.player.numOfCoins; 
            //get old lives
            let playerLives = this.player.lives; 
            this.player = new Player(this);//create new player 
            //add coins and lives to new player object
            this.player.numOfCoins = playerCoins; 
            this.player.lives = playerLives; 
        }
        else//if this is the first time of creating a player
        {  
            this.player = new Player(this);//create new player
        } 
    } 
    //creates balls
    createBalls()
    {    
        let 
        balls = [], 
        //the total number of columns in the grid
        totalNumOfColumns = this.blockArray[0].length,
        //the total number of rows in the grid 
        totalNumOfRows = this.blockArray.length;  
        //starting from the top to the bottom row
        for(let row = 0; row < totalNumOfRows; row++)
        {   //iterate from the first to the last column in search of an empty cell
            for(let column = 0; column < totalNumOfColumns; column++)
            { 
                //player when
                if 
                (  
                    this.startingPlayerPosition.column === column || 
                    this.startingPlayerPosition.column-1 === column ||
                    this.startingPlayerPosition.column+1 === column 
                )
                { 
                    continue; 
                } 
                if
                (
                    this.blockArray[row][column] === 0/*If the cell is empty*/  &&
                    //as the game progresses, the propensity to create balls increases
                    Math.random() > this.probabilityOfGood  
                )
                {   
                    let 
                    //the x-coordinate of the block that contains the coins
                    x = this.horizontalOffset + this.blockLength * column,
                    //the y-coordinate of the block that contains the coins
                    y = this.verticalOffset + this.blockLength * row; 
                    balls.push(new Ball(x + this.blockLength/2, y + this.blockLength/2, this));
                    this.blockArray[row][column] = 7;//mark the cell as occupied coins 
                    if(balls.length >= this.currentLevel/3 || balls.length >= 15)
                    {
                        break; 
                    } 
                }
            }   
            if(balls.length >= this.currentLevel/3 || balls.length >= 15)
            {
                break; 
            } 
        }
        return balls; 
    }
    /**
    * Returns a random number between min (inclusive) and max (exclusive)
    * @param  {number} min The lesser of the two numbers. 
    * @param  {number} max The greater of the two numbers.  
    * @return {number} A random number between min (inclusive) and max (exclusive)
    */
    getRandomNumber(min, max) 
    {
        return Math.random() * (max - min) + min;
    }
    cellIsEnclosed(row,column)
    { 
        let count = 0;   
        //if there is a block or coin to left of the cell
        if(column-1 >= 0 && (this.blockArray[row][column-1] === 1 || this.blockArray[row][column-1] === 6))
        {  
           ++count;  
        }
        //if there is a block or coin to the right of the cell
        if(column+1 < this.blockArray[0].length-1 && (this.blockArray[row][column+1] === 1  || this.blockArray[row][column+1] === 6))
        { 
            ++count;   
        }
        //if there is a block or coin above the cell
        if(row-1 > 0 && (this.blockArray[row-1][column] === 1  || this.blockArray[row-1][column] === 6))
        {  
            ++count;   
        }
        //if there is a block beneath the cell
        if( row+1 < this.blockArray.length-1 && (this.blockArray[row+1][column] === 1 || this.blockArray[row+1][column] === 6)) 
        { 
            ++count;   
        } 
        if(count > 2)
        {
            return true; 
        }
        return false;  
    }
    createCoins()
    {    
        let 
        coins = [], 
        //the total number of columns in the grid
        totalNumOfColumns = this.blockArray[0].length,
        //the total number of rows in the grid 
        totalNumOfRows = this.blockArray.length;  
        //starting from the top to the bottom row
        for(let row = 0; row < totalNumOfRows; row++)
        {   //iterate from the first to the last column in search of an empty cell
            for(let column = 0; column < totalNumOfColumns; column++)
            {
                if
                (
                    this.blockArray[row][column] === 0/*If the cell is empty*/ && 
                    this.cellIsEnclosed(row,column) && 
                    //as the game progresses, the propensity to create coins reduces
                    Math.random() < this.probabilityOfGood  
                )
                {  
                    //the x-coordinate of the block that contains the coins
                    let x = this.horizontalOffset + this.blockLength * column,
                    //the y-coordinate of the block that contains the coins
                    y = this.verticalOffset + this.blockLength * row,
                    delta = this.blockLength/2;//the length and breadth of the square surrounding a coin  
                    //we can pack up to 4 coins in a coin block 
                    let 
                    coordinatesOfCoin1 = {x:x,y:y},
                    coordinatesOfCoin2 = {x:x+delta,y:y},
                    coordinatesOfCoin3 = {x:x,y:y+delta},
                    coordinatesOfCoin4 = {x:x+delta,y:y+delta},
                    coordinates = [coordinatesOfCoin1,coordinatesOfCoin2,coordinatesOfCoin3,coordinatesOfCoin4];
                    //when true,the block is filled with 4 coins.
                    //when false, the block may be filled with anything from 1 to 4 coins.
                    let jackPot = Math.random()> 0.5? true: false; 
                    for(let m = 0; m < coordinates.length; m++) 
                    { 
                        let coord = coordinates[m];
                        let 
                        //x-coordinate of the center of the coin
                        xCenter = coord.x+delta/2, 
                        //y-coordinate of the center of the coin
                        yCenter = coord.y+delta/2;     
                        if(jackPot)
                        {
                            let params = {x:xCenter,y:yCenter,radius:delta/2}; 
                            coins.push(new Coin(params));
                        }
                        else if(Math.random() < this.probabilityOfGood)
                        { 
                            let params = {x:xCenter,y:yCenter,radius:delta/2}; 
                            coins.push(new Coin(params));
                        }
                    } 
                    this.blockArray[row][column] = 6;//mark the cell as occupied coins
                }
            }   
        }
        return coins; 
    }
    createLavaSpits()
    { 
        let 
        hotLava = [], 
        columnLength = this.blockArray[0].length,
        rowLength = this.blockArray.length-1, 
        //the starting x-coordinate of the lava spitter
        xCoordOfLava = 0,
        //the starting y-coordinate of the lava spitter
        yCoordOfLava = 0, 
        southmostBoundary = 0;//the farthest the lava can go south 
        
       //check the first row for a column with an empty cell 
        let row = 0; 
        for(let column = 0; column < columnLength; column++)
        {     
            if(this.blockArray[row][column] === 0/*If the current cell is empty*/&& 
                    this.blockArray[row+1][column] ===0/*and there is NO block beneath it*/)
            { 
                //counts the number of rows from the starting position of the lava spit 
                //to southmost boundary of the dripping lava
                let depthCounter = 1;
                xCoordOfLava = this.horizontalOffset + this.blockLength * column; 
                yCoordOfLava = this.verticalOffset + this.blockLength * row; 
                southmostBoundary  = this.verticalOffset + this.blockLength * (row+2);  
                let startRow = row; 
                //find adjacent cells that are beneath and are also empty
                let tempRow = row; 
                while(tempRow < rowLength -1/*there is a row beneath the current cell*/ && 
                        this.blockArray[tempRow][column] === 0/*and the current cell is empty*/ && 
                        this.blockArray[tempRow+1][column] ===0/*and the cell beneath the current cell is also empty*/)
                {   //update the southmost boundary
                    southmostBoundary  = this.verticalOffset + this.blockLength * (tempRow+2);  
                    tempRow++;//move to the next row
                    depthCounter++;//update the counter
                } 
                row = row> 0? tempRow-1: tempRow; 
                //propensity to create lava spits increase as the game progresses
                if(Math.random() > this.probabilityOfGood && 
                        depthCounter > 4/*if the space beneath the lava spit is more than 4 rows deep*/)
                {
                    let lavaSpitcoordinates = {x:xCoordOfLava,y:yCoordOfLava}; 
                    //create a lava spit
                    hotLava.push(new LavaSpit(lavaSpitcoordinates,southmostBoundary,this.blockLength)); 
                    for(let i = startRow; i < row;i++)
                    {   //mark the related cells as occupied by a lava spit
                        this.blockArray[i][column] = 5;
                    } 
                }
            }  
                
        }  
        return hotLava; 
    }
    createBugs()
    {
        let  
        bugs = [], 
        totalNumOfColumns = this.blockArray[0].length,
        /*Explanation: 
         *Bugs are positioned on top of blocks. 
         *If this.blockArray.length is used, then there may be no 
         *platform to place the bugs on, since it refers to the floor. 
         *Hence, this.blockArray.length - 1 is used since it refers to the blocks that occupy the bottom row.*/
        rowLength = this.blockArray.length-1, 
        //the starting x-coordinate of the bug and the farthest the bug can go left
        xCoordOfBug = 0,
        //the starting y-coordinate of the bug 
        yCoordOfBug = 0, 
        rightmostBoundary = 0;//the farthest the bug can go to the right  
        //starting from the first to the last-but-one row ...
        for(let row = 0; row < rowLength; row++)
        {   //search column by column 
            for(let column = 0; column < totalNumOfColumns; column++)
            {
                if(this.blockArray[row][column] === 0/*If the cell is empty*/&& 
                        this.blockArray[row+1][column] ===1/*and there is a block beneath it*/ )
                { 
                    //Prevents a bug from being placed in the same cell as the player when the game starts
                    //ie, the block on which the player starts must be free of bugs
                    if(this.startingPlayerPosition.row-1 === row && this.startingPlayerPosition.column === column)
                    { 
                        continue; 
                    } 
                    xCoordOfBug = this.horizontalOffset + this.blockLength * column; 
                    yCoordOfBug = this.verticalOffset + this.blockLength * row; 
                    rightmostBoundary  = this.horizontalOffset + this.blockLength * (column+1);
                    //find cells to the right that are also empty and are standing on a block 
                    let startColumn = column;//current column the bug occupies  
                    let tempColumn = column; 
                    while
                    (   tempColumn < totalNumOfColumns //there's a cell to the right
                        &&  this.blockArray[row][tempColumn] === 0 //the cell is empty
                        && this.blockArray[row+1][tempColumn] ===1//there is a block beneath it
                    )
                    {
                        //recalcuate the farthest the bug can go right
                        rightmostBoundary = this.horizontalOffset + this.blockLength * (tempColumn + 1);  
                        tempColumn++;//move to the next cell on the right 
                    } 
                    column = tempColumn-1;
                    let endColumn = tempColumn-1;//the last column the bug can occupy
                    if(Math.random() > this.probabilityOfGood)
                    {   
                        let bugCoordinates = {x:xCoordOfBug,y:yCoordOfBug};
                        //create a new bug
                        bugs.push(new Bug(bugCoordinates,rightmostBoundary,this.blockLength)); 
                        for(let i = startColumn; i < endColumn;i++)
                        {   //mark the cell in the grid as occupied by a bug
                            this.blockArray[row][i] = 4; 
                        }
                        
                    }
                }
            }   
        }
        return bugs; 
    }
    createSaws()
    {
        let 
        saws = [],
        //total number of columns in the grid
        totalNumOfColumns = this.blockArray[0].length,
        //last or bottom row in the grid
        bottomRow = this.blockArray.length-1; 
        //starting from the first to the last column
        for(let column = 0;column < totalNumOfColumns; column++)
        {   //if the bottom cell is empty(there is nothing there)
            if(this.blockArray[bottomRow][column] === 0) 
            {
                if(Math.random() > this.probabilityOfGood)
                {
                    let 
                    xCoordinateOfSaw = this.horizontalOffset + this.blockLength * column,
                    yCoordinateOfSaw = this.verticalOffset + this.blockLength * bottomRow; 
                    //create a new saw
                    saws.push(new Saw({x:xCoordinateOfSaw ,y:yCoordinateOfSaw},this.blockLength)); 
                    //mark the cell in the grid as occupied by a saw 
                    this.blockArray[bottomRow][column] = 3;
                }
            }
        }
        return saws; 
    }
    //create a path from player's starting position to the right edge of the canvas
    clearPath()
    {  
        let 
        columnLength = this.blockArray[0].length,
        rowLength = this.blockArray.length,
        row = this.startingPlayerPosition.row-1, 
        //start from the next column, same row of the player's starting position
        column = this.startingPlayerPosition.column+1; 
        //console.log(`starting position at row: ${row},column: ${column-1}...............`); 
        for( ;column < columnLength; column++)
        {
            if(this.blockArray[row][column] === 0)//if the space is empty
            { 
                let tempRow = row+1;
                //search to see if there is an empty space above.
                if(row > 0/*if there's space above*/ && this.blockArray[row-1][column] === 0/*and the space is empty...*/)
                {  
                    row--;//...continue from that above position
                    //console.log(`space above at row: ${row},column: ${column}`);
                }//if there's no space above, search to see if there's space beneath
                else if(row < rowLength-1)//if there's space beneath
                { 
                    while(true)//find a flat surface 
                    {
                        if(tempRow >= rowLength/*we hit the ground*/ || this.blockArray[tempRow][column] === 1/*a flat surface is found*/)
                        {
                            row = tempRow-1;//continue in the position above the flat surface 
                            //console.log(`flat surface found at row: ${row},column: ${column}`);
                            break; 
                        }
                        tempRow++;//keep searching until a flat surface is found. 
                    }
                } 
                else 
                {
                    //console.log(`no space beneath or above at row: ${row},column: ${column}`);
                } 
                //if there is no space above or beneath, keep the row and move to the next column. 
            }
            else //if the space is occupied(the player may be locked in)
            {  
                //destroy the hindering block 
                this.blockArray[row][column] = 0; 
                for(let i = 0; i < this.blocks.length; i++) 
                {
                    let block = this.blocks[i]; 
                    if(block.rowIndex === row && block.columnIndex === column)
                    {
                        //console.log(`block destroyed at row: ${row},column: ${column}`); 
                        this.blocks.splice(i,1); 
                        break; 
                    }
                }  
            } 
        }
        this.blockArray[row][column-1] = 2;//2 to mark a door 
        let xCoordinateOfDoor = this.horizontalOffset + this.blockLength * (column-1); 
        let yCoordinateOfDoor = this.verticalOffset + this.blockLength *(row);  
        this.doors.push(new Door({x:xCoordinateOfDoor ,y:yCoordinateOfDoor},this.blockLength));  
    }
    //position the player in the first empty square available
    getStartingPlayerPosition()
    {
        let columnLength = this.blockArray[0].length;
        let rowLength = this.blockArray.length;
        let startingPosition = {x:0,y:0,row:0,column:0}; 
        let startingPositionFound = false;
        //search for an empty space from the first to the last column
        for(let column = 0; column < columnLength ;column++)
        {   //for each column, search every row in that column
            for(let row = 0; row < this.blockArray.length; row++)
            {
                //if an empty space is found
                if(this.blockArray[row][column] === 0)
                {   
                    /*We don't want the player to be hanging in the air. 
                     *So we descend row by row until we find a flat surface*/
                    let tempRow = row+1; 
                    while(true)
                    {
                        if
                        (
                            tempRow+1 >= rowLength ||//if we have reached the bottom of the screen
                            this.blockArray[tempRow][column] === 1//or if a flat surface is found
                            
                        )
                        {   //we have found our quarry
                            //set the starting position at the bottom of the candidate block
                            startingPosition.x = this.horizontalOffset + column*this.blockLength; 
                            startingPosition.y = this.verticalOffset + tempRow*this.blockLength; 
                            startingPosition.row = tempRow; 
                            startingPosition.column = column; 
                            break; 
                        }      
                        tempRow++; 
                    }   
                    startingPositionFound = true; 
                    break; 
                }
            }
            if(startingPositionFound)
            {
                break; 
            }
        }
        return startingPosition;  
    }
    createBlocks()
    { 
        let 
        blocks = [], 
        length = this.blockLength,
        color = this.getBlockColorForLevel(this.currentLevel), 
        vertices = this.getBlockVertices(); 
        for(let i = 0; i < vertices.length; i++) 
        {
            let vertex = vertices[i];
            blocks.push(new Block(vertex,length,color,this.blockArray)); 
        };
        return blocks;
    }
    getBlockVertices()
    {
        let 
        row = 0,
        column = 0,
        blockArray = [],
        blockVertices = [],//the upper left coordinates of each block to be created
        //How many blocks can be set on the canvas horizontally?
        numHorizontal = ~~(this.screenWidth/this.blockLength),//num of blocks that can be packed horizontally
        horizontalRemainder = this.screenWidth - this.blockLength * numHorizontal;//the space left when all blocks are packed
        this.horizontalOffset = horizontalRemainder/2;//so an equal space is at the left and right of the screen
        //How many blocks can be set on the canvas vertically? 
        let 
        numVertical = ~~(this.screenHeight/this.blockLength),//num of blocks that can be packed vertically
        verticalRemainder = this.screenHeight - this.blockLength * numVertical;//the space left when all blocks are packed  
        this.verticalOffset = verticalRemainder/2;//so an equal space is at the top and bottom of the screen 
        //get all points in the grid, starting from the top to the bottom
        for(let y = this.verticalOffset; y < this.screenHeight; y+=this.blockLength)
        { 
            let array = []; 
            //if the next point is beyond the bottom edge of the canvas
            if(y+ this.blockLength > this.screenHeight)
            {
                continue; //ignore it
            } 
            column = 0; 
            //all the while, getting all the horizontal points at each level 
            for(let x = this.horizontalOffset; x < this.screenWidth; x+=this.blockLength)
            { 
                //if the next point is beyond the right edge of the canvas
                if(x+this.blockLength > this.screenWidth)
                { 
                    continue; //ignore it 
                } 
                //flip a coin to add or reject the vertex
                if( Math.random() > 0.5)//if vertex is accepted
                {
                    blockVertices.push({x:x,y:y,row:row,column:column});
                    array.push(1);//1 to track the position with a block 
                }
                else 
                {
                    array.push(0);//0 to track the position without a block  
                }
                column++; 
            } 
            row++;
            blockArray.push(array); 
        }
        this.blockArray = blockArray; 
        return blockVertices; 
    } 
    displayPausedPrompt()
    {  
        document.getElementById('pausedpopup').classList.remove("hide-it"); 
    } 
    displayGamoverPrompt() 
    {
        document.getElementById('gameoverpopup').classList.remove("hide-it"); 
    }
    update()
    {     
        if(this.paused)
        {
            this.displayPausedPrompt();
        }
        else if(this.gameOver)
        {
            this.displayGamoverPrompt(); 
        }
        else if(this.levelCompleted)
        {
            ++this.currentLevel;
            this.createLevel();
        }
        else 
        {
            [...this.bugs,...this.lavaSpits,...this.balls].forEach(function(gameObj)
            {
                gameObj.update();
            });
            this.player.update(); 
        }
        //update the game stats    
        $('#levelspan').html(this.currentLevel); 
        $('#livespan').html(this.player.lives); 
        $('#coinspan').html(this.player.numOfCoins); 
        $('#bombspan').html(~~(this.player.maxBombCount/2) - this.player.bombCount/2);  
    }
    draw()//draw all the game objects
    {      
        [...this.blocks,...this.doors,...this.saws,...this.bugs,...this.lavaSpits,...this.coins,...this.balls].forEach(function(gameObj)
        {
            gameObj.draw();
        });   
        this.player.draw(); 
    } 
} 
 