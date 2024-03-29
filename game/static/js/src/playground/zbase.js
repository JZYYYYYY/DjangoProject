class AcGamePlayground{
    constructor(root){
        this.root=root;
        this.$playground=$(`<div class="ac-game-playground"></div>`);
        this.hide();
        this.root.$ac_game.append(this.$playground);
        this.cx=0;
        this.cy=0;
        this.start();
    }

    get_random_color(){
        let colors=["blue","gray","green","red","Pink","orange"];
        return colors[Math.floor(Math.random()*5)];
    }

    create_uuid(){
        let res="";
        for(let i=0;i<20;i++){
            let x=parseInt(Math.floor(Math.random()*10));
            res+=x;
        }
        return res;
    }

    start(){
        let outer=this;
        let uuid=this.create_uuid();
        $(window).on(`resize.${uuid}`,function(){
            outer.resize();
        });

        if(this.root.AcWingOS){
            this.root.AcWingOS.api.window.on_close(function(){
                $(window).off(`resize.${uuid}`);
            });
        }
    }

    resize(){
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        let unit = Math.min(this.width / 16, this.height / 9);
        this.width = unit * 16;
        this.height = unit * 9;
        this.scale=this.height;
        this.virtual_width = this.width / this.scale * 3;
        this.virtual_height = 3;
        this.cx = this.virtual_width / 2 - this.width / 2 / this.scale;
        this.cy = this.virtual_height / 2 - this.height / 2 / this.scale;


        if(this.game_map) this.game_map.resize();
        if(this.mini_map) this.mini_map.resize();
    }

    show(mode){ //打开playground界面
        let outer=this;
        this.$playground.show();
        this.resize();
        this.width=this.$playground.width();
        this.height=this.$playground.height();
        this.bgm=new Audio(this);
        this.game_map=new GameMap(this);
        this.grid=new Grid(this);
        this.mode=mode;
        this.state="waiting" //waiting->fighting->over
        this.notice_board=new NoticeBoard(this);
        this.score_board=new ScoreBoard(this);
        this.player_count=0;

        this.players=[];
        this.players.push(new Player(this,this.virtual_width/2,this.virtual_height/2,0.05,"white",0.25,"me",this.root.settings.username,this.root.settings.photo));
        
        if(mode==="single mode"){
            for(let i=0;i<8;i++){
                this.players.push(new Player(this,this.virtual_width*Math.random(),this.virtual_height*Math.random(),0.05,this.get_random_color(),0.25,"robot"));
            }
        }
        else if(mode==="multi mode"){
            this.chat_field=new ChatField(this);
            this.mps=new MultiPlayerSocket(this);
            this.mps.uuid=this.players[0].uuid;

            this.mps.ws.onopen=function(){
                outer.mps.send_create_player(outer.root.settings.username,outer.root.settings.photo);
            }
        }
    }
        hide(){ //关闭playground界面
            while(this.players && this.players.length>0){
                this.players[0].destroy();
            }

            if(this.game_map){
                this.game_map.destroy();
                this.game_map=null;
            }

            if(this.grid){
                this.grid.destroy();
                this.grid=null;
            }

            if(this.notice_board){
                this.notice_board.destroy();
                this.notice_board=null;
            }

            if(this.score_board){
                this.score_board.destroy();
                this.score_board=null;
            }

            if(this.mini_map){
                this.mini_map.destroy();
                this.mini_map=null;
            }

            this.$playground.empty();

            this.$playground.hide();
        }
}
