# Web Shop 
This is a web shop created in React.js and PHP. <br />
Features including admin panel, add into cart action. <br />
Welcome page:
![image](https://user-images.githubusercontent.com/74143516/111035105-cb20ab80-8453-11eb-9d37-e1053260c50c.png)
Products list separated by category:
![image](https://user-images.githubusercontent.com/74143516/111035113-da9ff480-8453-11eb-8624-e8be34f8dcab.png)
Admin panel used to update or control the database:
![image](https://user-images.githubusercontent.com/74143516/111035122-e4c1f300-8453-11eb-99dd-0eae2efb97f8.png)

Update:  
Currently constructing a login logout feature and a fully workable payment feature, enhancing security and improving users' experience.  
Having a fully functional paypal checkout function using paypal sandbox.
### !!!Login feature and session maintenace is released (admin and normal user). Security features are also enhanced(XSS, SQL injection, CSRF) !!!
### As this website is constrcuted using Amazon EC2 with limited credtis, please contact me via the gmail in my resume if you want to visit the website. Sorry for that inconvenience.  
## Update in 9/2021 (Code review)  
- should not use var anymore
- use more functional class
- States are updated too frequently and unnecessarily
- optimization could be done using useMemo...
