from django.urls import path

from . import views

urlpatterns = [
    url(r'^project/createProject', views.login, name="login"),
    url(r'^project/getProjects', views.register, name="get_projects"),
    url(r'^project/getProject', views.logout, name="get_project"),
    url(r'^project/updateProject', views.logout, name="update_project"),
    url(r'^project/discardProject', views.logout, name="delete_project"),
]