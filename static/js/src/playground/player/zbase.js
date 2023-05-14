class Player extends AcGameObject{
    constructor(playground,x,y,radius,color,speed,character,username,photo){
        super();
        this.playground=playground;
        this.ctx=this.playground.game_map.ctx;
        this.x=x;
        this.y=y;
        this.vx=0;
        this.vy=0;
        this.damage_x=0;
        this.damage_y=0;
        this.damage_speed=0;
        this.radius=radius;
        this.color=color;
        this.speed=speed;
        this.character=character;
        this.username=username;
        this.photo=photo;
        this.eps=0.01;
        this.move_length=0;
        this.friction=0.9;
        this.spent_time=0;
        this.fireballs=[];

        this.cur_skill=null;

        if(this.character!=="robot"){
            this.img = new Image();
            this.img.src = this.photo;
        }

        if(this.character==="me"){
            this.fireball_cd=1.5; //火球cd时间,单位:秒
            this.fireball_img=new Image();
            this.fireball_img.src="https://cdn.acwing.com/media/article/image/2021/12/02/1_9340c86053-fireball.png";

            this.flash_cd=5; //闪现cd时间,单位:秒
            this.flash_img=new Image();
            this.flash_img.src="https://cdn.acwing.com/media/article/image/2021/12/02/1_daccabdc53-blink.png";
        }
    }

    start(){
        this.playground.player_count++;
        this.playground.notice_board.write("已就绪:"+this.playground.player_count+"人");

        if(this.playground.player_count>=3){
            this.playground.state="fighting";
            this.playground.notice_board.write("Fighting");
        }

        if(this.character==="me"){
            this.add_listening_events();
        }else if(this.character==="robot"){
            let tx=Math.random()*this.playground.width/this.playground.scale;
            let ty=Math.random()*this.playground.height/this.playground.scale;
            this.move_to(tx,ty);
        }
    }

    add_listening_events(){
        let outer=this;
        this.playground.game_map.$canvas.on("contextmenu",function(){
            return false;
        });
        this.playground.game_map.$canvas.mousedown(function(e){
            if(outer.playground.state!=="fighting"){
                return false;
            }

            const rect=outer.ctx.canvas.getBoundingClientRect();
            if(e.which===3){
                let tx=(e.clientX-rect.left)/outer.playground.scale;
                let ty=(e.clientY-rect.top)/outer.playground.scale;
                outer.move_to(tx,ty);

                if(outer.playground.mode==="multi mode"){
                    outer.playground.mps.send_move_to(tx,ty);
                }
            } 
            else if(e.which===1){
                let tx=(e.clientX-rect.left)/outer.playground.scale;
                let ty=(e.clientY-rect.top)/outer.playground.scale;
                if(outer.cur_skill==="fireball"){
                    if(outer.fireball_cd>outer.eps)
                        return false;

                    let fireball=outer.shoot_fireball(tx,ty);
                    if(outer.playground.mode==="multi mode"){
                        outer.playground.mps.send_shoot_fireball(tx,ty,fireball.uuid);
                    }
                }
                else if(outer.cur_skill==="flash"){
                    if(outer.flash_cd>outer.eps)
                        return false;

                    outer.flash(tx,ty);

                    if(outer.playground.mode==="multi mode"){
                        outer.playground.mps.send_flash(tx,ty);
                    }
                }
                outer.cur_skill=null;
            }
        });

        this.playground.game_map.$canvas.keydown(function(e){
            if(e.which===13){ // enter键
                if(outer.playground.mode==="multi mode"){
                    outer.playground.chat_field.show_input();
                    return false;
                }
            }
            else if(e.which===27){ //esc键
                if(outer.playground.mode==="multi mode"){
                    outer.playground.chat_field.hide_input();
                }
            }

            if(outer.playground.state!=="fighting")
                return true;

            if (outer.radius < outer.eps) 
                return false; //如果玩家死了，就不能发射火球

            if(e.which===81){ //q键
                if(outer.fireball_cd>outer.eps)
                    return true;
                outer.cur_skill="fireball";
                return false;
            }
            else if(e.which===68){ //d键
                if(outer.flash_cd>outer.eps)
                    return true;
                outer.cur_skill="flash";
                return false;
            }
        });
    }

    shoot_fireball(tx,ty){
        let x=this.x;
        let y=this.y;
        let radius=0.01;
        let angle=Math.atan2(ty-this.y,tx-this.x);
        let vx=Math.cos(angle);
        let vy=Math.sin(angle);
        let color="orange";
        let speed=0.5;
        let move_length=1;
        let fireball=new FireBall(this.playground,this,x,y,radius,vx,vy,color,speed,move_length,0.01);
        this.fireballs.push(fireball);

        this.fireball_cd=1.5;
        return fireball;
    }

    destroy_fireball(uuid){
        for(let i=0;i<this.fireballs.length;i++){
            let fireball=this.fireballs[i];
            if(fireball.uuid===uuid){
                fireball.destroy();
                break;
            }
        }
    }

    flash(tx,ty){
        let d=this.get_dist(this.x,this.y,tx,ty);
        d=Math.min(d,0.3);
        let angle=Math.atan2(ty-this.y,tx-this.x);
        this.x+=d*Math.cos(angle);
        this.y+=d*Math.sin(angle);

        this.flash_cd=5;
        this.move_length=0; //闪现之后停止移动
    }

    get_dist(x1,y1,x2,y2){
        let dx=x1-x2;
        let dy=y1-y2;
        return Math.sqrt(dx*dx+dy*dy);
    }

    move_to(tx,ty){
        this.move_length=this.get_dist(this.x,this.y,tx,ty);
        let angle=Math.atan2(ty-this.y,tx-this.x);
        this.vx=Math.cos(angle);
        this.vy=Math.sin(angle);
    }

    is_attacked(angle,damage){
        for(let i=0;i<10+Math.random()*5;i++){
            let x=this.x;
            let y=this.y;
            let radius=this.radius*Math.random()*0.1;
            let angle = Math.PI * 2 * Math.random();
            let vx=Math.cos(angle);
            let vy=Math.sin(angle);
            let color=this.color;
            let speed=this.speed*10;
            let move_length=this.radius*Math.random()*5;
            new Particle(this.playground,x,y,radius,vx,vy,color,speed,move_length);
        }

        this.radius-=damage;
        if(this.radius<this.eps){
            this.destroy();
            return false;
        }
        this.speed*=1.1;
        this.damage_x=Math.cos(angle);
        this.damage_y=Math.sin(angle);
        this.damage_speed=damage*80;

    }

    receive_attack(x,y,angle,damage,ball_uuid,attacker){
        attacker.destroy_fireball(ball_uuid);
        this.x=x;
        this.y=y;
        this.is_attacked(angle,damage);
    }

    update(){
        this.spent_time += this.timedelta / 1000;
        this.update_win();

        if(this.character==="me" && this.playground.state==="fighting"){
            this.update_cd();
        }
        this.update_move();
        this.update_map_view();
        this.render();
    }

    update_win(){
        if(this.playground.state==="fighting" && this.character==="me" && this.playground.players.length===1){
            this.playground.state="over";
            this.playground.score_board.win();
        }
    }

    update_map_view(){
        if(this.character === "me"){
            this.playground.cx = this.x - this.playground.width / 2 / this.playground.scale;
            this.playground.cy = this.y - 0.5;
            this.playground.cx = Math.max(0, this.playground.cx);
            this.playground.cx = Math.min(this.playground.virtual_width - this.playground.width / this.playground.scale, this.playground.cx);
            this.playground.cy = Math.max(0, this.playground.cy);
            this.playground.cy = Math.min(this.playground.virtual_height - 1, this.playground.cy);
        }
    }

    update_cd(){
        this.fireball_cd-=this.timedelta/1000;
        this.fireball_cd=Math.max(this.fireball_cd,0);

        this.flash_cd-=this.timedelta/1000;
        this.flash_cd=Math.max(this.flash_cd,0);
    }

    update_move(){ //更新玩家移动
        if (this.character==="robot" && this.spent_time>4 && Math.random()<1/120.0){
            let player=this.playground.players[0];
            this.shoot_fireball(player.x,player.y);
        }
        if (this.damage_speed > this.eps*10) {
            this.vx = this.vy = 0;
            this.move_length = 0;
            this.x += this.damage_x * this.damage_speed * this.timedelta / 1000;
            this.y += this.damage_y * this.damage_speed * this.timedelta / 1000;
            this.damage_speed *= this.friction;
        }
        else {
            if (this.move_length < this.eps) {
                this.move_length = 0;
                this.vx = this.vy = 0;
                if (this.character==="robot") {
                    let tx = Math.random() * this.playground.width / this.playground.scale;
                    let ty = Math.random() * this.playground.height / this.playground.scale;
                    this.move_to(tx, ty);
                }
            }
            else {
                let moved = Math.min(this.move_length, this.speed * this.timedelta / 1000);
                this.x += this.vx * moved;
                this.y += this.vy * moved;
                this.move_length -= moved;
            }
        }

    }

    render(){
        let scale=this.playground.scale;
        if(this.character!=="robot"){
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.arc(this.x*scale, this.y*scale, this.radius*scale, 0, Math.PI * 2, false);
            this.ctx.stroke();
            this.ctx.clip();
            this.ctx.drawImage(this.img, (this.x - this.radius)*scale,(this.y - this.radius)*scale, this.radius * 2*scale, this.radius * 2*scale);
            this.ctx.restore();
        }
        else{
            this.ctx.beginPath();
            this.ctx.arc(this.x*scale,this.y*scale,this.radius*scale,0,Math.PI*2,false);
            this.ctx.fillStyle=this.color;
            this.ctx.fill();
        }

        if(this.character==="me" && this.playground.state==="fighting"){
            this.render_skill_cd();
        }
    }

    render_skill_cd(){
        let scale=this.playground.scale;
        let x=1.5;
        let y=0.9;
        let r=0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x*scale,y*scale,r*scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.fireball_img, (x - r)*scale,(y - r)*scale, r * 2*scale, r * 2*scale);
        this.ctx.restore();
        if(this.fireball_cd>0){
            this.ctx.beginPath();
            this.ctx.moveTo(x*scale,y*scale);
            this.ctx.arc(x*scale,y*scale,r*scale,0-Math.PI/2,Math.PI*2*(1-this.fireball_cd/1.5)-Math.PI/2,true);
            this.ctx.lineTo(x*scale,y*scale);
            this.ctx.fillStyle="rgba(0,0,255,0.5)";
            this.ctx.fill();
        }

        x=1.62;
        y=0.9;
        r=0.04;
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(x*scale,y*scale,r*scale, 0, Math.PI * 2, false);
        this.ctx.stroke();
        this.ctx.clip();
        this.ctx.drawImage(this.flash_img, (x - r)*scale,(y - r)*scale, r * 2*scale, r * 2*scale);
        this.ctx.restore();
        if(this.flash_cd>0){
            this.ctx.beginPath();
            this.ctx.moveTo(x*scale,y*scale);
            this.ctx.arc(x*scale,y*scale,r*scale,0-Math.PI/2,Math.PI*2*(1-this.flash_cd/5)-Math.PI/2,true);
            this.ctx.lineTo(x*scale,y*scale);
            this.ctx.fillStyle="rgba(0,0,255,0.5)";
            this.ctx.fill();
        }

    }

    on_destroy(){
        if(this.character==="me"){
            if(this.playground.state==="fighting"){
                this.playground.state="over";
                this.playground.score_board.lose();
            }
        }
        for(let i=0;i<this.playground.players.length;i++){
            if(this.playground.players[i]===this){
                this.playground.players.splice(i,1);
                break;
            }
        }
    }
}
