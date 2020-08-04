'use strict';
/*
 * An enemy ball
 * --------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Ball
{
    constructor(x,y,game)
    {     
        this.game = game; 
        this.screenWidth = this.game.screenWidth; 
        this.screenHeight = this.game.screenHeight;
        this.blocks = game.blocks; 
        this.x = x;      
        this.y = y;
        //most recent coordinates of the center
        this.xOld = this.x; 
        this.yOld = this.y;  
        this.radius = 4; 
        this.color = `red`; 
        this.unitDistance = 2; 
        this.speed  = this.getRandomVelocity();//the direction and speed with which the ball moves on start   
         
    }   
    getRandomVelocity() 
    {  
        let  
        x = this.unitDistance,//move ball to the right
        //flip a coin to decide if ball moves upwards or downwards
        y = Math.random() > 0.5? -this.unitDistance: this.unitDistance;
        return {x:x, y:y};
    }  
    isTouchingLeftWall()
    { 
        if(this.x - this.radius <= this.game.horizontalOffset)
        {  
            return true;//left wall is touched
        } 
        return false;   
    }
    isTouchingRightWall()
    {   
        if(this.x + this.radius >= this.game.screenWidth - this.game.horizontalOffset)
        {  
            return true;//right wall is touched  
        }
        return false;
    }
    isTouchingCeiling()
    { 
        if(this.y - this.radius <= this.game.verticalOffset)
        {    
            return true;//has touched ceiling
        } 
        return false;  
    }
    isTouchingFloor()
    { 
        if(this.y + this.radius >= this.game.screenHeight - this.game.verticalOffset)
        {  
            return true;//has touched the floor 
        } 
        return false;
    }
    checkWallCollision() 
    {
        if(this.isTouchingLeftWall())
        {
            this.x = this.game.horizontalOffset + this.radius + 1; 
            this.speed.x = -this.speed.x; 
            //flip a coin to move either up or down
            this.speed.y = Math.random() > 0.5? -this.unitDistance: this.unitDistance ;
        }
        else if(this.isTouchingRightWall())
        {
            this.x = this.game.screenWidth - this.game.horizontalOffset - this.radius - 1; 
            this.speed.x = -this.speed.x; 
            //flip a coin to move either up or down
            this.speed.y = Math.random() > 0.5? -this.unitDistance: this.unitDistance ;
            
        }
        if(this.isTouchingFloor())
        {
            //this.y + this.radius >= this.game.screenHeight - this.game.verticalOffset
            this.y = this.game.screenHeight - this.game.verticalOffset - this.radius - 1; 
            this.speed.y = -this.speed.y;
            //flip a coin to move either forwards or backwards
            this.speed.x = Math.random() > 0.5? -this.unitDistance: this.unitDistance ; 
        }
        else if (this.isTouchingCeiling())
        {
            this.y = this.game.verticalOffset + this.radius + 1;  
            this.speed.y = -this.speed.y; 
            //flip a coin to move either forwards or backwards
            this.speed.x = Math.random() > 0.5? -this.unitDistance: this.unitDistance ;
        }
    }
    hasTouchedABlock(block)
    {                                                             
        //Find the vertical & horizontal (distX/distY) distances 
        //between the ball’s center and the player’s center.
        let distX = Math.abs(this.x - block.x - block.length/2);
        let distY = Math.abs(this.y - block.y - block.length/2); 
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
        for(let i = 0; i < this.blocks.length; i++)
        {
            let block = this.blocks[i]; 
            if(Math.abs(block.x - this.x) > block.length || Math.abs(block.y - this.y) > block.length)
            {
                continue; 
            }
            if(this.hasTouchedABlock(block))
            {
                if(this.yOld < block.y)//if ball descended upon the block
                {
                    this.y  = block.y - this.radius-1; 
                    this.speed.y = -this.speed.y; 
                }
                else if(this.yOld > block.y + block.length)//if ball ascended to the block
                {
                    this.y  = block.y + block.length + this.radius + 1; 
                    this.speed.y = -this.speed.y; 
                }
                if(this.xOld < block.x)//if ball touched block on the right
                {
                    this.x  = block.x - this.radius-1; 
                    this.speed.x = -this.speed.x; 
                }
                else if(this.xOld > block.x + block.length)//if ball touched block on the left
                {
                    this.x  = block.x + block.length + this.radius + 1; 
                    this.speed.x = -this.speed.x; 
                }
                break; 
            }
        }
    }
    update()
    {   
        this.xOld = this.x; 
        this.yOld = this.y; 
        
        //randomly change the angle of movement in the current direction 
        this.speed.x += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        this.speed.y += Math.random() > 0.5? -Math.random()/20:Math.random()/20; 
        //put a cap on the max speed
        if(this.speed.x > this.unitDistance) 
        {
            this.speed.x = this.unitDistance;
        }
        if(this.speed.y > this.unitDistance) 
        {
            this.speed.y = this.unitDistance;
        } 
        //keep the ball moving in its current direction  
        this.x += this.speed.x;//if ball is going left or right at an angle, keep it going
        this.y += this.speed.y;//if ball is going up or down at an angle, keep it going  
        //check wall collision 
        this.checkWallCollision(); 
        this.checkBlockCollision(); 
    }   
    draw()
    {   
        fill(this.color); 
        ellipse(this.x,this.y,this.radius*2,this.radius*2); 
        noFill();   
    }  
}