'use strict'; 
/*
 * A square block in the game
 * -----------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Block
{
    constructor(upperLeftVertex,length,color,blockArray)
    {       
        this.x = upperLeftVertex.x; 
        this.y = upperLeftVertex.y;
        this.rowIndex = upperLeftVertex.row;  
        this.columnIndex = upperLeftVertex.column;  
        this.length = length; 
        this.color = color;
        this.blockArray = blockArray;  
    }    
    draw()
    {     
        stroke(0);//black border line
        //draw the block 
        fill(this.color); 
        rect(this.x,this.y,this.length,this.length);  
    }  
} 
 