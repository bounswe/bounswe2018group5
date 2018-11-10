from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'create', views.create_project, name="create_project"),
    url(r'^get_all$', views.get_all_projects, name="get_all_projects"),
    url(r'^get/(?P<ids>[a-z0-9,]*)/$', views.get_projects, name="get_projects"),
    url(r'^update/', views.update_project, name="update_project"),
    url(r'^discard', views.discard_projects, name="discard_projects"),
    url(r'^search/(?P<query>[a-z0-9,]*)/$', views.search_projects, name="search_projects"),
]
