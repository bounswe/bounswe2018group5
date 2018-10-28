from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'create', views.create_project, name="create_project"),
    url(r'^getAll', views.get_all_projects, name="get_all_projects"),
    url(r'^get', views.get_projects, name="get_projects"),
    url(r'^update', views.update_project, name="update_project"),
    url(r'^discard', views.discard_projects, name="discard_projects"),
]
