export default class Mouse{

    static down (e){
        e.preventDefault();
        this.boundMove=Mouse.move.bind(this);
        this.boundDesist=Mouse.desist.bind(this);
        window.addEventListener('mousemove',this.boundMove);
        window.addEventListener('mouseup',this.boundDesist);
//Didn't invoke when mouse leaving window,need to google.
//        window.addEventListener('mouseleave',Mouse.desist);
        this.initiatePos = {x:e.clientX,y:e.clientY};
        this.actingPos = this.initiatePos;
    };

    static move (e){
        e.preventDefault();
        this.actingPos = {x:e.clientX,y:e.clientY};
    }

    static desist (e){
        e.preventDefault();
        window.removeEventListener('mousemove',this.boundMove);
        window.removeEventListener('mouseup',this.boundDesist);
//        window.removeEventListener('mouseleave',Mouse.desist);
        this.desistPos = {x:e.clientX,y:e.clientY};
        this.onResolve();
        console.log(this);
    }

}