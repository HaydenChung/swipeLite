export default class Touch {

    static down (e){
        e.preventDefault();
        this.boundMove=Touch.move.bind(this);
        this.boundDesist=Touch.desist.bind(this);
        this.initiatePos = {x:e.targetTouches[0].pageX,y:e.targetTouches[0].pageY};
        this.actingPos = this.initiatePos;
        window.addEventListener('touchmove',this.boundMove);
        window.addEventListener('touchend',this.boundDesist);
        document.addEventListener('touchcancel',this.boundDesist);

    }

    static move (e){
        e.preventDefault();
        this.actingPos ={x:e.targetTouches[0].pageX,y:e.targetTouches[0].pageY};
    }

    static desist (e){
        e.preventDefault();
        window.removeEventListener('touchmove',this.boundMove);
        window.removeEventListener('touchend',this.boundDesist);
        window.removeEventListener('touchcancel',this.boundDesist);
        this.desistPos = this.actingPos;
        this.onResolve();
    }

    static cancel (e){
        e.preventDefault();
        window.removeEventListener('touchmove',this.boundMove);
        window.removeEventListener('touchend',this.boundDesist);
        window.removeEventListener('touchcancel',this.boundDesist);
        this.desistPos = this.actingPos;

    } 
}