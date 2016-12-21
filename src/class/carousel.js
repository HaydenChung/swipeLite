import Mouse from "./mouse.js";
import Touch from "./touch.js";

export default class Carousel {
    constructor(targetElm) {
        this.container = targetElm;
        this.initiatePos = {x:0,y:0};
        this.actingPos = {x:0,y:0};
        this.desistPos = {x:0,y:0};
        this.staticPos = {x:0,y:0};
        //parent to the container,places outside  
        this.contRect = this.container.getBoundingClientRect();
        this.parentRect = this.container.parentNode.getBoundingClientRect();
        this.nodeRect = this.container.children[0].getBoundingClientRect();
        this.nodeOuterWidth = 0;
        this.method = {};
        this.distance = 0;
        this.animationLoop = 0;
        this.desitPromise = {};
        this.onResolve = {};
        this.nodesArr = {};
        this.singleBlock = {
            perScreen: 0,
            width: 0,
            margin: 0,
        };
        this.fakeBlock = 0;
    }

    start(){
        this.container.addEventListener('mousedown',(e)=>{
            this._inputHandle(e);
        });

        this.container.addEventListener('touchstart',(e)=>{
            this._inputHandle(e);
        });

        this._initiate();

        window.addEventListener('resize',this._resize.bind(this));
    }

    _inputHandle(e) {
        if(typeof e.targetTouches != 'undefined'){
            Touch.down.call(this,e);
        }else{
            Mouse.down.call(this,e);
        }
        this.container.style.transitionDuration = "0s";
        this.contRect = this.container.getBoundingClientRect();
        this.parentRect = this.container.parentNode.getBoundingClientRect();
        this.nodeRect = this.container.children[0].getBoundingClientRect();
        this.nodeOuterWidth = this.container.children[1].getBoundingClientRect().left-this.nodeRect.left;
        this.distance = this.initiatePos.x - (this.contRect.left-this.parentRect.left);
        this.desitPromise = new Promise((resolve)=>{
            this.onResolve = resolve;
        });
        this._swiping.apply(this);

    }

    _swiping() {

        this.animationLoop = requestAnimationFrame(this._swiping.bind(this));
        this.container.style.transform = `translate3d(${this.actingPos.x-this.distance}px, 0, 0)`;
        console.log('leftLimit:',this.container.parentNode.getBoundingClientRect().left-this.container.getBoundingClientRect().left);
        console.log('rightLimit:',this.container.getBoundingClientRect().right-this.container.parentNode.getBoundingClientRect().right);
        if((this.container.parentNode.getBoundingClientRect().left-this.container.getBoundingClientRect().left)<= this.nodeOuterWidth){
//            this.distance += this.contRect.width/2-(this.nodeOuterWidth-this.singleBlock.margin);
            this.distance += this.nodeOuterWidth*this.origNodesCount;
        }
        if((this.container.getBoundingClientRect().right-this.container.parentNode.getBoundingClientRect().right)<= this.nodeOuterWidth){
//            this.distance += -this.contRect.width/2+(this.nodeOuterWidth-this.singleBlock.margin);
            this.distance += -this.nodeOuterWidth*this.origNodesCount;
        }
        console.log(this.distance);
        this.desitPromise.then(()=>{this._end();});
    }

    _end() {
        cancelAnimationFrame(this.animationLoop);
        this.container.style.transitionDuration = "0.5s";
        this.staticPos = (Math.round((this.actingPos.x-this.distance) / this.nodeOuterWidth) * this.nodeOuterWidth);
        this.container.style.transform = `translate3d(${this.staticPos}px, 0, 0)`;

    }

    _initiate() {

        this.nodesArr = this.container.querySelectorAll('div');
        this.origNodesCount = this.nodesArr.length;
        this._resize.apply(this);
        this.staticPos = -this.nodeOuterWidth*(Math.floor(this.nodesArr.length/2)+1);
        this.container.style.transform = `translate3d(${this.staticPos}px, 0, 0)`;
        let lenI = Math.floor(this.nodesArr.length/2);
        for(let i=0;i<=lenI;i++){
            this.container.appendChild(this.nodesArr[i].cloneNode(true));
        }
        for(let j=this.nodesArr.length-1;j>=lenI;j--){
            this.container.insertBefore(this.nodesArr[j].cloneNode(true),this.container.firstElementChild);
        }

    }

    _resize() {
        this.contRect = this.container.getBoundingClientRect();
        this.parentRect = this.container.parentNode.getBoundingClientRect();
        this.nodeRect = this.container.children[0].getBoundingClientRect();

        this.singleBlock.width = (this.parentRect.width/this.singleBlock.perScreen)-this.singleBlock.margin*2;

        this.nodesArr = this.container.querySelectorAll('div');
        this.container.style.width = ((this.singleBlock.width+this.singleBlock.margin)*(this.origNodesCount+1)*2)+'px';
        this.container.style.height = '100%';


        for(let node of this.nodesArr) {
            node.style.width = this.singleBlock.width+'px';
            node.style.height = '100%';
            node.style.margin  = '0 '+this.singleBlock.margin+'px';
        }
        this.nodeOuterWidth = this.singleBlock.width+(this.singleBlock.margin*2);
        this.staticPos = (Math.round(this.staticPos / this.nodeOuterWidth) * this.nodeOuterWidth);
        this.container.style.transform = `translate3d(${this.staticPos}px, 0, 0)`;
        
    }

    block(num) {
        this.singleBlock.perScreen = num;
        return this;
    }

    space(num) {
        this.singleBlock.margin = num;
        return this;
    }

}