# Gitalytics

##Description
A platform designed to catch the cheaters of the software industry. In the hiring process, employers have to vet potential candidates manually by inspecting their GitHub accounts. Because of the rapid growth of the industry, plagirism and code disguise are on the rise. With more applicants, there is increasingly more data to sort through. This is a process which can be automated to generate better data for technical and non-technical oriented employers alike to guide them in the hiring process. 

##Methodology

There are two sources of data to evaluate a programmer's potential. 

Software developers who actively contribute heavily to Open Source projects are knowledgable in the field and confident in their skills. They represent the highest caliber of developers and an analysis of their contributions provides insight into their performance on the work force. 

Within personal projects, there are collaborations where developers contribute unevenly and instances where users only change things within a template. These will be caught by analyzing the commit history.   

##Technology 

Built on node.js with a React frontend. Calls the GitHub Api.
Currently in development by a team in the University of Waterloo. 

To run: 
```
npm install 
node server.js
```
Hit endpoint localhost:8000/personal?owner={username} for personal repos and localhost:8000/publicrepo?owner={username} for open source contributions. 
