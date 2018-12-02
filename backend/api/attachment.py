import os

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

from user import authentication
from . import utils
from user.models import *
from project.models import *


@csrf_exempt
def attachment_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if not(token and authentication.is_authenticated(token)):
        return JsonResponse({
            "response": False,
            "error": "Unauthorized"
        })
    attach_to = request.GET.get('id', authentication.get_user_id(token))
    if Portfolio.objects(id=attach_to):
        attached = Portfolio.objects.get(id=attach_to)
    elif Project.objects(id=attach_to):
        attached = Project.objects.get(id=attach_to)
    elif Milestone.objects(id=attach_to):
        attached = Milestone.objects.get(id=attach_to)
    else:
        attached = None
    if request.method == 'POST':
        try:
            for file in request.FILES:
                utils.handle_uploaded_file('attachments/'+attach_to, request.FILES[file], str(request.FILES[file]))
                attached.attachments.append(str(request.FILES[file]))
            attached.save()
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
        return JsonResponse({'response': True})
    elif request.method == 'DELETE':
        try:
            delete_this=request.GET.get('file_name', None)
            if delete_this:
                attached.attachments.remove(str(delete_this))
                os.remove('media/attachments/'+attach_to+'/'+delete_this)
                attached.save()
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
        return JsonResponse({'response': True})
    else:
        return JsonResponse({
            "response": False,
            "error": "Wrong request method"
        })
