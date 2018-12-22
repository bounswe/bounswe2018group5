from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from nltk.corpus import wordnet
import nltk
import json
import requests
import string

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


def get_distance(new_tag, other_tag):
    lemmer = nltk.stem.WordNetLemmatizer()
    documents = [new_tag.description, new_tag.label, other_tag.description, other_tag.label]

    def LemTokens(tokens):
        return [lemmer.lemmatize(token) for token in tokens]

    remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)

    def LemNormalize(text):
        return LemTokens(nltk.word_tokenize(text.lower().translate(remove_punct_dict)))

    from sklearn.feature_extraction.text import CountVectorizer
    LemVectorizer = CountVectorizer(tokenizer=LemNormalize, stop_words='english')
    LemVectorizer.fit_transform(documents)
    tf_matrix = LemVectorizer.transform(documents).toarray()
    from sklearn.feature_extraction.text import TfidfTransformer
    tfidfTran = TfidfTransformer(norm="l2")
    tfidfTran.fit(tf_matrix)
    import math
    def idf(n, df):
        result = math.log((n + 1.0) / (df + 1.0)) + 1
        return result

    tfidf_matrix = tfidfTran.transform(tf_matrix)
    cos_similarity_matrix = (tfidf_matrix * tfidf_matrix.T).toarray()
    print(cos_similarity_matrix)
    res = 0
    for i in range(0, 1):
        for j in range(2, 3):
            res = max(cos_similarity_matrix[i][j], res)
    return res


def calculate_similarities(new_tag):
    for other_tag in SemanticTag.objects:
        if other_tag.wikidata_id != new_tag.wikidata_id:
            new_relation = TagRelation()
            new_relation.tag1 = other_tag
            new_relation.tag2 = new_tag
            new_relation.value = get_distance(new_tag, other_tag)
            new_relation.save()


def create_tag(tag):
    if not SemanticTag.objects(wikidata_id=tag):
        new_tag = SemanticTag()
        response = wikidata_query(tag)
        new_tag.wikidata_id = response[0]['wikidata_id']
        new_tag.label = response[0]['label'].lower().strip().replace(" ", "")
        new_tag.description = response[0]['description']
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
