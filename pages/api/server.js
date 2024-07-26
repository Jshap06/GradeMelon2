const path = require('path');
const bodyParser = require('body-parser');
const { stringify } = require('querystring');
const axios = require('axios').default;
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const FormData = require('form-data');
const cheerio = require('cheerio');
const flatted = require('flatted');



async function getStudentPhoto(details){
    console.log(details)
    return new Promise(async(res,rej)=>{
        await axios.get(details.domain+"/"+details.url,{headers:{
            "Referer":details.domain+"/PXP2_Documents.aspx?AGU=0","Cookie":details.cookies},responseType: 'arraybuffer' })
            .then(file=>{
                console.log("YIPEE")
                console.log("Content-Type:", file.headers['content-type']);
                res(file.data)

            })
            .catch(error=>{
                console.log("oh no")
                if(error.message.includes("403")){rej(new Error("Link/Authentication Expired"))}
                if(error.message.includes("hung up")||error.message.includes("ENOTFOUND")){rej(new Error("Network Error: Try Again Shortly"))}
                console.error(error.message);
                rej(error);
            })
    })
}




async function getStudentInfo(details){
    return new Promise(async(res,rej)=>{
        details.headers.Cookie=details.cookies;
        console.log("print debug")
        console.log(details.headers)
        await axios.get(details.domain+"/"+"PXP2_Student.aspx?AGU=0",{'headers':details.headers})
            .then(page=>{
                console.log("type shit")
                res(page.data)
            })
            .catch(error=>{
                if(error.message.includes("hung up")||error.message.includes("ENOTFOUND")){rej(new Error("Network Error: Try Again Shortly"))}
                console.error(error)
                rej(error)
            })
    })
}




async function getDocument(details){
    console.log(details)
    return new Promise(async(res,rej)=>{
        await axios.get(details.domain+"/"+details.url,{headers:{"Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-User": "?1",
            "Sec-Fetch-Dest": "document",
            "Referer":details.domain+"/PXP2_Documents.aspx?AGU=0","Cookie":details.cookies},responseType: 'arraybuffer' })
            .then(file=>{
                console.log("YIPEE")
                console.log("Content-Type:", file.headers['content-type']);
                if(file.headers['content-type']=="application/pdf"){
                res(file.data);}else{rej(new Error("Unknown Error"))}

            })
            .catch(error=>{
                console.log("oh no")
                if(error.message.includes("403")){rej(new Error("Link/Authentication Expired"))}
                if(error.message.includes("hung up")||error.message.includes("ENOTFOUND")){rej(new Error("Network Error: Try Again Shortly"))}
                console.error(error.message);
                rej(error);
            })
    })
}

async function getDocuments(details){
    return new Promise(async(res,rej)=>{
        try{
        const url = details.domain+"/PXP2_Documents.aspx?AGU=0";
        await axios.get(url,{headers:{"Cookie":details.cookies}})
            .then(response=>{
                if(response.data.includes("ParentVUE and StudentVUE Access")){rej(new Error("Authentication Cookies Expired"))};
                res(response.data);
                            })
            .catch(err=>{
                if(err.message.includes("hung up")||err.message.includes("ENOTFOUND")){rej(new Error("Network Error: Try Again Shortly"))}
            console.log(err)
            rej(err)})


    }
    catch(error){
    console.log("okay now I'm confused")
    rej(error)}
    })

}


async function logIn(details,session) {
    return new Promise(async (res, rej)=>{
    const url = details.domain+"/PXP2_Login_Student.aspx?regenerateSessionId=True";
    const data = new FormData();
    data.append('__VIEWSTATE', 'xSUJwarOjTQE7CskHQblb19ssBCBpUW+5tfdNDuD3IcYmgxmrAGdCkRQBXImdT8UDBRZUWGKh1WbTZ5Sjneh/pHvZfC9OS9G/dvguNcLVQQ=');
    data.append('__EVENTVALIDATION', 'MuxKAkL0uqFFwLLJFLrjlv9DhfP/xcGj5sOrlMYih54BCkfxr2cabxYxCi4hecln+T2qPKNaTFbQWvZzISA0REDWrFIt/4YxP7E7ZdNiop+fTihWPxDD81Brd70gdCgpKWeQp7cfRdrkvCZULYF4ZcMI330jEDOCyKbmjCTImRA=');
    data.append('ctl00$MainContent$username', details.credentials.username);
    data.append('ctl00$MainContent$password', details.credentials.password);
    data.append('ctl00$MainContent$Submit1', 'Login');
    
    const headers = {
        'Origin': details.domain,
        'Referer': details.domain + '/PXP2_Login_Student.aspx?Logout=1&regenerateSessionId=True',
        ...(details.cookies && { 'Cookie': details.cookies })
    };
    

        await session.post(url, data, { headers })
            .then(login =>{
        console.log(login.status);
        console.log(login.statusText);
        if (login.data.includes("Good")){
            console.log("Logged in");
            res();
        } else {
        rej(new Error("Incorrect Username or Password"))
        };}).catch(err=>{if(err.message.includes("hung up")||err.message.includes("ENOTFOUND")){rej(new Error("Network Error: Try Again Shortly"))}})

})}

//the KEY to maintaing decent workability is when u refresh the auth cookies, try to just reauthenticate the same session rather than spawning new cookies. should prob replace them while true loops in client with like a 3 count, and tell it to regen cookies after 3 consecutive failures
async function refresh(details){
    return new Promise(async (res, rej)=>{
   const cookieJar = new tough.CookieJar();
    const session = await wrapper(axios.create({
          withCredentials: true,
          jar: cookieJar
      }));
      await logIn(details,session)
        .then(res1=>{
            cookieJar.getCookies(details.domain, (err, cookies) => {
                  cookies="PVUE=ENG; "+cookies[0].key+"="+cookies[0].value + "; " + cookies[2].key + "="+cookies[2].value+";";
                  console.log("fuck me sideways")
                  console.log(cookies)
                res(cookies);
              });
        })
        .catch(rej1=>{
            if (rej1.message.includes("key")){res(details.cookies)}else{
                if(rej1.message.includes("hung up")||rej1.message.includes("ENOTFOUND")){rej(new Error("Network Error: Try Again Shortly"))}else{
            rej(rej1)}}})

})}

async function getHomePageGrades(details) {
    return new Promise(async (res, rej)=>{
    const url = details.domain+'/api/GB/ClientSideData/Transfer?action=genericdata.classdata-GetClassData';
    const data = new URLSearchParams({
        'FriendlyName': 'genericdata.classdata',
        'Method': 'GetClassData',
        'Parameters': '{}'
    });
    const headers = {
        'Origin': this.domain,
        'Referer': this.domain+'/PXP2_GradeBook.aspx?AGU=0'
    };

        await session.get(details.domain+"/PXP2_GradeBook.aspx?AGU=0")
        .then(response=>res(response))
        .catch(error=>rej(new Error(error)))
        //const response = await session.post(url, data, { headers });

})};

async function getAssignments(details){
    return new Promise(async (res, rej)=>{
        try{
        await session.post(details.url2,details.senddata,{headers:details.headers2})
        const response2= await this.session.post(details.url, details.data,{headers:details.headers});
        const response3= await this.session.post(details.url3,details.data3,{headers:details.headers})}
        catch(error){rej(error)}
        // response = await session.post(url, data, { headers });
        res([response3.data, response2.data]);

    })};



export default async function handler(req, res) {
    if (req.method === 'POST') {
        if(req.body.func=="refresh"){
        await refresh(req.body)
    .then(res1=>{res.json({status:true,cookies:res1});}).catch(error=>{
    res.status(200).json({status:false,message:error.message})})}
    if(req.body.func=="login"){
        await logIn(req.body)
    .then(res1=>{res.json({status:true});}).catch(error=>{
    res.status(200).json({status:false,message:error.message})})}
    if(req.body.func=="getAssignments"){
        await getAssignments(req.body)
    .then(res1=>{res.json({status:true,assignments:res1});}).catch(error=>{
    res.status(200).json({status:false,message:error.message})})}
    if(req.body.func=="getHomePageGrades"){
        await getHomePageGrades(req.body)
    .then(res1=>{res.json({status:true,grades:res1});}).catch(error=>{
    res.status(200).json({status:false,message:error.message})})}
    if(req.body.func=="getDoc"){
        await getDocument(req.body)
    .then(res1=>{
    console.log(Object.keys(res1))
    res.json({status:true,doc:res1});}).catch(error=>{
    res.status(200).json({status:false,message:error.message})})}
    if(req.body.func=="getDocs"){
        await getDocuments(req.body)
    .then(res1=>{res.json({status:true,doc:res1});}).catch(error=>{
    res.json({status:false,message:error.message})})}
    if(req.body.func=="getStudentInfo"){
        await getStudentInfo(req.body)
    .then(res1=>{res.json({status:true,info:res1});}).catch(error=>{
    res.json({status:false,message:error.message})})}
    if(req.body.func=="getStudentPhoto"){
        await getStudentPhoto(req.body)
    .then(res1=>{res.json({status:true,photo:res1});}).catch(error=>{
    res.json({status:false,message:error.message})})}


}else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
