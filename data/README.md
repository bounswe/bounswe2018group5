## Sample Data

There is a mock database backup under the ``/mock/karpuzDB`` folder. You can use this with the following commands remotely from your local after deploying the project.

#### Import the data remotely
```
mongorestore 
--host <host>:<port> 
--username <username> 
--password <password> 
--authenticationDatabase admin 
--db <dbname>
<foldername>
```

In our case we did as:

```
mongorestore 
--host 104.248.249.251:27017 
--username admin 
--password ****** 
--authenticationDatabase admin 
--db karpuzDB 
./dump/karpuzDB/
```


#### Also in the future if you want to export data 
```
mongodump 
--host <host>:<port> 
--username <username> 
--password <password> 
--authenticationDatabase admin 
--db <dbname>
```

In our case we did as:

```
mongodump 
--host 104.248.249.251:27017 
--username admin 
--password ****** 
--authenticationDatabase admin 
--db karpuzDB
```

-

In one line to easy copy:

``mongorestore --host 104.248.249.251:27017 --username admin --password ****** --authenticationDatabase admin --db karpuzDB ./dump/karpuzDB/ ``

``mongodump --host 104.248.249.251:27017 --username admin --password ****** --authenticationDatabase admin --db karpuzDB``