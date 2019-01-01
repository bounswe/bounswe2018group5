from . import views
from django.conf.urls import url
from django.urls import path

urlpatterns = [
    path('auth/login', views.login, name="login"),
    path('auth/register', views.register, name="register"),
    path('auth/logout', views.logout, name="logout"),
    path('profile/', views.profile_handler, name="get_user"),
    path('profile/upload_image/', views.upload_image, name="upload_image"),
    path('rating/', views.rating_handler, name="add_rating"),
    path('portfolio/', views.portfolio_handler, name="portfolio_handler"),
    path('wallet/', views.wallet_handler, name="wallet_handler"),
    path('message/', views.message_handler, name="message_handler")
]
