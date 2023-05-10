let AC_GAME_OBJECT=[];

class AcGameObject{
    constructor(){
        AC_GAME_OBJECT.push(this);
        
        this.has_called_start=false; //是否执行过start
        this.timedelta=0; //当前距离上一帧的时间

        this.uuid=this.create_uuid();

    }

    create_uuid(){
        let res="";
        for(let i=0;i<20;i++){
            let x=parseInt(Math.floor(Math.random()*10));
            res+=x;
        }
        return res;
    }

    start(){ //只在第一帧执行
    }

    update(){ //每一帧都会执行
    }

    late_update(){ //在每一帧最后执行一次
    }

    on_destroy(){ //被删除前执行一次
    }

    destroy(){ //删除该物体
        this.on_destroy();

        for(let i=0;i<AC_GAME_OBJECT.length;i++){
        if(AC_GAME_OBJECT[i]===this){
            AC_GAME_OBJECT.splice(i,1);
            break;
            }
        }
    }
}

let last_timestamp;
let AC_GAME_ANIMATION=function(timestamp){
    for(let i=0;i<AC_GAME_OBJECT.length;i++){
        let obj=AC_GAME_OBJECT[i];
        if(!obj.has_called_start){
            obj.start();
            obj.has_called_start=true;
        }
        else{
            obj.timedelta=timestamp-last_timestamp;
            obj.update();
        }
    }

    for(let i=0;i<AC_GAME_OBJECT.length;i++){
        let obj=AC_GAME_OBJECT[i];
        obj.late_update();
    }

    last_timestamp=timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
