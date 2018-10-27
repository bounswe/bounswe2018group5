from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^auth/login', views.login, name="login"),
    url(r'^auth/register', views.register, name="register"),
    url(r'^auth/logout', views.logout, name="logout")
]