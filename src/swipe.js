import Carousel from './class/carousel.js';

let wrapper = document.querySelector('#section');

let test = new Carousel(wrapper);
console.log(test);
test.block(3).space(20).start();