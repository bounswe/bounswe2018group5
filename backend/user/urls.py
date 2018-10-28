from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^auth/login', views.login, name="login"),
    url(r'^auth/register', views.register, name="register"),
    url(r'^auth/logout', views.logout, name="logout"),
    url(r'^profile/(?P<user_id>[a-z0-9,]*)/$', views.get_user, name="get_user"),
    url(r'^profile', views.get_current_user, name="get_current_user"),
    url(r'^profile/update', views.update_user, name="update_user")
]