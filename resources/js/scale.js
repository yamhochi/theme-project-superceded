import { WCAG_ratio } from './WCAG.js';
import pkg from '../../node_modules/hsluv/hsluv.js';
const { hsluvToRgb } = pkg;

// **** Step 2 **** //
//using the master HSL, find the scale based on that colour's L value

export function scale(h, s, l) {
    //how many? var steps = 10
    var above = Math.floor((100 - l) / 10) //eg 5
    var below = 10 - 1 - above //eg 4
 

    //you want to create this - obj_hsl={100:[H,S,L], 200:[H,S,L]}
    const array_Ln = [l]
    let i = 0
    var Ln

    // Start with below
    while (i < below) {
        console.log("below"+ i)
        //start with 100
        Ln = l - (below - i) * 10
        // step = i
        i = i + 1
        array_Ln.push(Ln)
    }


    // then deal with above
    let j = 1
    while (above < 10) {
        console.log("above:"+ above)
        //start with 
        Ln = l + (j * 10) //j=1
        above = above + 1
        j = j + 1
        array_Ln.push(Ln)
    }

    array_Ln.sort((a, b) => a - b);
    // console.log(array_Ln)

    let item
    let scales = []
    //create an object for each with step:100, hsluv:[], rgb:[r,g,b], wcagratio:num
    for (item of array_Ln) {
        const each_cell_object = {
            hsluv: [h, s, item],
            rgb: hsluvToRgb([h, s, item]) //returns a % value
        }
        scales.push(each_cell_object)
    }

    // const row_hues = document.getElementsByClassName("hues") replace with
    const row_hues=[]
    
    let rgb, r, g, b, contrast
    scales.forEach(function (value, key) {

        //need to convert the rgbs to css rgb (0-255)
        r = value.rgb[0] * 255;
        g = value.rgb[1] * 255;
        b = value.rgb[2] * 255;
        rgb = 'rgb(' + r + ',' + g + ',' + b + ')';

        //find the contrast
        contrast = WCAG_ratio(r, g, b).toFixed(2);

        // create the cell element
        const cell = document.createElement("div");
        cell.className = "cell spread";
        cell.style.backgroundColor = rgb;
        cell.innerHTML = contrast;
        // row_hues[0].appendChild(cell) replace with
        row_hues.push(cell)
    })
    // console.log(row_hues)
    return(row_hues)
}
