console.log('main.js loaded... good to go');



let sliderWrapperHeight = 0;


document.addEventListener('DOMContentLoaded', ()=>{
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const allSlideContainers = sliderWrapper.querySelectorAll('.slide-container');
    
    sliderWrapper.style.setProperty(`--row-numbers`, allSlideContainers.length);

    allSlideContainers.forEach((row, index)=>{
        const containerHeight = row.querySelector('.slide').getBoundingClientRect().height;
        const animationDuration = row.dataset.time;
        const slideDirection = row.dataset.slideDirection;
        let topPosition;
        console.log(row);

        row.style.setProperty(`animation-duration`, `${animationDuration}ms`);

        slideDirection=='left' ? row.classList.add('left') : null;

        sliderWrapperHeight += containerHeight+10;
        // set position of the row
        index==0 ? topPosition = 0 : topPosition = index*containerHeight + 10;
        row.style.setProperty(`top`, `${topPosition}px`);
        // set custom class for every row
        row.classList.add(`${index+1}row`);

        row.addEventListener('mouseover', (e)=>{
            let parent = getClosest(e.target, 'slide-container');
            console.log(parent)
            // parent.style.removeProperty(`animation-duration`);
            parent.style.setProperty(`animation-duration`, `50000ms`);
        });
        
    });
    
    sliderWrapper.style.setProperty(`--slide-list-width`,`-2050px`);
    sliderWrapper.style.height = `${sliderWrapperHeight}px`;




});

// get closest parent by class
function getClosest(el, cls) {
    while (el  && el !== document) {
        if (el.classList.contains(cls)) return el;
        el = el.parentNode;
    }
}        

