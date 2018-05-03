from django import forms
from .models import Task, Category, Mark


class TaskAddForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ('name', 'category', 'mark', 'description', 'deadline', 'performer')

    def __init__(self, *args, **kwargs):
        super(TaskAddForm, self).__init__(*args, **kwargs)
        self.fields['deadline'].widget.attrs = {"class": "datepicker"}

    def clean(self):
        cleaned_data = super(TaskAddForm, self).clean()
        name = cleaned_data.get("name")
        category = cleaned_data.get("category")
        
        if name and category:
            task_filter = Task.objects.filter(category__name=category, name=name)
            task_filter = [el.name for el in task_filter]
            if name in task_filter:
                print('dublicat')
                raise forms.ValidationError("Task with this name and this category already exists.")


class CategoryAddForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ('name',)


class MarkAddForm(forms.ModelForm):
    class Meta:
        model = Mark
        fields = ('name',)
