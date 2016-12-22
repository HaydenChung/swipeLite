import Carousel from './class/carousel.js';

let wrapper = document.querySelector('.container_wrapper');

let test = new Carousel(wrapper);
console.log(test);
test.block(5).space(10).slide(true).start();

//setInterval(test.nextBtn.bind(test),100);