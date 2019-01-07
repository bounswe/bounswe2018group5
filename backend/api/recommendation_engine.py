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
        try:
            if str(project.owner.id) == user['user_id']:
                continue
            match_score = 0.0
            for project_tag in project.tags:
                for user_tag in user['tags']:
                    try:
                        tag1 = project_tag.wikidata_id
                        tag2 = user_tag
                        if Rel(tag1, tag2) in tag_relations_mem:
                            match_score += tag_relations_mem[Rel(tag1, tag2)]
                        elif Rel(tag2, tag1) in tag_relations_mem:
                            match_score += tag_relations_mem[Rel(tag2, tag1)]
                        else:
                            match_score += 0
                    except Exception:
                        pass
            temp.append([match_score, user['user_id']])
        except Exception:
            pass
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
    print("find projects")
    global users_mem
    global projects_mem
    global tag_relations_mem
    temp = []
    for project in projects_mem:
        if project['owner'] == str(user.id) or project['status'] in [-1, 1, 2]:
            continue
        match_score = 0.0
        for project_tag in project['tags']:
            for user_tag in user.tags:
                try:
                    tag1 = project_tag
                    tag2 = user_tag.wikidata_id
                    if Rel(tag1, tag2) in tag_relations_mem:
                        match_score += tag_relations_mem[Rel(tag1, tag2)]
                    elif Rel(tag2, tag1) in tag_relations_mem:
                        match_score += tag_relations_mem[Rel(tag2, tag1)]
                    else:
                        match_score += 0
                except Exception:
                    print("wikidata_id error")
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
    print("initialize memory")
    users_mem = []
    projects_mem = []
    tag_relations_mem = {}
    for user in User.objects:
        tags = []
        for tag in user.tags:
            try:
                tags.append(tag.wikidata_id)
            except Exception:
                print("tag error")
        users_mem.append({
            "user_id": str(user.id),
            "tags": tags
        })
    print("users complete")
    for project in Project.objects:
        tags = []
        for tag in project.tags:
            try:
                tags.append(tag.wikidata_id)
            except Exception:
                print("tag error")
        try:
            projects_mem.append({
                "project_id": str(project.id),
                "tags": tags,
                "owner": str(project.owner.id),
                "status": project.status
            })
        except Exception:
            print("owner exception")
    print("projects complete")
    for relation in TagRelation.objects:
        # print("relation:" + str(relation.id))
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


def memory_fixer(tagged, new_tag):
    print("memory fixer")
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
                try:
                    user.tags.append(tag.wikidata_id)
                except Exception:
                    print("tag error")
            break
    for project in projects_mem:
        if project.project_id == str(tagged.id):
            project.tags = []
            for tag in tagged.tags:
                try:
                    project.tags.append(tag.wikidata_id)
                except Exception:
                    print("tag error")
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
    if len(users_mem) == 0 or len(projects_mem) == 0 or not tag_relations_mem:
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
