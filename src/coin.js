'use strict';
/*
 * A coin
 * --------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
class Coin
{
    constructor(data)
    {        
        this.x = data.x; 
        this.y = data.y;  
        this.radius = data.radius; 
        this.color = 'rgba(255,215,0,0.5)';//   'gold';// 
        
    }   
    draw()//draw the coin
    {      
        stroke('rgba(255,175,26,0.5)'/*'orange'*/); 
        fill(this.color); 
        ellipse(this.x,this.y,this.radius*2,this.radius*2);  
        noFill();
        noStroke(); 
    } 
} 
 