from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">术士之战</h1>'
    line3 = '<a href="/game">进入游戏界面</a>'
    line2 = '<img src="https://bkimg.cdn.bcebos.com/pic/c2cec3fdfc039245efdd58288f94a4c27d1e25a8?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5" width=800>'
    return HttpResponse(line1+line3+line2)

def game_interface(request):
    line1 = '<h1 style="test-align: center">游戏界面</h1>'
    line2 = '<a href="/">返回</a>'
    return HttpResponse(line1+line2)
