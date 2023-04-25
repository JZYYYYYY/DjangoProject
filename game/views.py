from django.http import HttpResponse

def index(request):
    line1 = '<h1 style="text-align: center">术士之战!</h1>'
    line2 = '<img src="https://bkimg.cdn.bcebos.com/pic/c2cec3fdfc039245efdd58288f94a4c27d1e25a8?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5" width=2000>'
    return HttpResponse(line1+line2)
