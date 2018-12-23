"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include,path
from django.conf.urls import url
from django.conf import settings
from django.conf.urls.static import static
from . import attachment
from . import semantic_tags
from . import recommendation_engine

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/user/', include('user.urls')),
    url(r'^api/project/', include('project.urls')),
    path('api/attachment/', attachment.attachment_handler, name="attachment"),
    path('api/tag/', semantic_tags.tag_handler, name="semantic_tags"),
    path('api/recommend/', recommendation_engine.recommend, name="recommendation")
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
