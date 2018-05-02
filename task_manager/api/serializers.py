from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.validators import UnicodeUsernameValidator

from task_manager.models import Mark, Category, Task



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',)


class CategorySerializer(serializers.ModelSerializer):
    # category_name = serializers.RelatedField(read_only=True)
    class Meta:
        model = Category
        fields = '__all__'
        # fields = ('category_name', 'name')


class MarkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mark
        fields = ('name',)


class TaskSerializer(serializers.ModelSerializer):
    mark = MarkSerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    author = UserSerializer(read_only=True)
    performer = UserSerializer(read_only=True, many=True)
    
    class Meta:
        model = Task
        fields = ('id', 'name', 'category', 'mark', 'description', 'deadline', 'author', 'performer')
        # fields =  '__all__' 





