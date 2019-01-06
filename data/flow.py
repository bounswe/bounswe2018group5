import json
from datetime import date, timedelta
import random
import time
from numpy.random import multinomial
import requests

register_url = "https://api.karpuz.ml/api/user/auth/register"
login_url = "https://api.karpuz.ml/api/user/auth/login"
profile_url = "https://api.karpuz.ml/api/user/profile/"
pp_url = "https://api.karpuz.ml/api/user/profile/upload_image/"
portfolio_url = "https://api.karpuz.ml/api/user/portfolio/"
project_url = "https://api.karpuz.ml/api/project/"

with open('./users.json', 'r') as f:
    users = json.load(f)

with open('./jobs_with_date.json', 'r') as f:
    projects = json.load(f)

project_count_for_user = multinomial(375, [1/130.] * 130)
user_count = 0
project_count = 25

for user in users[10:]:
    # REGISTER
    data = {
                "username":     user['username'],
                "password":     user['password'],
                "full_name":    user['full_name'],
                "email":        user['email']
            }
    # print(requests.post(register_url,data=json.dumps(data)).json())
    try:
        response = requests.post(register_url,data=json.dumps(data)).json()
        if response['response'] == True:
            token = response['api_token']
            print( "[SUCCESS] Register Succeeded for user: " + user['username'] )
        elif 'duplicate unique keys' in response['error']:
            data =  {
                        "username": user['username'],
                        "password": user['password']
                    }
            response = requests.post(login_url, data=json.dumps(data)).json()
            if response['response'] == True:
                token = response['api_token']
                print( "[SUCCESS] Login Succeeded for user: " + user['username'] )
            else:
                print( "[FAIL] Login Failed for user: " + user['username'] )
        else:
            print( "[FAIL] Register Failed for user: " + user['username'] )
            continue    # Do not proceed if register fails
    except Exception as e:
        print( "[ERROR] Register Exception: ", e )
        continue    # Do not proceed if register fails

    headers =   {
                    "Authorization": token
                }

    # PROFILE - For user bio
    data =  {
                "bio":      user['bio']
            }
    try:
        response = requests.put(profile_url, data=json.dumps(data), headers=headers).json()
        if response['response'] == True:
            print( "[SUCCESS] Profile Update for bio succeeded for user: " + user['username'] )
        else:
            print( "[FAIL] Profile Update for bio failed for user: " + user['username'] )
            print( "Continuing process" )
    except Exception as e:
        print( "[ERROR] Profile Exception: ", e )

    # PROFILE PICTURE - For user pp
    files =  {
                "profile_image":      open("./profile_pics/" + user['username'] + ".png",'rb')
            }
    try:
        response = requests.post(pp_url, files=files, headers=headers).json()
        if response['response'] == True:
            print( "[SUCCESS] Profile Update for bio succeeded for user: " + user['username'] )
        else:
            print( "[FAIL] Profile Update for bio failed for user: " + user['username'] )
            print( "Continuing process" )
    except Exception as e:
        print( "[ERROR] Profile Exception: ", e )

    # PORTFOLIO - For user tags
    print( str(user_count) + "- Creating the portfolio for user: " + user['username'] )
    time.sleep(30)
    data =  {
                "title":        "Freelancer at freelancer.com",
                "description":  "My profile is parsed from freelancer.com. You can search the same username in freelancer.com to contact me.",
                "date":         str( date.today()+timedelta(days=random.randint(-180,-1)) ),
                "tags":         user['tags']
            }
    try:
        response = requests.post(portfolio_url, data=json.dumps(data), headers=headers).json()
        # print(response)
        if response['response'] == True:
            print( "[SUCCESS] Portfolio created for tags for user: " + user['username'] )
        else:
            print( "[FAIL] Portfolio creation failed for tags for user: " + user['username'] )
            print( "Continuing process" )
    except Exception as e:
        print( "[ERROR] Portfolio Exception: ", e )

    # PROJECTs - Users will have multiple projects with number of 2-4
    project_num = project_count_for_user[user_count]
    user_count += 1
    for i in range(project_num):
        project = projects[project_count]
        project_count += 1

        print( str(project_count-1) + "- Creating the project: " + project['title'][:50] )
        time.sleep(30)
        data =  {
                    "title":            project['title'][:50],
                    "description":      project['description'][:2000],
                    "budget":           float(project['budget']),
                    "project_deadline": project['project_deadline'],
                    "tags":             project['tags']
                }
        try:
            response = requests.post(project_url, data=json.dumps(data), headers=headers).json()
            if response['response'] == True:
                print( "[SUCCESS] Project created for user: " + user['username'] + " named as: " + project['title'] )
            else:
                print( "[FAIL] Project creation failed for user: " + user['username'] + " named as: " + project['title'] )
                print( "Continuing process" )
        except Exception as e:
            print( "[ERROR] Project Exception: ", e )
            print( "Continuing process" )
