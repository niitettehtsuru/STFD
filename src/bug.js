'use strict'; 
/*
 * A bug with the game
 * --------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */

class Bug
{
    constructor(leftBoundary,rightBoundary, length)
    {       
        this.length = length/3;
        this.rightMostPoint = rightBoundary; 
        this.leftMostPoint = leftBoundary.x;  
        this.x = ~~this.getRandomNumber(leftBoundary.x , rightBoundary-this.length); 
        this.y = leftBoundary.y + 2 * this.length;  
        this.color = 'red';
        this.unitDistance = 0.2; 
        this.speed = {x:this.unitDistance,y:0}; 
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
    update()
    {
        this.x+=this.speed.x; 
        if(this.x  + this.length >= this.rightMostPoint)
        {
            this.speed.x = -this.unitDistance; 
        }
        else if( this.x <= this.leftMostPoint)
        {
            this.speed.x = this.unitDistance; 
        }
    }
    draw()//draw the bug
    {        
        fill(this.color); 
        rect(this.x,this.y,this.length,this.length);  
        noFill();   
         
    } 
} 
 