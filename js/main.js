console.log('main.js loaded... good to go');


/**
 * 
 * @param {array} containersArray 
 */
const cloneListFunction = (containersArray)=>{
    const windowWidth = parseInt(window.innerWidth);
    containersArray.forEach((container)=>{
        console.log('clone as many list items as needed');
        console.log(container.querySelector('.slide-list').offsetWidth, windowWidth);
        const listEl = container.querySelector('.slide-list');
        let listWidth = listEl.offsetWidth,
            clonedEl = null;

        while (listWidth < windowWidth*2) {
            clonedEl = listEl.cloneNode(true);
            container.appendChild(clonedEl);
            listWidth += listWidth;
            console.log(listWidth);
        }

    });
};


/** Sliding interval function 
 *  @param { object } data - data needed for interval
 *  @param { number } data.slideListWidth 
 *  @param { string } data.direction
 *  @param { number } data.moveStep 
 *  @param { element } data.row
 *  @param { number } data.transitionDuration
 */
const intervalFunction = (data)=>{
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
};



document.addEventListener('DOMContentLoaded', ()=>{
    let sliderWrapperHeight = 0;
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const allSlideContainers = sliderWrapper.querySelectorAll('.slide-container');

    // Clone list
    cloneListFunction(allSlideContainers);
    
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
        index==0 ? topPosition = 0 : topPosition = index*containerHeight + 10;
        row.style.setProperty(`top`, `${topPosition}px`);
        
        if(slideDirection=='left'){
            row.classList.add('left');
            
            //set position
            slideListArray[0].style.setProperty('left', '0px');
            // slideListArray[1].style.setProperty('left', `${slideListWidth}px`);

            // Set interval for right to left loop
            intervalId = setInterval(intervalFunction,intervalData.transitionDuration, intervalData);

            row.addEventListener('mouseenter', (e)=>{
                row.style.setProperty('transition-duration', '100ms');
                // Reset the interval to a slower speed
                clearInterval(intervalId);
                intervalData.transitionDuration = 100;
                intervalId2 = setInterval(intervalFunction,intervalData.transitionDuration, intervalData);
            });

            row.addEventListener('mouseleave', ()=>{
                // Clear slower interval
                clearInterval(intervalId2);
                // Start the interval with original speed
                intervalData.transitionDuration = 10;
                row.style.setProperty('transition-duration', `${intervalData.transitionDuration}ms`);
                intervalId = setInterval(intervalFunction, intervalData.transitionDuration, intervalData);
            });

        }else{
            slideListArray[0].style.setProperty('right', `${slideListWidth}px`);
            // slideListArray[1].style.setProperty('right', '0px');
            row.classList.add('right');
         
            // Set interval for right to left loop
            intervalId = setInterval(intervalFunction,intervalData.transitionDuration, intervalData);

            row.addEventListener('mouseenter', (e)=>{
                // Clear faster interval
                clearInterval(intervalId);
                // Sstart the interval with slower speed
                intervalData.transitionDuration = 100;
                row.style.setProperty('transition-duration', `${intervalData.transitionDuration}ms`);
                intervalId = setInterval(intervalFunction,intervalData.transitionDuration, intervalData);
            });

            row.addEventListener('mouseleave', (e)=>{
                row.style.setProperty('transition-duration', '10ms');
                // Clear slower interval
                clearInterval(intervalId);
                // Start the interval with original speed
                intervalData.transitionDuration = 10;
                intervalId = setInterval(intervalFunction, intervalData.transitionDuration, intervalData);
            });

        }

    });

    sliderWrapper.style.setProperty(`--slide-list-width`,`-2050px`);
    sliderWrapper.style.height = `${sliderWrapperHeight}px`;

});
