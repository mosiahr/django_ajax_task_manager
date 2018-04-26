from django import forms

from .models import Task, Category


class TaskAddForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = '__all__'


class CategoryAddForm(forms.ModelForm):
	class Meta:
		model = Category
		fields = '__all__'
