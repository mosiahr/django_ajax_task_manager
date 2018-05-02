from rest_framework.generics import ListAPIView

from task_manager.models import Task, Category
from .serializers import TaskSerializer, CategorySerializer



class TaskListAPIView(ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
