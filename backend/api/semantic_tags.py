from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import requests
import string

from user import authentication
from . import utils
from user.models import *
from project.models import *
from difflib import SequenceMatcher


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


def get_distance(new_tag, other_tag):
    match_score = 0.0
    if new_tag.wikidata_id == other_tag.wikidata_id:
        return 100.0
    for element, weight in new_tag.relations:
        if SequenceMatcher(None, other_tag.label, element).ratio() > 0.8:
            match_score += weight
    for element, weight in other_tag.relations:
        if SequenceMatcher(None, new_tag.label, element).ratio() > 0.8:
            match_score += weight
    for element1, weight1 in new_tag.relations:
        for element2, weight2 in other_tag.relations:
            if SequenceMatcher(None, element1, element2).ratio() > 0.8:
                match_score += min(weight1, weight2)
    if SequenceMatcher(None, new_tag.label, other_tag.label).ratio() > 0.8:
        match_score += 50
    return match_score


def calculate_similarities(new_tag):
    for other_tag in SemanticTag.objects:
        new_relation = TagRelation()
        new_relation.tag1 = other_tag
        new_relation.tag2 = new_tag
        new_relation.value = get_distance(new_tag, other_tag)
        new_relation.save()


def create_tag(tag):
    if SemanticTag.objects(wikidata_id=tag):
        return
    new_tag = SemanticTag()
    response = wikidata_query(tag)
    new_tag.wikidata_id = response[0]['wikidata_id']
    new_tag.label = response[0]['label'].lower().strip().replace(" ", "_")
    new_tag.description = response[0]['description']
    response = requests.get('http://api.conceptnet.io/related/c/en/' + new_tag.label + '?filter=/c/en&limit=1000')
    obj = response.json()
    for element in obj['related']:
        related = element['@id'].rsplit('/')[-1]
        new_tag.relations.append((related, element['weight']))
    new_tag.save()
    calculate_similarities(new_tag)


@csrf_exempt
def tag_handler(request):
    # token = request.META.get('HTTP_AUTHORIZATION', None)
    # if not (token and authentication.is_authenticated(token)):
    #     return JsonResponse({
    #         "response": False,
    #         "error": "Unauthorized"
    #     })
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
