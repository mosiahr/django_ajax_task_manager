from django.shortcuts import render
from django.views.generic import ListView, CreateView, View, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin

import json
from django.http import JsonResponse
from django.core import serializers

from .forms import TaskAddForm, CategoryAddForm, MarkAddForm
from .models import Task, Category, Mark


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
        response = super(TaskAddView, self).form_invalid(form)
        if self.request.is_ajax():
            return JsonResponse(form.errors, status=400)
        else:
            return response

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
        marks = Mark.objects.all()
        context.update({ 'tasks': tasks, 'categories': categories, 'marks': marks})
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
        print('id: ', id)
        self.kwargs['pk'] = id
        # Task.objects.get(id=id).delete()

        queryset = self.get_queryset()
        data = serializers.serialize("json", queryset)
        # print('data', data)
        return JsonResponse(data, status=200, safe=False)

    def get_object(self, queryset=None):
        print(self.kwargs)
        obj = Task.objects.get(pk=self.kwargs['pk'])
        return obj

    def get_queryset(self):
        return Task.objects.all()

    