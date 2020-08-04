'use strict'; 
/*
 * A player in the game
 * -----------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Player
{
    constructor(game)
    {       
       this.game = game;  
       //Length and breadth of a player. 
       //Since player is a square, length and breadth are the same
       this.length = game.blockLength/3;
       //a small adjustment added to the player position to prevent collisions with blocks and wall
       this.backOff = 0.1; 
       this.color = 'rgba(0,128,0,1)';//green
       //current coordinates of the upper-left vertex of the player
       this.xCoord = this.game.startingPlayerPosition.x; 
       this.yCoord = this.game.startingPlayerPosition.y - this.length - this.backOff;
       //most recent coordinates of the upper-left vertex of the player
       this.xCoordOld = this.xCoord; 
       this.yCoordOld = this.yCoord; 
       //all the blocks in the game 
       this.blocks = game.blocks;
       //all the bugs in the game 
       this.bugs = game.bugs;
       //all the saws in the game
       this.saws = game.saws; 
       this.coins = game.coins;
       this.doors = game.doors;
       this.balls = game.balls; 
       this.numOfCoins = 0; //number of coins the player has collected
       this.lives  = 3; 
       //all the lava spits in the game; 
       this.lavaSpits = game.lavaSpits;
       //vertical force that pushes the player down during jumping
       this.gravity = 0.07; 
       this.unitDistance = 4;//distance the player moves per animation frame 
       this.speed = {x:0,y:0};//make player stationary on start
       //tracks the most recent movement to the left or to the right
       //useful for setting the direction of a bullet
       this.oldHorizontalDirection = this.unitDistance; 
       //true if player has lept into the air, false otherwise 
       this.jumping = false;
       //true if player is falling off the edge of a platform, false otherwise.  
       this.falling = false;
       //true if the up arrow key is pressed, false if it is not pressed or is released
       this.upKeyIsPressed = false;    
       //true if the right arrow key is pressed, false if it is not pressed or is released
       this.rightKeyIsPressed = false;  
       //true if the left arrow key is pressed, false if it is not pressed or is released
       this.leftKeyIsPressed = false;
       this.bullets = [];//bullets fired when player presses the spacebar
       this.bombs = [];//bombs dropped when B key is pressed. 
       this.bombCount = 0; 
       this.maxBombCount = 8; 
       this.setNavigationalControls();//sets player navigation    
    }  
    //sets player navigation 
    setNavigationalControls()
    {      
        document.addEventListener('keydown',(event)=>
        {  
            event.preventDefault();//disable arrow key scrolling in browser 
            switch(event.keyCode)
            {
                case 32://when spacebar is pressed
                        if(!this.game.gameOver && !this.game.paused)
                        {
                            this.shoot(); 
                        }  
                    break; 
                case 37://when left arrow key is pressed 
                        this.leftKeyIsPressed = true;
                        //player can't be going left and right at the same time
                        this.rightKeyIsPressed = false;
                        this.moveLeft();   
                    break; 
                case 39://when right arrow key is pressed   
                        this.rightKeyIsPressed = true; 
                        //player can't be going right and left at the same time
                        this.leftKeyIsPressed = false;  
                        this.moveRight();  
                    break; 
                case 38://when up arrow key is pressed  
                    /*Player can't jump in mid-air. 
                     *Player must be on the floor or on a platform to jump.*/
                    if(!this.jumping && !this.falling)
                    {
                        this.moveUp(); 
                        this.jumping = true; 
                        this.upKeyIsPressed = true; 
                    } 
                    break; 
                case 40://when down arrow key is pressed  
                    //only respond if player has lept into the air 
                    if(this.jumping)
                    {
                        this.moveDown();  
                    } 
                    break;  
                case 66://when the B key is pressed
                    if(this.bombCount < this.maxBombCount && !this.game.gameOver && !this.game.paused)
                    {
                        this.bombCount+=2;
                        this.dropBomb(); 
                    }   
                    break;  
            }
        }); 
        document.addEventListener('keyup',(event)=>
        { 
            event.preventDefault();//disable arrow key scrolling in browser 
            switch(event.keyCode)
            {
                case 37: //when left arrow key is released  
                    this.leftKeyIsPressed = false;
                    this.speed.x = 0;//stop moving left 
                    break; 
                case 39: //when right arrow key is released  
                    this.rightKeyIsPressed = false; 
                    this.speed.x = 0;//stop moving right 
                    break; 
                case 38: //when up arrow key is released 
                    this.upKeyIsPressed = false; 
                    break; 
                case 40: //when down arrow key is released   
                    break;  
            } 
        }); 
    }
    dropBomb()
    { 
        let coordinates = {x:this.xCoord,y:this.yCoord}; 
        /*For some unexplained reason, it takes 2 bombs to blow up the bricks
         *within a blast radius.
         *I'll have to fix it later, but it just works.*/
        this.bombs.push(new Bomb(coordinates,this.length,this.game));
        this.bombs.push(new Bomb(coordinates,this.length,this.game));
    }
    shoot()
    { 
        //let bullet come out from the left edge of the player
        let bulletCoordinates = {x:this.xCoord,y:this.yCoord}; 
        let direction = -1;//let bullet go left  
        if(this.oldHorizontalDirection > 0)//if player is going right
        { 
            //let bullet come out from the right edge of the player
            bulletCoordinates = {x:this.xCoord + this.length,y:this.yCoord}; 
            direction = 1;//let bullet go right
        } 
        this.bullets.push(new Bullet(bulletCoordinates,this.length/3,direction,this.game));  
    }
    //detects collision of player with a block
    hasTouchedABlock(block)
    {
        let 
        topEdgeOfPlayer = this.yCoord + this.length,
        rightEdgeOfPlayer = this.xCoord + this.length,
        leftEdgeOfPlayer = this.xCoord,
        bottomEdgeOfPlayer = this.yCoord,
        topEdgeOfBlock = block.y + block.length,
        rightEdgeOfBlock = block.x + block.length, 
        leftEdgeOfBlock = block.x,
        bottomEdgeOfBlock = block.y;  
        if
        ( 
            leftEdgeOfPlayer < rightEdgeOfBlock && 
            rightEdgeOfPlayer > leftEdgeOfBlock && 
            bottomEdgeOfPlayer < topEdgeOfBlock && 
            topEdgeOfPlayer > bottomEdgeOfBlock
        )
        {
            return true;//there is a collision 
        }
        return false;
    }  
    //detects collision of player with a saw
    hasTouchedASaw(saw)
    {
        let 
        topEdgeOfPlayer = this.yCoord + this.length,
        rightEdgeOfPlayer = this.xCoord + this.length,
        leftEdgeOfPlayer = this.xCoord,
        bottomEdgeOfPlayer = this.yCoord,
        topEdgeOfBlock = saw.y + saw.h,
        rightEdgeOfBlock = saw.x + saw.w, 
        leftEdgeOfBlock = saw.x,
        bottomEdgeOfBlock = saw.y;  
        if
        ( 
            leftEdgeOfPlayer < rightEdgeOfBlock && 
            rightEdgeOfPlayer > leftEdgeOfBlock && 
            bottomEdgeOfPlayer < topEdgeOfBlock && 
            topEdgeOfPlayer > bottomEdgeOfBlock
        )
        {
            return true;//there is a collision 
        }
        return false;
    } 
    hasTouchedACoin(coin)
    {                                                             
        //Find the vertical & horizontal (distX/distY) distances 
        //between the coin’s center and the player’s center.
        let distX = Math.abs(coin.x - this.xCoord - this.length/2);
        let distY = Math.abs(coin.y - this.yCoord - this.length/2); 
        //If the distance is greater than halfCoin + halfPlayer, 
        //then they are too far apart to be colliding.
        if (distX > (this.length/2 + coin.radius)) 
        { 
            return  false; 
        }
        if (distY > (this.length/2 + coin.radius)) 
        { 
            return false; 
        }  
        //If the distance is less than halfPlayer then they are definitely colliding
        if (distX <= (this.length/2)) 
        { 
            return true; 
        } 
        if (distY <= (this.length/2)) 
        { 
            return true; 
        } 
        //test for collision at the paddle corner
        // Think of a line from the paddle center to any paddle corner. Now extend that line by the radius of the ball.
        //If the ball’s center is on that line they are colliding at exactly that paddle corner.
        //Using Pythagoras formula to compare the distance between ball and paddle centers.
        let dx=distX-this.length/2;
        let dy=distY-this.length/2;
        return (dx*dx+dy*dy<=(coin.radius*coin.radius));  
    }
    
    checkDoorCollision()
    {
        let door = this.doors[0];
        if //player is completely inside the door
        ( 
            this.xCoord > door.x && 
            this.xCoord + this.length < door.x + door.length && 
            this.yCoord > door.y && 
            this.yCoord + this.length < door.y + door.length
        )
        {
            this.game.levelCompleted = true;  
        }
            
        /*    
        if(this.hasTouchedABlock(this.doors[0]))
        {
            this.game.levelCompleted = true;  
        } */ 
    }
    checkBallCollision()
    {
        for(let i = 0; i < this.balls.length; i++)
        {     
            let ball = this.balls[i];
            if(this.hasTouchedACoin(ball))
            {   console.log('ball touched'); 
                this.checkGameOver(); 
                break;
            } 
        }
    }
    checkCoinCollision()
    {
        for(let i = 0; i < this.coins.length; i++)
        {
            let coin = this.coins[i];
            if(this.hasTouchedACoin(coin))
            {
                this.coins.splice(i,1); 
                ++this.numOfCoins; 
                if(this.numOfCoins === 100)
                {
                    this.numOfCoins = 0; 
                    this.lives++; 
                }
                break;
            } 
        }
    }
    checkGameOver()
    {
       --this.lives; 
       if(this.lives === 0)//if player has run out of lives
       {   //then it's game over. 
           this.game.gameOver = true; 
       }
       else//if player has one or more lives left 
       {   //replay the same level
           this.game.createLevel(); 
       }
    }
    checkLavaSpitCollision() 
    {
        for(let i = 0; i < this.lavaSpits.length; i++)
        {
            let lavaSpit = this.lavaSpits[i];
            if(this.hasTouchedABlock(lavaSpit))
            {
                this.checkGameOver(); 
                break; 
            } 
            let lava = lavaSpit.lava; 
            for(let j = 0; j < lava.length; j++)
            {
                let lavaDrip = lava[j]; 
                if(this.hasTouchedABlock(lavaDrip))
                {
                    this.checkGameOver(); 
                    break; 
                } 
            }
        }
    }
    checkSawCollision() 
    {
        for(let i = 0; i < this.saws.length; i++)
        {
            let saw = this.saws[i]; 
            if(this.hasTouchedASaw(saw.getPoints()))
            { 
                this.checkGameOver();
                break; 
            }
        }
    } 
    isTouchingLeftWall()
    { 
        if(this.xCoord <= this.game.horizontalOffset)
        {  
            return true;//left wall is touched
        } 
        return false;   
    }
    isTouchingRightWall()
    {   
        if(this.xCoord + this.length >= this.game.screenWidth - this.game.horizontalOffset)
        {  
            return true;//right wall is touched  
        }
        return false;
    }
    hitsHeadAgainstCeiling()
    { 
        if(this.yCoord <= this.game.verticalOffset)
        {    
            return true;//has touched ceiling
        } 
        return false;  
    }
    isStandingOnFloor()
    { 
        if( this.yCoord + this.length >= this.game.screenHeight - this.game.verticalOffset)
        {  
            return true;//has touched the floor 
        } 
        return false;
    }
    moveLeft() 
    {   
        this.speed.x = -this.unitDistance; 
    }
    moveRight() 
    { 
        this.speed.x = this.unitDistance; 
    }
    moveUp()
    { 
        this.speed.y = -this.unitDistance; 
    }
    moveDown()
    {   
        this.speed.y = this.unitDistance; 
    }   
    checkWallCollision()
    {
        if (this.hitsHeadAgainstCeiling())
        {  
            //back off slightly from the ceiling
            this.yCoord = this.game.verticalOffset + this.backOff; 
            this.speed.y = 0;//stop going up 
        } 
        else if(this.isStandingOnFloor()) 
        { 
            if(this.jumping)//if the player is jumping
            {   //then jump is over because the player has landed on the floor
                this.jumping = false;
            }
            if(this.falling)//if the player is falling off the edge of a block
            {   //then fall is over because the player has landed on the floor
                this.falling = false;
            }
            //back off slightly from the floor
            this.yCoord =  this.game.screenHeight - this.game.verticalOffset - this.length - this.backOff;
            this.speed.y = 0;//stop going down
        } 
        if(this.isTouchingLeftWall())
        {  
            //back off slightly from the left wall
            this.xCoord = this.game.horizontalOffset + this.backOff;
            this.speed.x = 0;//stop going left 
        }
        else if (this.isTouchingRightWall())
        {  
            //back off slightly from the right wall
            this.xCoord = this.game.screenWidth - this.game.horizontalOffset - this.length - this.backOff;
            this.speed.x = 0;//stop going right 
        } 
    }    
    emptySpaceIsOnTheRight() 
    {
        //the x-coordinate of the right edge of the player 
        let rightEdge = this.xCoord + this.length - this.game.horizontalOffset; 
        //column the right edge of the player occupies
        let column = ~~(rightEdge/this.game.blockLength);
        //row the top edge of the player occupies
        let topRow = ~~((this.yCoord - this.game.verticalOffset)/this.game.blockLength);
        //row the bottom edge of the player occupies
        let bottomRow = ~~((this.yCoord + this.length - this.game.verticalOffset)/this.game.blockLength); 
        if
        (   //if a column exists in the grid to the right 
            column + 1 < this.game.blockArray[0].length && 
            //if the player is not hanging between two rows
            topRow ===  bottomRow &&   
            //and there is no block to the right
            this.game.blockArray[topRow][column+1] !== 1 
        ) 
        {   
            return true;  
        }  
        return false; 
    }
    emptySpaceIsOnTheLeft()
    {
        //the x-coordinate of the left edge of the player  
        let leftEdge = this.xCoord - this.game.horizontalOffset;  
        //column the left edge of the player occupies
        let column = ~~(leftEdge/this.game.blockLength);
        //row the top edge of the player occupies
        let topRow = ~~((this.yCoord - this.game.verticalOffset)/this.game.blockLength); 
        //the row the bottom edge of the player occupies
        let bottomRow = ~~((this.yCoord + this.length - this.game.verticalOffset)/this.game.blockLength); 
        if
        (   
            //if a column exists in the grid to the left 
            column - 1 >= 0 &&     
            //if the player is not hanging between two rows
            topRow === bottomRow && 
            //and there is no block  to the left        
            this.game.blockArray[topRow][column-1] !== 1)
        {   
            return true; 
        }
        return false; 
    }
    checkBlockCollision()
    {     
        for(let i = 0; i < this.blocks.length; i++)
        {
            let block = this.blocks[i];
            //if the block is too far away
            if(Math.abs(this.xCoord - block.x) > this.game.blockLength *2 || Math.abs(this.yCoord - block.y) > this.game.blockLength *2 )
            {
                continue; //ignore that block
            }   
            if(this.hasTouchedABlock(block)) 
            {    
                //if player is descending and going right 
                if(this.speed.y > 0 && this.speed.x > 0)
                { 
                    //if the player has landed on top of a block 
                    if(this.yCoordOld + this.length < block.y) 
                    { 
                        //back off from the top edge of the block
                        this.yCoord = block.y - this.length - this.backOff;
                        if(this.jumping)//if player is jumping 
                        {   //then jump is over because the player has landed on a block
                            this.jumping = false;  
                        }  
                        if(this.falling)//if player is falling off the edge of a block
                        {   //then fall is over because the player has landed on a block
                            this.falling = false;  
                        }    
                        this.speed.y = 0;//stop descending 
                    } 
                    else //if the player has touched the left edge of the block
                    {
                        //back off to the left edge of the block
                        this.xCoord = block.x - this.length - this.backOff;
                        this.speed.x = 0;//stop going left  
                    }
                    return; 
                }
                //if player is descending and going left 
                if(this.speed.y > 0 && this.speed.x < 0)
                {
                    //if the player has landed on top of a block
                    if(this.yCoordOld + this.length < block.y) 
                    { 
                        //back off from the top edge of the block
                        this.yCoord = block.y - this.length - this.backOff;
                        if(this.jumping)//if player is jumping 
                        {   //then jump is over because the player has landed on a block
                            this.jumping = false;  
                        }  
                        if(this.falling)//if player is falling off the edge of a block
                        {   //then fall is over because the player has landed on a block
                            this.falling = false;  
                        }   
                        this.speed.y = 0;//stop descending 
                    } 
                    else //if the player has touched the right edge of the block
                    {
                        //back off from the right edge of the block
                        this.xCoord = block.x + block.length + this.backOff;
                        this.speed.x = 0;//stop going left  
                    }
                    return;
                }
                //if player is ascending and going right 
                if(this.speed.y < 0 && this.speed.x > 0)
                {
                    //if the player has hit head against the bottom of a block 
                    if(block.y + block.length <= this.yCoordOld)  
                    { 
                        //back off from the bottom edge of the block
                        this.yCoord = block.y + block.length + this.backOff; 
                        this.speed.y = 0;//stop ascending 
                    } 
                    else //if the player has touched the left edge of the block
                    {
                        //back off to the left edge of the block
                        this.xCoord = block.x - this.length - this.backOff;
                        this.speed.x = 0;//stop going left  
                    }
                    return; 
                }
                //if player is ascending and going left 
                if(this.speed.y < 0 && this.speed.x < 0)
                {
                    //if the player has hit head against the bottom of a block
                    if(block.y + block.length <= this.yCoordOld) 
                    { 
                        //back off from the bottom edge of the block
                        this.yCoord = block.y + block.length + this.backOff; 
                        this.speed.y = 0;//stop ascending 
                    } 
                    else //if the player has touched the right edge of a block
                    {
                        //back off from the right edge of the block
                        this.xCoord = block.x + block.length + this.backOff;
                        this.speed.x = 0;//stop going left  
                    }
                    return;
                }
                if(this.speed.y > 0)//if player is only descending
                {
                    //back off from the top edge of the block
                    this.yCoord = block.y - this.length - this.backOff;
                    if(this.jumping)//if player is jumping 
                    {   //then jump is over because the player has landed on a block
                        this.jumping = false;  
                    }  
                    if(this.falling)//if player is falling off the edge of a block
                    {   //then fall is over because the player has landed on a block
                        this.falling = false;  
                    }   
                    this.speed.y = 0;//stop descending 
                    return; 
                }
                else if( this.speed.y < 0)//if player is only ascending
                {
                    //back off from the bottom edge of the block
                    this.yCoord = block.y + block.length + this.backOff; 
                    this.speed.y = 0;//stop ascending
                    return; 
                }
                if(this.speed.x > 0)//if player is only going right
                {
                    //back off from the left edge of the block
                    this.xCoord = block.x - this.length - this.backOff;  
                    this.speed.x = 0;//stop going right 
                    return; 
                }
                else if( this.speed.x < 0)//if player is only going left
                {
                    //back off from the right edge of the block
                    this.xCoord = block.x + block.length + this.backOff; 
                    this.speed.x = 0;//stop going left
                    return; 
                } 
                break; 
            } 
        }
        //if player is not colliding with any block, 
        //check if player is falling off the edge of a block
        if(!this.jumping && !this.falling)
        {
            //the x-coordinate of the left edge of the player  
            let leftEdge = this.xCoord - this.game.horizontalOffset;
            //the x-coordinate of the right edge of the player 
            let rightEdge = this.xCoord + this.length - this.game.horizontalOffset;  
            let leftColumn = ~~(leftEdge/this.game.blockLength); 
            let rightColumn = ~~(rightEdge/this.game.blockLength); 
            if(leftColumn === rightColumn)//if player is not standing between two blocks
            {
                let row = ~~((this.yCoord - this.game.verticalOffset)/this.game.blockLength);  
                if((row + 1 < this.game.blockArray.length)//if there is space underneath the player
                        && this.game.blockArray[row+1][leftColumn] !== 1)//and there is no block in that that space
                {
                    //initiate the fall 
                    this.falling = true;  
                    this.speed.y = this.unitDistance; 
                }
            } 
        }  
    }   
    checkBugCollision()
    {     
        for(let i = 0; i < this.bugs.length; i++)
        {
            let bug = this.bugs[i];
            //if the block is too far away
            if(Math.abs(this.xCoord - bug.x) > this.game.blockLength *2 || Math.abs(this.yCoord - bug.y) > this.game.blockLength *2 )
            {
                continue; //ignore that block
            }
            if(this.hasTouchedABlock(bug)) 
            {
                this.checkGameOver(); 
            }
        }
    }
    /*
     *It’s really just four Line/Line collisions, one for each side of the player
     *source: http://jeffreythompson.org/collision-detection/line-rect.php 
     */
    hasTouchedAFan(x1,y1,x2,y2,rx,ry,rw,rh)
    { 
        // check if the line has hit any of the rectangle's sides 
        let 
        left =   this.lineLineCollision(x1,y1,x2,y2, rx,ry,rx, ry+rh),
        right =  this.lineLineCollision(x1,y1,x2,y2, rx+rw,ry, rx+rw,ry+rh),
        top =    this.lineLineCollision(x1,y1,x2,y2, rx,ry, rx+rw,ry),
        bottom = this.lineLineCollision(x1,y1,x2,y2, rx,ry+rh, rx+rw,ry+rh); 
        //if ANY of the above are true, the line has hit the rectangle
        if (left || right || top || bottom) 
        {
            return true;
        }
        return false;
      }
    /*
     * source: http://jeffreythompson.org/collision-detection/line-rect.php 
     */
    lineLineCollision(x1, y1, x2, y2, x3, y3, x4, y4) 
    { 
        //calculate the direction of the lines
        let 
        uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1)),
        uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1)); 
        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) 
        { 
            // optionally, draw a circle where the lines meet
            /*float intersectionX = x1 + (uA * (x2-x1));
            float intersectionY = y1 + (uA * (y2-y1));
            fill(255,0,0);
            noStroke();
            ellipse(intersectionX, intersectionY, 20, 20); 
            */
            return true;
        }
        return false;
    }
    update() 
    {
        //set most recent coordinates
        this.xCoordOld = this.xCoord; 
        this.yCoordOld = this.yCoord;
        //update current coordinates
        this.xCoord+=this.speed.x; 
        this.yCoord+=this.speed.y; 
        //if player is moving right or left
        if(this.speed.x !== 0)
        {   //update the horizontal direction 
            this.oldHorizontalDirection = this.speed.x;  
        } 
        if(this.jumping)//if player is jumping...
        {   
            if(this.speed.y < 0)//..and is ascending
            {   
                this.speed.y+= this.gravity; 
            }
            else//...or is descending
            {
                this.speed.y+= this.gravity*2; 
            }  
        } 
        //if player is falling off the edge of a block
        else if (this.falling)
        {
            this.speed.y+= this.gravity;   
        }
        this.checkLavaSpitCollision();
        this.checkSawCollision(); 
        this.checkBugCollision();
        this.checkBallCollision();
        this.checkWallCollision(); 
        this.checkBlockCollision();
        this.checkCoinCollision();
        this.checkDoorCollision(); 
        /*Explanation: 
         *Whenever the player lands on top of a block(whiles jumping or falling off the edge of a block), 
         *vertical movement stops by setting this.speed.y = 0. 
         *If the up arrow key is still pressed and not released, even though the player has landed, 
         *then the player is moved up again, creating the effect of a rebound or a bounce.*/ 
        if(this.upKeyIsPressed && !this.jumping && !this.falling)
        {
            this.moveUp(); 
            this.jumping = true;  
        }
        /*Explanation: 
         *Whenever the player hits a block whiles going right, horizontal movement stops by setting this.speed.x = 0. 
         *If the right arrow key is still pressed and not released, then the player is moved right at the very
         *next opportunity where there is no block to the right.*/ 
        if(this.rightKeyIsPressed && this.speed.x === 0 && this.emptySpaceIsOnTheRight())
        { 
            this.moveRight();
        }
        /*Explanation: 
         *Whenever the player hits a block whiles going left, horizontal movement stops by setting this.speed.x = 0. 
         *If the left arrow key is still pressed and not released, then the player is moved left at the very
         *next opportunity where there is no block to the left.*/ 
        if(this.leftKeyIsPressed && this.speed.x === 0 && this.emptySpaceIsOnTheLeft())
        { 
            this.moveLeft();
        }  
        //update bullets 
        for(let i = 0; i < this.bullets.length; i++) 
        {
            let bullet = this.bullets[i]; 
            bullet.update(); 
            if(bullet.markedForDeletion)
            {    
                this.bullets.splice(i,1); 
            }
        };  
        //update bombs
        for(let i = 0; i < this.bombs.length; i++) 
        {
            let bomb = this.bombs[i]; 
            bomb.update(); 
            if(bomb.markedForDeletion)
            {    
                this.bombs.splice(i,1); 
            }
        }; 
    }
    draw()
    {      
        //draw the player
        fill(this.color);  
        rect(this.xCoord,this.yCoord,this.length,this.length);  
        //draw the bullets and bombs
        [...this.bullets,...this.bombs].forEach(function(bullet)
        {
            bullet.draw(); 
        });  
    }  
} 
 