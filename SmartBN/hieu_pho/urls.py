from django.urls import path, include

from . import views


app_name = 'hieu_pho'
urlpatterns = [
    path('subject', include([
        path('', views.subject, name='subject'),
        path('_list', views.subject_list, name='subject_list'),
        path('_detail_<int:id>', views.subject_detail, name='subject_detail'),
    ])),

    path('teacher', include([
        path('', views.teacher, name='teacher'),
        path('_list', views.teacher_list, name='teacher_list'),
    ])),

    path('question', views.question, name='question'),
    path('exam', views.exam, name='exam'),
    path('profile', views.profile, name='profile'),
]