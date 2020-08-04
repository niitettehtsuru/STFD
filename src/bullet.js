'use strict';  
/*
 * A bullet shot by a player
 * --------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */

class Bullet
{
    constructor(coordinates,length,direction,game)
    {       
        this.game = game; 
        this.radius = 2; 
        this.length = length;  
        this.direction = direction; 
        this.xCoord = coordinates.x; 
        this.yCoord = coordinates.y;  
        this.color = 'white';
        this.unitDistance = 7; 
        //set bullet to only travel horizontally 
        this.speed = {x:this.direction * this.unitDistance,y:0}; 
        this.hasCollidedWithBug = false; 
        this.hasCollidedWithBlock = false; 
        this.markedForDeletion = false; 
    }   
    isTouchingLeftWall()
    { 
        if(this.xCoord - this.radius <= this.game.horizontalOffset)
        {  
            return true;//left wall is touched
        } 
        return false;   
    }
    isTouchingRightWall()
    {   
        if(this.xCoord + this.radius >= this.game.screenWidth - this.game.horizontalOffset)
        {  
            return true;//right wall is touched  
        }
        return false;
    } 
    checkWallCollision() 
    {  
        if(this.isTouchingLeftWall() || this.isTouchingRightWall())
        {  
            this.markedForDeletion = true;  
        } 
    } 
    //detects collision of a bullet with a block or bug
    hasTouchedABlockOrBug(block)
    {                                                             
        //Find the vertical & horizontal (distX/distY) distances 
        //between the ball’s center and the player’s center.
        let distX = Math.abs(this.xCoord - block.x - block.length/2);
        let distY = Math.abs(this.yCoord - block.y - block.length/2); 
        //If the distance is greater than halfCoin + halfPlayer, 
        //then they are too far apart to be colliding.
        if (distX > (block.length/2 + this.radius)) 
        { 
            return  false; 
        }
        if (distY > (block.length/2 + this.radius)) 
        { 
            return false; 
        }  
        //If the distance is less than halfPlayer then they are definitely colliding
        if (distX <= (block.length/2)) 
        { 
            return true; 
        } 
        if (distY <= (block.length/2)) 
        { 
            return true; 
        } 
        //test for collision at the paddle corner
        // Think of a line from the paddle center to any paddle corner. Now extend that line by the radius of the ball.
        //If the ball’s center is on that line they are colliding at exactly that paddle corner.
        //Using Pythagoras formula to compare the distance between ball and paddle centers.
        let dx=distX-block.length/2;
        let dy=distY-block.length/2;
        return (dx*dx+dy*dy<=(this.radius*this.radius));  
    } 
    checkBlockCollision()
    {
        if(this.direction > 0 ) //if bullet is moving right
        { 
            let right = Math.ceil(this.xCoord + this.radius) - this.game.horizontalOffset; 
            let column = ~~(right/this.game.blockLength);//column to the right of the block
            let row = ~~((this.yCoord - this.game.verticalOffset)/this.game.blockLength);  
            if(this.game.blockArray[row][column] === 1)//if bullet touches a block to the right
            { 
                this.hasCollidedWithBlock = true; 
                this.markedForDeletion = true;//bullet has hit a block so remove bullet  
            } 
        }
        else //if bullet is moving left 
        {
            let left = ~~this.xCoord - this.game.horizontalOffset;  
            let column = ~~(left/this.game.blockLength);//column to the right of the block
            let row = ~~((this.yCoord - this.game.verticalOffset)/this.game.blockLength);  
            if(this.game.blockArray[row][column] === 1)//if bullet touches a block to the left
            {
                this.hasCollidedWithBlock = true; 
                this.markedForDeletion = true;//bullet has hit a block so remove bullet
            } 
        }
    }
    checkBugCollision() 
    {
        for(let i = 0; i < this.game.bugs.length; i++)
        {
            let bug = this.game.bugs[i];
            if(Math.abs(bug.x - this.xCoord) <= bug.length*2)//if bullet is close enough to the bug
            {
                if(this.hasTouchedABlockOrBug(bug))//if bullet touches bug
                {
                    this.hasCollidedWithBug = true;
                    this.markedForDeletion = true;//bullet has done its work so remove bullet 
                    this.game.bugs.splice(i,1);//bug is killed so remove bug
                    return; 
                }  
            } 
        }
    }
    update()
    { 
        this.xCoord += this.speed.x;//update the speed  
        //if the bullet hits a bug, the bullet dies ,and so does the bug 
        this.checkBugCollision();
        if(!this.hasCollidedWithBug)
        {
            //if bullet hits a brick, the bullet dies. 
            this.checkBlockCollision(); 
            if(!this.hasCollidedWithBlock)
            {
                //if bullet hits the left or right wall, bullet dies.
                this.checkWallCollision();  
            } 
        } 
    }
    draw()//draw the bullet 
    {      
        fill(this.color); 
        ellipse(this.xCoord,this.yCoord,this.radius*2,this.radius*2); 
        noFill();    
    } 
} 
 