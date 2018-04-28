from django import forms

from .models import Task, Category, Mark


class TaskAddForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = '__all__'


class CategoryAddForm(forms.ModelForm):
	class Meta:
		model = Category
		fields = '__all__'


class MarkAddForm(forms.ModelForm):
	class Meta:
		model = Mark
		fields = ('name',)
