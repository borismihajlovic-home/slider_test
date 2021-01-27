# Custom slider

## Description
This is a seemless repeating slider with slow down functionality on hover.
And it's still work in progress.


## Important parts
Parts that you need:

- css/scroller.css
- js/scroller.js
- index.html (*example just for reference*)


## How to use
Short description on how to implement.

1. Download the project
2. Copy **css/scroller.css** and **js/scroller.js** to their respected places in your project
3. Add them to your page
4. Create HTML markup (you can use index.html as reference):

```
<div class="slider-wrapper">
        <div class="slide-container" data-time="35000" data-slide-direction="left">
            <div class="slide-list">
                -- items of the slider --
            </div>
        </div>
    </div>
```


## HTML markup explenation

 - *.slider-wrapper* - element that wraps around one or multiple sliders.
 - *.slide-container* - element that represents is the slider. To add more then one slider just copy this element.
 - *.slider-list* - element that contains slider items


## Nessesery paramethers

You **must** provide these parameters to *.slider-container*:

 - *data-time* [number] - speed rotation of the slider (in milliseconds)
 - *data-direction* [srting] - direction that determines in which direction will the slider turn (left/right)  
