class Audio{
    constructor(playground){
        this.playground=playground;
        this.$bgm=$(`<audio src="https://app5353.acapp.acwing.com.cn/static/audio/fin.mp3" autoplay='autoplay' loop='loop' preload="auto"></audio>`);
        this.playground.$playground.append(this.$bgm);
    }
}
