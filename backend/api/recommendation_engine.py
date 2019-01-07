from django.views.decorators.csrf import csrf_exempt
from user import authentication
from django.http import JsonResponse
from . import utils
from user.models import *
from collections import namedtuple
from project.models import *

users_mem = []
projects_mem = []
Rel = namedtuple("tag_relation", ["tag1", "tag2"])
tag_relations_mem = {}


def find_freelancers(project):
    global users_mem
    global projects_mem
    global tag_relations_mem
    temp = []
    for user in users_mem:
        if str(project.owner.id) == user['user_id']:
            continue
        match_score = 0.0
        for project_tag in project.tags:
            for user_tag in user['tags']:
                tag1 = project_tag.wikidata_id
                tag2 = user_tag
                if Rel(tag1, tag2) in tag_relations_mem:
                    match_score += tag_relations_mem[Rel(tag1, tag2)]
                elif Rel(tag2, tag1) in tag_relations_mem:
                    match_score += tag_relations_mem[Rel(tag2, tag1)]
                else:
                    match_score += 0
        temp.append([match_score, user['user_id']])
    temp.sort(key=lambda tup: tup[0])
    temp.reverse()
    if len(temp) == 0:
        return temp
    temp = temp[:6]
    ret = []
    for score, user in temp:
        ret.append(utils.user_json(User.objects.get(id=user)))
    return ret


def find_projects(user, requester):
    global users_mem
    global projects_mem
    global tag_relations_mem
    temp = []
    for project in projects_mem:
        if project['project_id'] == str(user.id) or project['status'] in [-1, 1, 2]:
            continue
        match_score = 0.0
        for project_tag in project['tags']:
            for user_tag in user.tags:
                tag1 = project_tag
                tag2 = user_tag.wikidata_id
                if Rel(tag1, tag2) in tag_relations_mem:
                    match_score += tag_relations_mem[Rel(tag1, tag2)]
                elif Rel(tag2, tag1) in tag_relations_mem:
                    match_score += tag_relations_mem[Rel(tag2, tag1)]
                else:
                    match_score += 0
        temp.append([match_score, project['project_id']])
    temp.sort(key=lambda tup: tup[0])
    temp.reverse()
    if len(temp) == 0:
        return temp
    temp = temp[:6]
    ret = []
    for score, project in temp:
        ret.append(utils.project_json(Project.objects.get(id=project), requester))
    return ret


def initialize_memory():
    global users_mem
    global projects_mem
    global tag_relations_mem
    for user in User.objects:
        tags = []
        for tag in user.tags:
            tags.append(tag.wikidata_id)
        users_mem.append({
            "user_id": str(user.id),
            "tags": tags
        })
    for project in Project.objects:
        tags = []
        for tag in project.tags:
            tags.append(tag.wikidata_id)
        projects_mem.append({
            "project_id": str(project.id),
            "tags": tags,
            "owner": str(project.owner.id),
            "status": project.status
        })
    for relation in TagRelation.objects:
        id1 = str(relation.tag1.wikidata_id)
        id2 = str(relation.tag2.wikidata_id)
        if id2 < id1:
            temp = id2
            id2 = id1
            id1 = temp
        tag_relations_mem[Rel(id1, id2)] = relation.value


def memory_fixer(tagged, new_tag):
    global users_mem
    global projects_mem
    global tag_relations_mem
    if new_tag:
        tag_relations_mem = {}
        for relation in TagRelation.objects:
            id1 = str(relation.tag1.wikidata_id)
            id2 = str(relation.tag2.wikidata_id)
            if id2 < id1:
                temp = id2
                id2 = id1
                id1 = temp
            tag_relations_mem[Rel(id1, id2)] = relation.value
    for user in users_mem:
        if user.user_id == str(tagged.id):
            user.tags = []
            for tag in tagged.tags:
                user.tags.append(tag.wikidata_id)
            break
    for project in projects_mem:
        if project.project_id == str(tagged.id):
            project.tags = []
            for tag in tagged.tags:
                project.tags.append(tag.wikidata_id)
            break


@csrf_exempt
def recommend(request):
    global users_mem
    global projects_mem
    global tag_relations_mem
    token = request.META.get('HTTP_AUTHORIZATION', None)
    if not (token and authentication.is_authenticated(token)):
        return JsonResponse({
            "response": False,
            "error": "Unauthorized"
        })
    if len(users_mem) or len(projects_mem) or not tag_relations_mem:
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
