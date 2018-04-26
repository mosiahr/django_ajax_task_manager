from django.shortcuts import render
from django.views.generic import ListView, CreateView, View
from django.contrib.auth.mixins import LoginRequiredMixin

import json
from django.http import JsonResponse
from django.core import serializers

from .forms import TaskAddForm, CategoryAddForm
from .models import Task, Category


class TaskListView(ListView):
    model = Task
    template_name = 'task/task_list.html'
    context_object_name = 'tasks'



class TaskJsonView(View):
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def post(self, request):
        queryset = self.get_queryset()
        print(queryset)
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def get_queryset(self):
        return Task.objects.all()


class TaskAddView(LoginRequiredMixin, CreateView):
    form_class = TaskAddForm
    model = Task
    success_url = '/success/'
    template_name = 'task_manager/task_form.html'

    # def get(self, request):
    #     context = {'form': self.get_form(), 'tasks': Task.objects.all()}
    #     return render(request, 'task_manager/task_form.html', context)

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_invalid(self, form):
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return super(TaskAddView, self).form_invalid(form)

    def form_valid(self, form):
        response = super(TaskAddView, self).form_valid(form)
        if self.request.is_ajax():
            # print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data."
            }
            return JsonResponse(data)
        else:
            return response

    def get_context_data(self, **kwargs):
        context = super(TaskAddView, self).get_context_data(**kwargs)
        tasks = Task.objects.all()
        categories = Category.objects.all()
        context.update({ 'tasks': tasks, 'categories': categories, 'form_cat': CategoryAddForm })
        return context


class CategoryAddView(LoginRequiredMixin, CreateView):
    form_class = CategoryAddForm
    model = Category
    success_url = '/success/'
    template_name = 'task_manager/category_form.html'

    # def get(self, request):
    #     context = {'form': self.get_form(), 'tasks': Task.objects.all()}
    #     return render(request, 'task_manager/task_form.html', context)

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_invalid(self, form):
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return super(CategoryAddView, self).form_invalid(form)

    def form_valid(self, form):
        response = super(CategoryAddView, self).form_valid(form)
        if self.request.is_ajax():
            # print(form.cleaned_data)
            data = {
                'message': "Successfully submitted form data."
            }
            return JsonResponse(data)
        else:
            return response

    # def get_context_data(self, **kwargs):
    #     context = super(CategoryAddView, self).get_context_data(**kwargs)
    #     tasks = Task.objects.all()
    #     categories = Category.objects.all()
    #     context.update({ 'tasks': tasks, 'categories': categories })
    #     return context


class CategoryJsonView(View):
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def post(self, request):
        queryset = self.get_queryset()
        print(queryset)
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def get_queryset(self):
        return Category.objects.all()