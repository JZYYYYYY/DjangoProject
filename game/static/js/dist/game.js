class AcGameMenu{
    constructor(root){
        this.root=root;
        this.$menu=$(`
<div class="ac-game-menu">
    <div class="ac-game-menu-field">
        <div class="ac-game-menu-field-item ac-game-menu-field-item-single-mode">
            单人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-multi-mode">
            多人模式
        </div>
        <br>
        <div class="ac-game-menu-field-item ac-game-menu-field-item-settings">
            设置
        </div>
    </div>
</div>
`);
        this.root.$ac_game.append(this.$menu);
        this.$single_mode=this.$menu.find('.ac-game-menu-field-item-single-mode');
        this.$multi_mode=this.$menu.find('.ac-game-menu-field-item-multi-mode');
        this.$settings=this.$menu.find('.ac-game-menu-field-item-settings');

        this.start();
    }

    start(){
        this.add_listening_events();
    }

    add_listening_events(){
        let outer=this;
        this.$single_mode.click(function(){
            outer.hide();
            outer.root.playground.show();
        });
        this.$multi_mode.click(function(){
            console.log("click multi mode");
        });
        this.$settings.click(function(){
            console.log("click settings");
        });
    }

    show(){ //显示menu界面
        this.$menu.show();
    }

    hide(){ //关闭menu界面
        this.$menu.hide();
    }

}
let AC_GAME_OBJECT=[];

class AcGameObject{
    constructor(){
        AC_GAME_OBJECT.push(this);
        
        this.has_called_start=false; //是否执行过start
        this.timedelta=0; //当前距离上一帧的时间

    }

    start(){ //只在第一帧执行
    }

    update(){ //每一帧都会执行
    }
    
    on_destory(){ //被删除前执行一次
    }

    destory(){ //删除该物体
        this.on_destory();

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
    last_timestamp=timestamp;

    requestAnimationFrame(AC_GAME_ANIMATION);
}

requestAnimationFrame(AC_GAME_ANIMATION);
class GameMap extends AcGameObject{
    constructor(playground){
        super();
        this.playground=playground;
        this.$canvas=$(`<canvas></canvas>`);
        this.ctx=this.$canvas[0].getContext('2d');
        this.ctx.canvas.width=this.playground.width;
        this.ctx.canvas.height=this.playground.height;
        this.playground.$playground.append(this.$canvas);
    }

    start(){
    }

    update(){
        this.render();
    }

    render(){
        this.ctx.fillStyle="rgba(0,0,0,0.2)";
        this.ctx.fillRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
    }
}
class AcGamePlayground{
    constructor(root){
        this.root=root;
        this.$playground=$(`<div class="ac-game-playground"></div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        this.game_map=new GameMap(this);
        this.start();

    }

    start(){
    }

    show(){ //打开playground界面
        this.$playground.show();
    }

    hide(){ //关闭playground界面
        this.$playground.hide();
    }

}
export class AcGame{
    constructor(id){
        this.id=id;
        this.$ac_game=$('#'+id);
        this.menu=new AcGameMenu(this);
        this.playground=new AcGamePlayground(this);

        this.start();
    }

    start(){
    }
}
