from django.conf.urls import url
from django.urls import path

from . import views

urlpatterns = [
    path('', views.project_handler, name="get_projects"),
    path('own/', views.get_own_projects, name="get_own_projects"),
    path('search/', views.search_projects, name="search_projects"),
    path('bid/add/', views.add_bid, name="add_bid"),
    path('bid/accept/', views.accept_bid, name="accept_bid"),
    path('bid/discard/', views.discard_bid, name="discard_bid"),
    path('bid/update/', views.update_bid, name="get_bids"),
]
