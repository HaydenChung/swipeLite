import Carousel from './class/carousel.js';

let wrapper = document.querySelector('.container_wrapper'),
    testPrevBtn = document.querySelector('#prevBtn'),
    testNextBtn = document.querySelector('#nextBtn');

let test = new Carousel(wrapper);
console.log(test);
test.block(6).space(10).slide(true).start();
testPrevBtn.addEventListener('click',test.prevBtn.bind(test));
testNextBtn.addEventListener('click',test.nextBtn.bind(test));