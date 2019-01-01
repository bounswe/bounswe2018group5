from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from user import authentication, models, views
from datetime import datetime
from api.utils import *
from api.semantic_tags import create_tag
from django.db.models import Q

import json
from .models import *
from user.models import *


@csrf_exempt
def annotation_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if request.method == 'GET':
        try:
            query = request.GET.get('query')
            annotations = Annotation.objects.filter(annotation_object__target__IRI=query)
            return JsonResponse({"response": True, "annotations": annotations})
        except Exception as e:
            return JsonResponse({'response': False, 'error': str(e)})
    elif request.method == 'POST':
        if token and authentication.is_authenticated(token):
            try:
                user_id = authentication.get_user_id(token)
                request_data = json.loads(request.body.decode('utf-8'))
                targets = []
                if 'targets' in request_data:
                    targets = request_data['targets']
                body = request_data['body'] if 'body' in request_data else None
                annotation = Annotation()
                annotation.context = request_data['context']
                annotation.IRI = request_data['id']
                annotation.motivation = request_data['motivation']
                annotation.creator = request_data['creator']
                annotation.save()

                if body:
                    body_annotation = Annotation.objects.filter(IRI=request_data['id'])
                    new_body = Body()
                    new_body.annotation = body_annotation
                    new_body.IRI = body['IRI']
                    new_body.type = body['type']
                    new_body.text = body['text']
                    new_body.save()

                if len(targets) > 0:
                    target_annotation = Annotation.objects.filter(IRI=request_data['id'])
                    for target in targets:
                        target = Target()
                        target.annotation = target_annotation
                        target.context = target['context']
                        target.type = target['type']
                        target.IRI = target['IRI']
                        target.x = target['x']
                        target.y = target['y']
                        target.start = target['start']
                        target.end = target['end']
                        target.save()

                return JsonResponse({"response": True, "annotation": annotation.annotation_object})
            except Exception as e:
                return JsonResponse({'response': False, 'error': str(e)})
        else:
            return JsonResponse({"response": False, "error": "Unauthorized"})
