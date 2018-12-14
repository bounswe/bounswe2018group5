from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import requests

from user import authentication
from . import utils
from user.models import *
from project.models import *


def wikidata_query(key):
    address = "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=" + key + "&language=en&format=json"
    contents = requests.get(address).json()
    # print(contents)
    ret = []
    for res in contents['search']:
        if 'id' in res and 'label' in res and 'description' in res:
            ret.append({"wikidata_id": str(res['id']),
                        "label": str(res['label']),
                        "description": str(res['description'])
                        })
    return ret


def reunion(user):
    portfolios = Portfolio.objects(user=user)
    user.tags = []
    user.save()
    for portfolio in portfolios:
        for tag in portfolio.tags:
            user.update(add_to_set__tags=tag)


def create_tag(tag):
    if not SemanticTag.objects(wikidata_id=tag):
        new_tag = SemanticTag()
        response = wikidata_query(tag)
        new_tag.wikidata_id = response[0]['wikidata_id']
        new_tag.label = response[0]['label']
        new_tag.description = response[0]['description']
        new_tag.save()
        # TODO: calculate similarities with other tags


@csrf_exempt
def tag_handler(request):
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if not (token and authentication.is_authenticated(token)):
        return JsonResponse({
            "response": False,
            "error": "Unauthorized"
        })
    tagged = request.GET.get('id', None)
    is_portfolio = False
    if tagged and Portfolio.objects(id=tagged):
        tagged = Portfolio.objects.get(id=tagged)
        is_portfolio = True
    elif tagged and Project.objects(id=tagged):
        tagged = Project.objects.get(id=tagged)
    else:
        tagged = None
    tag = request.GET.get('wikidata_id', None)
    if request.method == 'GET':
        try:
            body = json.loads(request.body.decode('utf-8'))
            ret = {}
            for key in body['keys']:
                ret[str(key)] = wikidata_query(key)
        except Exception as e:
            return JsonResponse({"response": False, "error": str(e)})
        return JsonResponse({
            "response": True,
            "search": ret
        })
    elif request.method == 'POST':
        if not tag or not tagged:
            return JsonResponse({
                "response": False,
                "error": "id or tag is missing"
            })
        try:
            tag = str(tag)
            create_tag(tag)
            tagged.update(add_to_set__tags=SemanticTag.objects.get(wikidata_id=tag))
            if is_portfolio:
                tagged.user.update(add_to_set__tags=SemanticTag.objects.get(wikidata_id=tag))
        except Exception as e:
            return JsonResponse({"response": False, "error": str(e)})
        return JsonResponse({"response": True})
    elif request.method == 'DELETE':
        try:
            tag = str(tag)
            tagged.update(pull__tags=SemanticTag.objects.get(wikidata_id=tag))
            if is_portfolio:
                reunion(tagged.user)
        except Exception as e:
            return JsonResponse({"response": False, "error": str(e)})
        return JsonResponse({"response": True})
    else:
        return JsonResponse({
            "response": False,
            "error": "wrong request method"
        })
