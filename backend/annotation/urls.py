from django.urls import path

from . import views

urlpatterns = [
    path('', views.annotation_handler, name="annotation_handler"),
]
