from django.urls import path
from game.views import index,game_interface
urlpatterns = [
    path("",index,name="index"),
    path("game/",game_interface,name="interface"),
]
