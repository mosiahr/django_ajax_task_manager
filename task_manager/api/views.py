from rest_framework.generics import ListAPIView

from task_manager.models import Task, Category
from django.db.models import Q

from .serializers import TaskSerializer, CategorySerializer


class TaskListAPIView(ListAPIView):
    # queryset = get_queryset()
    serializer_class = TaskSerializer

    def get_queryset(self):
        qs = Task.objects.filter(Q(author=self.request.user.id)|Q(performer__in=[self.request.user.id])).distinct()
        category = self.request.query_params.get('category', None)
        print(category)
        if category is not None:
            qs = qs.filter(category=category)

        mark = self.request.query_params.get('mark', None)
        if mark is not None:
            qs = qs.filter(mark=mark)
        return qs


class CategoryListAPIView(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
