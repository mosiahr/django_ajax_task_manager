from django.conf.urls import url

from .views import (
    TaskListAPIView,
    CategoryListAPIView,
)


urlpatterns = [
    url(r'^$', TaskListAPIView.as_view(), name='task_list'),
    # url(r'^category/$', CategoryListAPIView.as_view(), name='category_list'),
]