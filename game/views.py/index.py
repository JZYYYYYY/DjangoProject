from django.shoutcuts import render

def index(request):
    return render(request,"terminals/web.html")
