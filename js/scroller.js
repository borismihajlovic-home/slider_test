console.log('scroller.js loaded... good to go');


const scrollerHelperFunctions = {

    cloneListFunction: (containersArray)=>{       // containersArray
        const windowWidth = parseInt(window.innerWidth);
        containersArray.forEach((container)=>{
            const listEl = container.querySelector('.slide-list');
            let listWidth = listEl.offsetWidth,
                clonedEl = null;
    // making one nessesary clone
                clonedEl = listEl.cloneNode(true);
                container.appendChild(clonedEl);
                listWidth += listWidth;
    // additionaly clone as needed
            while (listWidth < windowWidth*2) {
                clonedEl = listEl.cloneNode(true);
                container.appendChild(clonedEl);
                listWidth += listWidth;
            }
    
        });
    },

    settingListPosition: (array, listWidth, direction)=>{
        array.forEach((element, i)=>{
            element.style.setProperty(direction, `${listWidth*i}px`);
        });
    },

    intervalFunction: (data)=>{
        let move=0;
        let comparisonWidth=0;
        let shouldReset = null;
        let currentPosition = data.row.style.getPropertyValue(`transform`).split('(')[1];
    // Direction specific setup
        if(data.direction=='left') { 
            move = data.row.getBoundingClientRect().x - data.moveStep;
            comparisonWidth -= data.slideListWidth;
            shouldReset = parseFloat(currentPosition) < comparisonWidth;
        }else{
            move = data.row.getBoundingClientRect().x + data.moveStep;
            comparisonWidth += data.slideListWidth;
            shouldReset = parseFloat(currentPosition) > comparisonWidth;
        }
    
        if(currentPosition){
            currentPosition = currentPosition.slice(0,-3);
        }
    
        if(shouldReset){
            data.row.style.setProperty('transform', 'translateX(0px)');
            setTimeout(()=>{
                data.row.style.setProperty('transition-duration', '0ms');
                setTimeout(()=>{
                    data.row.style.setProperty('transition-duration', `${data.transitionDuration}ms`);
                });
            });
            
        }else{
            data.row.style.setProperty('transform', `translateX(${move}px)`);
        }
    }

};

// /**Cloning Function
//  * @param {array} containersArray 
//  */
// const cloneListFunction = (containersArray)=>{
//     const windowWidth = parseInt(window.innerWidth);
//     containersArray.forEach((container)=>{
//         const listEl = container.querySelector('.slide-list');
//         let listWidth = listEl.offsetWidth,
//             clonedEl = null;
// // making one nessesary clone
//             clonedEl = listEl.cloneNode(true);
//             container.appendChild(clonedEl);
//             listWidth += listWidth;
// // additionaly clone as needed
//         while (listWidth < windowWidth*2) {
//             clonedEl = listEl.cloneNode(true);
//             container.appendChild(clonedEl);
//             listWidth += listWidth;
//         }

//     });
// };

/**Positioning lists in a line
 * @param {array} array 
 * @param {number} listWidth 
 * @param {string} direction 
 */
// const settingListPosition = (array, listWidth, direction)=>{
//     array.forEach((element, i)=>{
//         element.style.setProperty(direction, `${listWidth*i}px`);
//     });
// };


/** Sliding interval function 
 *  @param { object } data - data needed for interval
 *  @param { number } data.slideListWidth - width of one sllide list in px
 *  @param { string } data.direction - direction of the slider
 *  @param { number } data.moveStep - how much pixels does the slider need to move in regard of its width and time needed
 *  @param { element } data.row - element containing all slide lists
 *  @param { number } data.transitionDuration - time for transition in ms 
 */
// const intervalFunction = (data)=>{
//     let move=0;
//     let comparisonWidth=0;
//     let shouldReset = null;
//     let currentPosition = data.row.style.getPropertyValue(`transform`).split('(')[1];
// // Direction specific setup
//     if(data.direction=='left') { 
//         move = data.row.getBoundingClientRect().x - data.moveStep;
//         comparisonWidth -= data.slideListWidth;
//         shouldReset = parseFloat(currentPosition) < comparisonWidth;
//     }else{
//         move = data.row.getBoundingClientRect().x + data.moveStep;
//         comparisonWidth += data.slideListWidth;
//         shouldReset = parseFloat(currentPosition) > comparisonWidth;
//     }

//     if(currentPosition){
//         currentPosition = currentPosition.slice(0,-3);
//     }

//     if(shouldReset){
//         data.row.style.setProperty('transform', 'translateX(0px)');
//         setTimeout(()=>{
//             data.row.style.setProperty('transition-duration', '0ms');
//             setTimeout(()=>{
//                 data.row.style.setProperty('transition-duration', `${data.transitionDuration}ms`);
//             });
//         });
        
//     }else{
//         data.row.style.setProperty('transform', `translateX(${move}px)`);
//     }
// };



document.addEventListener('DOMContentLoaded', ()=>{
    let sliderWrapperHeight = 0;
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const allSlideContainers = sliderWrapper.querySelectorAll('.slide-container');

// Clone list
    scrollerHelperFunctions.cloneListFunction(allSlideContainers);
    
    allSlideContainers.forEach((row, index)=>{
        let     containerHeight = row.querySelector('.slide').getBoundingClientRect().height,
                loopTime = parseInt(row.dataset.time),
                slideDirection = row.dataset.slideDirection,
                slideListArray = row.querySelectorAll('.slide-list');
                slideListWidth = parseInt(slideListArray[0].getBoundingClientRect().width),
                moveStep = (slideListWidth/loopTime)*50,
                topPosition = null,
                intervalId= null,
                intervalData = {
                    direction: slideDirection,
                    slideListWidth: slideListWidth,
                    moveStep: moveStep,
                    row: row,
                    transitionDuration: 10
                };

//set transition duration
        row.style.setProperty('transition-duration', '10ms');
        
        sliderWrapperHeight += containerHeight+10;
// set position of the row
        // index==0 ? topPosition = 0 : topPosition = index*containerHeight + 10*index;
        topPosition = index*containerHeight + 10*index;
        row.style.setProperty(`top`, `${topPosition}px`);
        
        if(slideDirection=='left'){
            row.classList.add('left');
//set position
            scrollerHelperFunctions.settingListPosition(slideListArray, slideListWidth, 'left');
// Set interval for right to left loop
            intervalId = setInterval(scrollerHelperFunctions.intervalFunction,intervalData.transitionDuration, intervalData);

// Mouse events
            row.addEventListener('mouseenter', (e)=>{
                row.style.setProperty('transition-duration', '100ms');
                clearInterval(intervalId);
                intervalData.transitionDuration = 100;
                intervalId2 = setInterval(scrollerHelperFunctions.intervalFunction,intervalData.transitionDuration, intervalData);
            });
            row.addEventListener('mouseleave', ()=>{
                clearInterval(intervalId2);
                intervalData.transitionDuration = 10;
                row.style.setProperty('transition-duration', `${intervalData.transitionDuration}ms`);
                intervalId = setInterval(scrollerHelperFunctions.intervalFunction, intervalData.transitionDuration, intervalData);
            });

        }else{
            row.classList.add('right');       
//set position
            scrollerHelperFunctions.settingListPosition(slideListArray, slideListWidth, 'right');
// Set interval for right to left loop
            intervalId = setInterval(scrollerHelperFunctions.intervalFunction,intervalData.transitionDuration, intervalData);

// Mouse events
            row.addEventListener('mouseenter', (e)=>{
                clearInterval(intervalId);
                intervalData.transitionDuration = 100;
                row.style.setProperty('transition-duration', `${intervalData.transitionDuration}ms`);
                intervalId2 = setInterval(scrollerHelperFunctions.intervalFunction,intervalData.transitionDuration, intervalData);
            });
            row.addEventListener('mouseleave', (e)=>{
                row.style.setProperty('transition-duration', '10ms');
                clearInterval(intervalId2);
                intervalData.transitionDuration = 10;
                intervalId = setInterval(scrollerHelperFunctions.intervalFunction, intervalData.transitionDuration, intervalData);
            });

        }

    });

    sliderWrapper.style.height = `${sliderWrapperHeight}px`;

});
