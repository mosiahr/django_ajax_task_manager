from django.conf.urls import url

from .views import TaskListView


urlpatterns = [
    url(r'^list/$', TaskListView.as_view(), name='task_list'),
]