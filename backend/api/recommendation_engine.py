from django.views.decorators.csrf import csrf_exempt
from user import authentication
from django.http import JsonResponse
from . import utils
from user.models import *
from collections import namedtuple
from project.models import *


Rel = namedtuple("tag_relation", ["tag1", "tag2"])
tag_relations_mem = {}


def find_freelancers(project):
    global tag_relations_mem
    temp = []
    for user in User.objects:
        try:
            if project.owner == user:
                continue
            match_score = 0.0
            for project_tag in project.tags:
                for user_tag in user.tags:
                    try:
                        tag1 = project_tag.wikidata_id
                        tag2 = user_tag.wikidata_id
                        if Rel(tag1, tag2) in tag_relations_mem:
                            match_score += tag_relations_mem[Rel(tag1, tag2)]
                        elif Rel(tag2, tag1) in tag_relations_mem:
                            match_score += tag_relations_mem[Rel(tag2, tag1)]
                        else:
                            match_score += 0
                    except Exception:
                        pass
            temp.append([match_score, user])
        except Exception:
            pass
    temp.sort(key=lambda tup: tup[0])
    temp.reverse()
    if len(temp) == 0:
        return temp
    temp = temp[:6]
    ret = []
    for score, user in temp:
        ret.append(utils.user_json(user))
    return ret


def find_projects(user, requester):
    print("find projects")
    global tag_relations_mem
    temp = []
    for project in Project.objects:
        if project.owner == user or project.status in [-1, 1, 2]:
            continue
        match_score = 0.0
        for project_tag in project.tags:
            for user_tag in user.tags:
                try:
                    tag1 = project_tag.wikidata_id
                    tag2 = user_tag.wikidata_id
                    if Rel(tag1, tag2) in tag_relations_mem:
                        match_score += tag_relations_mem[Rel(tag1, tag2)]
                    elif Rel(tag2, tag1) in tag_relations_mem:
                        match_score += tag_relations_mem[Rel(tag2, tag1)]
                    else:
                        match_score += 0
                except Exception:
                    print("wikidata_id error")
        temp.append([match_score, project])
    temp.sort(key=lambda tup: tup[0])
    temp.reverse()
    if len(temp) == 0:
        return temp
    temp = temp[:6]
    ret = []
    for score, project in temp:
        ret.append(utils.project_json(project, requester))
    return ret


def initialize_memory():
    global tag_relations_mem
    tag_relations_mem = {}
    for relation in TagRelation.objects:
        try:
            id1 = str(relation.tag1.wikidata_id)
            id2 = str(relation.tag2.wikidata_id)
            if id2 < id1:
                temp = id2
                id2 = id1
                id1 = temp
            tag_relations_mem[Rel(id1, id2)] = relation.value
        except Exception:
            print("relation error")


def memory_fixer():
    global tag_relations_mem
    tag_relations_mem = {}
    for relation in TagRelation.objects:
        try:
            id1 = str(relation.tag1.wikidata_id)
            id2 = str(relation.tag2.wikidata_id)
            if id2 < id1:
                temp = id2
                id2 = id1
                id1 = temp
            tag_relations_mem[Rel(id1, id2)] = relation.value
        except Exception:
            pass


@csrf_exempt
def recommend(request):
    global tag_relations_mem
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if not (token and authentication.is_authenticated(token)):
        return JsonResponse({
            "response": False,
            "error": "Unauthorized"
        })
    if not tag_relations_mem:
        initialize_memory()
    recommend_id = request.GET.get('id', None)
    if not recommend_id:
        recommend_id = authentication.get_user_id(token)
    if Project.objects(id=recommend_id):
        ret = find_freelancers(Project.objects.get(id=recommend_id))
    elif User.objects(id=recommend_id):
        ret = find_projects(User.objects.get(id=recommend_id), authentication.get_user_id(token))
    else:
        return JsonResponse({
            "response": False,
            "error": "No matching id"
        })
    return JsonResponse({
        "response": True,
        "recommendation": ret[:6]
    })
