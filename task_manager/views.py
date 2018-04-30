from django.shortcuts import render
from django.views.generic import ListView, CreateView, View, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.auth.models import User

import json
from django.http import JsonResponse
from django.core import serializers

from django.db.models import Q

from .forms import TaskAddForm, CategoryAddForm, MarkAddForm
from .models import Task, Category, Mark


# class TaskListView(ListView):
#     model = Task
#     template_name = 'task/task_list.html'
#     context_object_name = 'tasks'

#     def get_queryset(self):
#         print(self.request.user.id)
#         return Task.objects.filter(author=self.request.user.id)



class TaskJsonView(View):
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def post(self, request):
        queryset = self.get_queryset()
        # print(queryset)
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def get_queryset(self):
        return Task.objects.all()


class TaskAddView(LoginRequiredMixin, CreateView):
    form_class = TaskAddForm
    model = Task
    success_url = '/success/'
    template_name = 'task_manager/task_form.html'

    def post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)

    def form_invalid(self, form):
        response = super(TaskAddView, self).form_invalid(form)
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return response

    def form_valid(self, form):
        obj = form.save(commit=False)
        obj.author = self.get_object()
        obj.save()
        form.save_m2m()    

        queryset = self.get_queryset()
        # print(queryset)
        response = super(TaskAddView, self).form_valid(form)
        if self.request.is_ajax():
            data = {
                'queryset': serializers.serialize("json", queryset)
            }
            return JsonResponse(data)
        else:
            return response

    def get_context_data(self, **kwargs):
        self.object = self.get_object()
        context = super(TaskAddView, self).get_context_data(**kwargs)
        tasks = self.get_queryset()
        print(tasks)
        categories = Category.objects.all()
        marks = Mark.objects.all()
        context.update({ 'tasks': tasks, 'categories': categories, 'marks': marks})
        return context

    def get_queryset(self):
        qs = Task.objects.filter(Q(author=self.request.user.id)|Q(performer__in=[self.request.user.id])).distinct()
        return qs

    def get_object(self, queryset=None):
        # print(self.request.user)
        return self.request.user


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
            data = {
                'id': self.object.pk,
            }
            return JsonResponse(data)
        else:
            return response


class CategoryJsonView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def post(self, request):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def get_queryset(self):
        return Category.objects.all()


class MarkJsonView(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def post(self, request):
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def get_queryset(self):
        return Mark.objects.all()


class MarkAddView(LoginRequiredMixin, CreateView):
    form_class = MarkAddForm
    model = Mark
    success_url = '/success/'
    template_name = 'task_manager/mark_form.html'

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
            return super(MarkAddView, self).form_invalid(form)

    def form_valid(self, form):
        response = super(MarkAddView, self).form_valid(form)
        if self.request.is_ajax():
            data = {
                'id': self.object.pk,
            }
            return JsonResponse(data)
        else:
            return response


class TaskDeleteAjaxView(LoginRequiredMixin, View):
    def post(self, request):
        id = request.POST['id']
        Task.objects.get(id=id).delete()
        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        return JsonResponse(data, status=200, safe=False)

    def get_object(self, queryset=None):
        print(self.kwargs)
        obj = Task.objects.get(pk=self.kwargs['pk'])
        return obj

    def get_queryset(self):
        return Task.objects.all()

