'use strict';
/*
 * A door 
 * -------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Door
{
    constructor(upperLeftVertex,length)
    {       
        this.x = upperLeftVertex.x; 
        this.y = upperLeftVertex.y;  
        this.length = length;  
        this.color = 'orange'; 
        this.delta = 4; 
    }  
    draw()//draw the door
    {     
        //draw outer boundary of dooor
        stroke(0); 
        fill(this.color); 
        rect(this.x,this.y,this.length,this.length);  
        noFill(); 
        //draw inner boundary of door 
        stroke(0);  
        rect(this.x + this.delta,this.y + this.delta,this.length-this.delta*2,this.length-this.delta*2);
        //draw the line dividing the door 
        line(this.x + this.delta + (this.length-this.delta*2)/2,
             this.y + this.delta,
             this.x + this.delta + (this.length-this.delta*2)/2,
             this.y + this.delta + (this.length-this.delta*2) );
        //draw the door knob 
        ellipse(this.x + this.delta * 2,
             this.y + this.length/2,
             1,
             1);
         
    } 
} 
 