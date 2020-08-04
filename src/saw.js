'use strict'; 
/*
 * A saw
 * -----
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */ 
class Saw
{
    constructor(upperLeftVertex,length)
    {       
        this.length = length;
        this.razorIndex = 4; 
        this.toggleRazorIndex = true; 
        this.delta = this.length/this.razorIndex; 
        this.x = upperLeftVertex.x; 
        this.y = upperLeftVertex.y + this.length/2;  
        this.color = 'silver'; 
    } 
    getPoints()
    {
        return {x:this.x,y:this.y,w:this.length,h:this.length/2}; 
    } 
    draw()//draw the saw
    {       
        noStroke(); 
        fill(this.color); 
        beginShape(); 
        vertex(this.x, this.y);
        vertex(this.x, this.y+this.length/2);
        vertex(this.x+this.length, this.y+this.length/2); 
        vertex(this.x+this.length, this.y); 
        vertex(this.x+this.length - this.delta, this.y+this.length/2); 
        vertex(this.x+this.length - this.delta*2, this.y); 
        vertex(this.x+this.length - this.delta*3, this.y+this.length/2); 
        endShape(CLOSE);  
    } 
} 
 