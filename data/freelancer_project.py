import requests
from lxml import html
import time
import json
import re
from datetime import date, timedelta
import random

jobs = []
wikidata_tags = {}

i = 1

def job_parser(url):
    # url = "https://www.freelancer.com/projects/mobile-phone/ringtone-maker/"
    print('parsing the url:',url)
    pageContent=requests.get(
         url
    )
    tree = html.fromstring(pageContent.content)

    title_source = tree.xpath(
        '//*[@id="main"]/div/header/div/div/div[2]/h1'
    )

    if len(title_source) == 0:
        return {}

    title = title_source[0].text

    detail_source = tree.xpath(
        '//*[@id="main"]/div/div/div/div[1]/section/div/div[1]/div/p[2]'
    )

    detail = detail_source[0].text

    tags_source = tree.xpath(
        '//*[@class="PageProjectViewLogout-detail-tags-link--highlight"]'
    )

    tags_raw = [t.text for t in tags_source]
    tags = []

    for tag in tags_raw:
        print("Searching wikidata for: ",tag)
        if tag in wikidata_tags:
            tags.append(wikidata_tags[tag])
            print("Found in cache: ",tag,wikidata_tags[tag])
            continue
        res = get_wikidata_id(tag)
        if not res is None:
            print("Found: ",tag,res)
            wikidata_tags[tag] = res
            tags.append(res)

    budget_source = tree.xpath(
        '//*[@id="main"]/div/header/div/div/div[3]/p/text()'
    )

    try:
        budget = re.match( r'.+-(\d+)[^0-9]+', budget_source[0], re.I).group(1)
    except AttributeError:
        budget = re.match( r'[^0-9]+(\d+)[^0-9]+', budget_source[0], re.I).group(1)
    except:
        budget = 0
        print("Budget Not Found and set to 0!")

    res = {
        'title': title,
        'description': detail,
        'budget': budget,
        'tags': tags,
        'tags_raw': tags_raw,
        'project_deadline': str( date.today()+timedelta(days=random.randint(1,180)) )
    }

    return res



def url_parser(url_to_parse):
    global jobs
    global i
    pageContent=requests.get(
         url_to_parse
    )
    tree = html.fromstring(pageContent.content)

    urls = tree.xpath(
        '//*[@id="project-list"]/div/div/div[1]/div[1]/a'
    )


    for url in urls:
        url = 'https://www.freelancer.com' + str(url.xpath('./@href')[0])
        if not 'login' in url:
            job = job_parser(url)
            if job != {}:
                jobs.append(job)
                print(str(i) + '- ' + url + ' parsed succesfully')
                i += 1

def get_wikidata_id(key):
    key = re.sub('[^a-zA-Z0-9\s]', '', key)
    address = "https://www.wikidata.org/w/api.php?action=wbsearchentities&search=" + key + "&language=en&format=json"
    contents = requests.get(address).json()
    # print(contents)
    ret = []
    for res in contents['search']:
        if 'id' in res and 'label' in res and 'description' in res:
            return str(res['id'])
    return None


urls = ['https://www.freelancer.com/jobs/' + str(j) + '/?fixed=true&status=all&featured=true' for j in range(10)]
for u in urls:
    url_parser(u)

# print(kuran)

# job_parser()

with open('projects.json', 'w') as outfile:
    json.dump(jobs, outfile)
    print('projects.json - created')
