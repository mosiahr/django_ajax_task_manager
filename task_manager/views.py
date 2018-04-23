from django.shortcuts import render
from django.views.generic import ListView, CreateView
from django.contrib.auth.mixins import LoginRequiredMixin

from .forms import TaskAddForm
from .models import Task


class TaskListView(ListView):
    model = Task
    template_name = 'task/task_list.html'
    context_object_name = 'tasks'


    # def get_context_data(self, **kwargs):
    #     ctx = super(TaskListView, self).get_context_data(**kwargs)
    #     ctx.update({'title': self.title})


class TaskAddView(LoginRequiredMixin, CreateView):
    form_class = TaskAddForm
    model = Task