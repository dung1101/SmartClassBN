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

    path('question', include([
        path('', views.question, name='question'),
        path('_detail_<int:id>', views.question_detail_data, name='question_detail_data'),
        path('_detail_review_<str:cau_truc>', views.question_detail_review, name='question_detail_review'),
        path('_list', views.question_list, name='question_list'),
        path('_list_<int:id>_<str:ky_hoc>', views.question_list_option, name='question_list_option'),
        path('_list_data_<int:id>', views.question_list_data, name='question_list_data'),
    ])),

    path('exam', include([
        path('_manual', views.manual_create_exam, name='manual_create_exam'),
    ])),

    path('profile', views.profile, name='profile'),
]