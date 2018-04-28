from django import forms
from django.contrib.auth.forms import AuthenticationForm


class LoginForm(AuthenticationForm):
    def __init__(self, *args, **kwargs):
        super(LoginForm, self).__init__(*args, **kwargs)
        self.fields['username'].widget.attrs = {"class": "form-control", 'placeholder': "Username"}
        self.fields['username'].label = ''

        self.fields['password'].widget.attrs = {"class": "form-control", 'placeholder': "Password"}
        self.fields['password'].label = ''
        

