'use strict';
/*
 * A lava spit in the game
 * -----------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */ 
class LavaSpit
{
    constructor(coordinates,southmostBoundary,length)
    {       
        this.length = length;
        this.delta = this.length/3; 
        this.x = coordinates.x; 
        this.y = coordinates.y; 
        this.southmostBoundary = southmostBoundary;  
        this.color = 'maroon';
        this.unitDistance = 0.7; 
        //speed of the fire that the pit spits
        this.speed = {x:0,y:this.unitDistance}; 
        this.lava = []; 
        this.spitCounter = 190; 
    }  
    update() 
    {
        this.spitCounter++; 
        if(this.spitCounter > 200)
        {
            this.spitCounter =0;//reset counter
            //spit out new fire
            this.lava.push({x:this.x+this.delta, y:this.y+this.length,length:this.delta});  
        }
        let speed = this.speed.y; 
        this.lava.forEach(function(fire)
        {
            fire.y+=speed; //animate the lava 
        });  
        for(let i = 0; i < this.lava.length; i++)
        {   //if the lava touches the southmost boundary 
            if(this.lava[i].y+this.delta >= this.southmostBoundary)
            {
                this.lava.splice(i,1);//remove the lava
            }
        }
    }
    draw()//draw the lava spit
    {     
        //draw the background square
        fill(this.color); 
        rect(this.x,this.y,this.length,this.length);  
        fill('red'); 
        //draw the funnel 
        beginShape(); 
        vertex(this.x,this.y);
        vertex(this.x+this.delta,this.y+this.length/2);
        vertex(this.x+this.delta,this.y+this.length);
        vertex(this.x+this.delta*2,this.y+this.length);
        vertex(this.x+this.delta*2,this.y+this.length/2);
        vertex(this.x+this.length,this.y);
        endShape(CLOSE);  
        noFill();  
        //draw the dripping lava 
        let delta = this.delta; 
        fill('crimson'); 
        this.lava.forEach(function(fire)
        {
            rect(fire.x,fire.y,delta,delta);
        }); 
        noFill(); 
    } 
} 
 