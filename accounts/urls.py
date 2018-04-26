from django.conf.urls import url

from django.urls import reverse_lazy
from django.contrib.auth.views import(
    LoginView,
    LogoutView,
)

from .forms import LoginForm


urlpatterns = [
    url(r'^login/$', LoginView.as_view(template_name='accounts/login.html',
     authentication_form=LoginForm), name='login'),
    url(r'^logout/$', LogoutView.as_view(next_page=reverse_lazy('accounts:login')), name='logout')
]