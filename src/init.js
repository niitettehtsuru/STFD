'use strict'; 
/*
 * Sets everything up
 * -----------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      3rd August, 2020 
 * @email:     cnttaddy@gmail.com
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/STFD
 * @codepen:   https://codepen.io/niitettehtsuru/pen/PoNYeKX
 * @license:   GNU General Public License v3.0 
 */
let game;
//get the width and height of the browser window 
function getBrowserWindowSize() 
{
    let win = window,
    doc = document,
    offset = 20,
    docElem = doc.documentElement,
    body = doc.getElementsByTagName('body')[0],
    browserWindowWidth = win.innerWidth || docElem.clientWidth || body.clientWidth,
    browserWindowHeight = win.innerHeight|| docElem.clientHeight|| body.clientHeight;  
    return {width:browserWindowWidth-offset,height:browserWindowHeight-offset}; 
}
function setup() 
{
    let browserWindowSize = getBrowserWindowSize();  
    createCanvas(browserWindowSize.width,browserWindowSize.height);
    game = new Game(browserWindowSize);  
    //when the browser window is resized
    window.addEventListener('resize',function()
    { 
        let browserWindowSize = getBrowserWindowSize(); 
        resizeCanvas(browserWindowSize.width,browserWindowSize.height); 
        game.resize(browserWindowSize); 
    });
    background(game.backgroundColor);  
} 
function draw() 
{  
    background(game.backgroundColor); 
    game.update(); 
    game.draw();
}