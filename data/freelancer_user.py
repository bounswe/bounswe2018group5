import requests
from lxml import html
import time
import json
import re

users = []
wikidata_tags = {}

i = 1

if not os.path.exists('./profile_pics/'):
    os.makedirs("./profile_pics/")

def user_parser(url):
    # url = "https://www.freelancer.com/projects/mobile-phone/ringtone-maker/"
    print('parsing the url:',url)
    pageContent=requests.get(
         url
    )
    tree = html.fromstring(pageContent.content)

    username_source = tree.xpath(
        '//*[@class="profile-user-name"]'
    )

    if len(username_source) == 0:
        return {}

    username = username_source[0].text
    username = re.sub('[^a-zA-Z0-9]', '', username)

    full_name_source = tree.xpath(
        '//*[@class="profile-intro-username"]'
    )

    full_name = full_name_source[0].text.lstrip().rstrip()

    bio_source = tree.xpath(
        '//*[@class="profile-user-byline"]'
    )

    bio = bio_source[0].text.lstrip().rstrip()

    pp_source = tree.xpath(
        '//*[@class="profile-image-ImageThumbnail-image ImageThumbnail-image"]/@src'
    )

    pp_url = "https:" + pp_source[0]

    try:
        imgData = urlopen(pp_url).read()
        output = open('./profile_pics/' + username + '.png','wb')
        output.write(imgData)
        output.close()
        print("Profile picture for " + username + " downloaded")
    except Exception as e:
        print(e)

    tags_source = tree.xpath(
        '//*[@id="skills"]/li/span[1]/a'
    )

    tags_raw = [t.text.lstrip().rstrip() for t in tags_source][:5]
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

    res = {
        'username': username,
        'email': username + '@karpuz.ml',
        'full_name': full_name,
        'bio': bio,
        'tags': tags,
        'tags_raw': tags_raw,
        'password': 'karpuz123'
    }

    return res



def url_parser(url_to_parse):
    print('parsing the url:',url_to_parse)
    global users
    global i
    pageContent=requests.get(
         url_to_parse
    )
    tree = html.fromstring(pageContent.content)

    urls = tree.xpath(
        '//*[@id="freelancer_list"]/li/div/div[1]/h3/a'
    )


    for url in urls:
        url = 'https://www.freelancer.com' + str(url.xpath('./@href')[0])
        if '/u/' in url:
            user = user_parser(url)
            if user != {}:
                users.append(user)
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

# url_parser("https://www.freelancer.com/freelancers/skills/all/")

urls = ['https://www.freelancer.com/freelancers/skills/all/' + str(j) for j in range(15)]
for u in urls:
    url_parser(u)

# print(kuran)

# job_parser()

with open('users.json', 'w') as outfile:
    json.dump(users, outfile)
    print('users.json - created')
