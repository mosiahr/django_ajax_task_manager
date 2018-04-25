from django.conf.urls import url

from .views import TaskListView, TaskAddView, TaskJsonView


urlpatterns = [
    url(r'^list/$', TaskListView.as_view(), name='task_list'),
    url(r'^add/$', TaskAddView.as_view(), name='task_add'),
    url(r'^json/$', TaskJsonView.as_view(), name='task_json'),
]