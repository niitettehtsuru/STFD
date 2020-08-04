'use strict';  
/*
 * A bomb with the game
 * --------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Bomb
{
    constructor(coordinates,length,game)
    {       
        this.game = game; 
        this.blocks = this.game.blocks;
        this.blockArray = this.game.blockArray;
        this.bugs = this.game.bugs; 
        this.length = length;   
        this.delta = this.length/3; 
        this.xCoord = coordinates.x; 
        this.yCoord = coordinates.y;  
        this.color = 'rgba(255,0,0,0.3)';//transparent red
        this.blastRadius = this.game.blockLength;
        this.blast = {x:this.xCoord+this.length/2,
            y:this.yCoord+this.length/2,
            radius:this.blastRadius};   
        //will blow up in the next 50 requests for an animation frame
        this.timer = 50;
        this.markedForDeletion = false;  
    }  
    blowUp()
    { 
        for(let i = 0; i < this.blocks.length; i++)
        {
            let block = this.blocks[i]; 
            //if the block is too far away 
            if(Math.abs(this.blast.x - block.x) > this.game.blockLength *2 || Math.abs(this.blast.y - block.y) > this.game.blockLength *2 )
            {
                continue; //ignore that block
            } 
            if(this.blockIsInBlastRadius(block))
            {    
                this.checkForBugs(block); 
                //update the block array to mark the corresponding index as an emtpy space
                this.blockArray[block.rowIndex][block.columnIndex] = 0; 
                this.blocks.splice(i,1); //get rid of the block  
            }
        }   
    }
    /*If there's a bug on the block, kill the bug. 
     *If a bug is patrolling that block,but is not currently standing on the block, 
     *reset the leftmost and rightmost bounds of the bug.*/
    checkForBugs(block) 
    {
        let blockColumn = block.columnIndex; 
        let blockRow = block.rowIndex; 
        for(let i = 0; i < this.bugs.length; i++)
        {
            let bug = this.bugs[i];
            //the x-coordinate of the left edge of the bug  
            let leftEdgeOfBug = bug.x - this.game.horizontalOffset;
            //the x-coordinate of the right edge of the bug
            let rightEdgeOfBug = bug.x + bug.length - this.game.horizontalOffset;  
            //column occupied by the left edge of the bug
            let leftColumn = ~~(leftEdgeOfBug/this.game.blockLength); 
            //column occupied by the right edge of the bug
            let rightColumn = ~~(rightEdgeOfBug/this.game.blockLength); 
            //the x-coordinate of the farthest point the bug can go left
            let leftMostEdgeOfBug = bug.leftMostPoint - this.game.horizontalOffset;
            //the x-coordinate of the farthest point the bug can go right
            let rightMostEdgeOfBug = bug.rightMostPoint - this.game.horizontalOffset; 
            //column occupied by the farthest point the bug can go left
            let leftMostColumn = ~~(leftMostEdgeOfBug/this.game.blockLength); 
            //column occupied by the farthest point the bug can go right
            let rightMostColumn = ~~(rightMostEdgeOfBug/this.game.blockLength); 
            //row the bug is located on
            let row = ~~((bug.y - this.game.verticalOffset)/this.game.blockLength);
            //if the bug is sitting on top of the block
            if(row +1 === blockRow && (blockColumn === leftColumn || blockColumn === rightColumn))
            { 
                this.bugs.splice(i,1);//get rid of that bug
                //for each square within which the bug roams ,
                //update the block array to mark the corresponding index as an emtpy space
                for(let k = leftMostColumn; k < rightMostColumn; k++)
                {    
                    this.blockArray[block.rowIndex-1][k] = 0; 
                } 
                continue;//move on to the next bug
            } 
            //if bug roams on top of the block
            if(row +1 === blockRow && leftMostColumn <= blockColumn && rightMostColumn >= blockColumn)
            {
                //if bug is to the right of the block 
                if(bug.x > block.x + block.length)
                {   
                    //reset the farthest the bug can go left
                    bug.leftMostPoint = block.x + block.length;  
                } 
                //if bug is to the left of the block 
                if(bug.x + bug.length < block.x)
                {   //reset the farthest the bug can go right
                    bug.rightMostPoint = block.x; 
                }  
            } 
        }
    }
    /*
     *
     *Source:http://jeffreythompson.org/collision-detection/circle-rect.php
     */
    blockIsInBlastRadius(block) 
    { 
        //First test which edge of the block is closest to the blast, 
        //then see if there is a collision using the Pythagorean Theorem.
        
        //Temporary variables to set edges for testing
        let 
        testX = this.blast.x,
        testY = this.blast.y; 
        //which edge is closest?
        //If the blast is to the LEFT of the block, check against the LEFT edge.
        if (this.blast.x < block.x)//test left edge        
        {
            testX = block.x;
        }    
        //If the blast is to the RIGHT of the block, check against the RIGHT edge.
        else if (this.blast.x > block.x + block.length) 
        {
            testX = block.x + block.length; 
        }   
        //If the blast is ABOVE the block, check against the TOP edge
        if (this.blast.y < block.y)//test top edge      
        {
            testY = block.y; 
        }     
        //If the blast is to the BELOW the block, check against the BOTTOM edge.
        else if (this.blast.y > block.y+block.length) 
        {
            testY = block.y+block.length; 
        }   
        //get distance from closest edges
        let dx = this.blast.x -testX,
        dy = this.blast.y -testY,
        distance = Math.sqrt(dx*dx + dy*dy);

        //if the distance is less than the radius,...
        if (distance <= this.blast.radius) 
        {    
            return true;//block is in the blast radius 
        }
        return false;
    }
    update()
    {  
        --this.timer;  
        if(this.timer < 1)//if time is up
        {
            this.blowUp(); 
            this.markedForDeletion = true; 
        } 
    }
    draw()//draw the bomb
    {           
        fill(this.color); 
        rect(this.xCoord,this.yCoord,this.length,this.length); 
        noFill();  
        //draw the yellow bands around the bomb 
        stroke('rgba(255,215,0,0.3)');//transparent gold 
        strokeWeight(2); 
        line(this.xCoord,this.yCoord+this.delta,this.xCoord+this.length,this.yCoord+this.delta); 
        line(this.xCoord,this.yCoord+this.delta*2,this.xCoord+this.length,this.yCoord+this.delta*2); 
        //draw the fuse on top of the bomb
        strokeWeight(0.5); 
        line(this.xCoord+this.length/2,this.yCoord,this.xCoord+this.length/2,this.yCoord-this.delta); 
        noStroke(); 
        //draw the blast radius
        fill('rgba(255,215,0,0.1)');//transparent gold 
        ellipse(this.blast.x,this.blast.y,this.blast.radius*2,this.blast.radius*2); 
        noFill(); 
    } 
} 
 