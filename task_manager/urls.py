from django.conf.urls import url

from .views import (
	TaskListView,
	TaskAddView, 
	TaskJsonView,
	CategoryAddView,
	CategoryJsonView,
	MarkJsonView
)


urlpatterns = [
    url(r'^$', TaskAddView.as_view(), name='task_add'),
    url(r'^list/$', TaskListView.as_view(), name='task_list'),
    url(r'^add/category/$', CategoryAddView.as_view(), name='category_add'),
    url(r'^json/$', TaskJsonView.as_view(), name='task_json'),
    url(r'^json/category/$', CategoryJsonView.as_view(), name='category_json'),
    url(r'^json/mark/$', MarkJsonView.as_view()),
]