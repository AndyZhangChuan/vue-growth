# vue-growth
vue log components

## Installation

```shell
    npm install --save vue-growth
```


## Usage

### Step.1 install from your entry js

```javascript
   import growth from 'vue-growth'
   
   growth.setOptions({
        
          CUSTOM_ROUTER_LOG_PARAMS: ['product_id'],
   
          LOG_SUBMIT_URL: '/[host]/api/log',
   
          LAZY_ROUTERS: ['product_detail'],
   
          PROJECT_NAME: 'my_project'
   
   })
   
   Vue.use(growth)
 ```
   
   
### Step.2 setUserId
```javascript
   import growth from 'vue-growth'
   growth.setUserId(123);

```

```

#### Options Declaration

 + CUSTOM_FIELDS: Array: router query params, if custom this field, the engine will read the query param in you project url
   - e.g 
      * CUSTOM_FIELDS: ['project_id']
      * the engine will read 'product_id' in your project url: /[HOST]/test#/api?product_id=1" and submit it
      
 + LOG_SUBMIT_URL: String: LOG SUBMIT URL(custome a post api which receive the buried point data)
 
 + LAZY_ROUTERS: Array: router name array: if customer this filed, the engine would not auto commit the buried data whose router name contains in this filed, you should manually commit the data by using method
 growth.commitTransaction()  
 
 + PROJECT_NAME: this field is using as the unique identifier in your fields of buried point data


### Step.3 Bind to router

```javascript
   import VueRouter from 'vue-router'
   import growth from 'vue-growth'
    
   const router = new VueRouter({
            
   
   })
    
   export default growth.track(router)

```


### Methods

``` 
     // commit the page log
     growth.commitTransaction()  
     
     //set custom page info
     growth.setPagePrivateData(data)
     
     
     // commit custom action log
     growth.addActionLog(logKey, logData)
     
     // add sign code
     growth.pushSignCode(code)
     
     // set custom public data
     growth.setCustomPublicData({user_name: 'Mike'})

     
```

### DATA Structure


## Technology Stack
- Vue 2.0
- Webpack
- ES6

## License
MIT © Andy

