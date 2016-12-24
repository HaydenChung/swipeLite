import Mouse from "./mouse.js";
import Touch from "./touch.js";

export default class Carousel {
    constructor(targetElm) {
        this.container = targetElm;
        this.initiatePos = {x:0,y:0};
        this.actingPos = {x:0,y:0};
        this.desistPos = {x:0,y:0};
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
        this.leadingBlock = 0;
        this.pressing = false;
        this.slideDelay = 5000;
        this.transDuration = 500;
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
        clearTimeout(this._endTimer);
        clearInterval(this.slideTimer);
        if(typeof e.targetTouches != 'undefined'){
            Touch.down.call(this,e);
        }else{
            Mouse.down.call(this,e);
        }
        this.pressing = true;
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
        this._moveBlock(this.actingPos.x-this.distance);
        this._circling();
        this.desitPromise.then(()=>{this._end();});
    }

    _circling(isSwiping=false) {
        if((this.container.parentNode.getBoundingClientRect().left-this.container.getBoundingClientRect().left)<= this.nodeOuterWidth){
                this.distance += this.nodeOuterWidth*(this.origNodesCount);
        }
        if((this.container.getBoundingClientRect().right-this.container.parentNode.getBoundingClientRect().right)<= this.nodeOuterWidth){
                this.distance += -this.nodeOuterWidth*(this.origNodesCount);
        }
    }

    _circleWithBlock() {
        if(this.leadingBlock<= 1){
            this.container.style.transitionDuration = "0s"
            this.leadingBlock += this.origNodesCount;
            this._staticBlock();
        }
        if(this.leadingBlock>= this.nodesArr.length-this.singleBlock.perScreen){
            this.container.style.transitionDuration = "0s"
            this.leadingBlock += -this.origNodesCount;
            this._staticBlock();
        }
    }

    _end() {
        cancelAnimationFrame(this.animationLoop);
        this.container.style.transitionDuration = this.transDuration+"ms";
        this.leadingBlock = Math.round((this.actingPos.x-this.distance) / this.nodeOuterWidth)*-1;
        this._staticBlock();
        if(this.slideRestart === true) {
            clearTimeout(this._endTimer);
            this._endTimer = setTimeout(()=> this.slide() ,100);
        }
        this.pressing = false;
    }

    _staticBlock() {
        this._moveBlock(this.leadingBlock*-this.nodeOuterWidth);
    }

    _moveBlock(x) {
        this.container.style.transform = `translate3d(${x}px, 0, 0)`;
    }

    _initiate() {
        this.container.parentNode.style.touchAction = 'none';
        this.container.parentNode.style.overflow = 'hidden';
        this.nodesArr = this.container.querySelectorAll('.carousel_slide');
        this.origNodesCount = this.nodesArr.length;
        this.fakeBlock = Math.ceil(this.singleBlock.perScreen/2)+1;
        this._resize.apply(this);
        this.leadingBlock = (Math.floor(this.nodesArr.length/2)+1);
        this._staticBlock();
        for(let i=0,j=0;i<this.fakeBlock;i++,j++){
            if(typeof this.nodesArr[j] === 'undefined') j=0;
            this.container.appendChild(this.nodesArr[j].cloneNode(true));
        }
        for(let i=this.nodesArr.length-1,j=this.nodesArr.length-1;i>=this.nodesArr.length-this.fakeBlock;i--,j--){
            if(typeof this.nodesArr[j] === 'undefined') j=this.nodesArr.length-1;
            this.container.insertBefore(this.nodesArr[j].cloneNode(true),this.container.firstElementChild);
        }
        this.nodesArr = this.container.querySelectorAll('.carousel_slide');

    }

    _resize() {
        this.contRect = this.container.getBoundingClientRect();
        this.parentRect = this.container.parentNode.getBoundingClientRect();
        this.nodeRect = this.container.children[0].getBoundingClientRect();

        this.singleBlock.width = (this.parentRect.width/this.singleBlock.perScreen)-this.singleBlock.margin*2;
        this.container.style.width = ((this.singleBlock.width+this.singleBlock.margin)*((this.origNodesCount+1)+(this.fakeBlock*2)))+'px';
        this.container.style.height = '100%';

        for(let i=0,lenI=this.nodesArr.length;i<lenI;i++){
            this.nodesArr[i].style.display = 'block';
            this.nodesArr[i].style.float = 'left';
            this.nodesArr[i].style.width = this.singleBlock.width+'px';
            this.nodesArr[i].style.height = '100%';
            this.nodesArr[i].style.margin  = '0 '+this.singleBlock.margin+'px';
        }
        this.nodeOuterWidth = this.singleBlock.width+(this.singleBlock.margin*2);
        this._staticBlock();
    }

    slide(restart=true) {
        this.slideRestart = restart;
        this.stopSlide();
        this.slideTimer = setInterval(()=>{
            this.leadingBlock++;
            this.container.style.transitionDuration = this.transDuration+"ms";
            this._staticBlock();

            setTimeout(()=>{
                        this._circleWithBlock();
            },this.transDuration);
        },2500);
        return this;
    }

    stopSlide() {
        clearInterval(this.slideTimer);
    }

    prevBtn() {
        if(this.pressing===false){
            this.pressing=true;
            this.stopSlide();
            this.leadingBlock--;
            this.container.style.transitionDuration = this.transDuration+"ms";
            this._staticBlock();
            setTimeout(()=>{
                this._circleWithBlock();
                this.pressing=false;
                if(this.slideRestart === true){
                    this.slide();
                }
            },this.transDuration);
        }
    }

    nextBtn() {
        if(this.pressing===false){
            this.stopSlide();
            this.pressing=true;
            this.leadingBlock++;
            this.container.style.transitionDuration = this.transDuration+"ms";
            this._staticBlock();
            setTimeout(()=>{
                this._circleWithBlock();
                this.pressing=false;
                if(this.slideRestart === true){
                    this.slide();
                }
            },this.transDuration);
        }
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