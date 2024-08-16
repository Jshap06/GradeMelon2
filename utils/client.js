
//at this point i should prob make a central function for sending the fetch requests ngl this is getting messey asl

import jQuery from "jquery";
import {letterGradeColor,letterGrade,isWeighted} from "./grades";


class Client{
    constructor(credentials,domain="https://md-mcps-psv.edupoint.com"){
        this.credentials = credentials;
        this.domain=domain;
        this.parsedGrades={};
        this.cookies;
        this.documents=[];
        this.studentInfo={}

    }


    async backEnd(body){
        return new Promise(res,rej)
            res()
        //filler, should make this a central functino for all those fetch requests, will trim down the code nicely
    }

    async getStudentPhoto(url=this.studentInfo.photoSource){
        return new Promise(async(res,rej)=>{
        const headers={
                     'Origin': this.domain,
                    'Referer': this.domain+'/PXP2_GradeBook.aspx?AGU=0'
                }
        try{
        var response = await (await fetch('/api/server',{
                'method':'POST',
                'headers':{'Content-Type':'application/json'},
                'body':JSON.stringify({'url':url,'credentials':this.credentials,'headers':headers,'domain':this.domain,'cookies':this.cookies,'func':'getStudentPhoto'})
            })).json()
        }catch(error){rej(error)}
        if (response.status){
            const myres=arrayBufferToBase64(response.photo);
            res(myres);
           }
        else{
            rej(new Error(response.message))
        }
    
    })}

    async getStudentInfo(){
        return new Promise(async(res,rej)=>{
        if(Object.keys(this.studentInfo).length === 0){
        const headers={
                     'Origin': this.domain,
                    'Referer': this.domain+'/PXP2_GradeBook.aspx?AGU=0'
                }
        try{
        var response = await (await fetch('/api/server',{
                'method':'POST',
                'headers':{'Content-Type':'application/json'},
                'body':JSON.stringify({'credentials':this.credentials,'headers':headers,'domain':this.domain,'cookies':this.cookies,'func':'getStudentInfo'})
            })).json()}catch(error){rej(error)}
        if (response.status){
            res(await this.parseStudentInfo(response.info).catch(error=>{rej(error)}))

     }}else{res(this.studentInfo)}}
    )}





     
     async parseStudentInfo(info) {
        return new Promise(async (res, rej) => {
                // Parse the HTML string into a DOM Document
    let parser = new DOMParser();
    let doc = parser.parseFromString(info, 'text/html');

    // Initialize an object to hold all extracted data
    let data = {};

    // Find all 'div' elements with class 'panel panel-default'
    let panels = doc.querySelectorAll('.panel.panel-default');

    // Iterate through each panel to extract table data
    panels.forEach((panel) => {
        // Find the 'table' within each panel
        let table = panel.querySelector('table.info_tbl.table.table-bordered');

        // Check if the table exists
        if (table) {
            // Extract rows of data
            let rows = table.querySelectorAll('tr[valign="top"]');
            rows.forEach((row) => {
                row.querySelectorAll('td').forEach((cell) => {
                    // Extract label
                    let label = cell.querySelector('span.tbl_label');
                    if (label) {
                        let labelText = label.textContent.trim();

                        // Extract value
                        let value = cell.textContent.replace(labelText, '').trim();

                        // Store in object
                        data[labelText.split(' ').join('')] = value;
                    }
                });
            });
        }
    });

    // Extract the photo source URL and add it to the data object
    let img = doc.querySelector('img[alt="Student Photo"]');
    if (img) {
        data.photoSource = img.getAttribute('src');
    }
    
            // Retrieve the student's photo in base64 format
            try {
                const picture = await this.getStudentPhoto(data.photoSource);
                data.photo = picture;
                this.studentInfo = data;
                console.log(data);
                res(data);
            } catch (error) {
                rej(error);
            }
        });
    }

    async getDocument(index){
        return new Promise(async(res,rej)=>{
        var trouble;
        console.log(this.documents[index].file.name);
        try{
        var response=await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'cookies':this.cookies,'url':this.documents[index].file.href,'func':'getDoc'})
        })).json();}catch(error){console.log("its get Document haha");console.log(error);rej(error)}
        console.log(response)
        if (response.status){
            trouble=false;
        this.documents[index].base64=response.doc;
        res({trouble:trouble,download:response.doc});}
        else{
        if(response.message.includes("Link/Authentication Expired")){
            var i=0;
            outerloop:while(i<3){ // so this here is a fallback for if for some god forsaken reason, refreshing all of the links and cookies didnt fucking word, so we just, do it again LMAO
                i++;
                this.documents=[]; // ultiamtely, to solve the above I need to comb through the network shit on synergy see if there's smthn im missing to sustain the cookies longer or smthn
            let temp=await this.getDocuments(true).catch(rej1=>{rej(rej1)})
            try{
            var doc=await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'cookies':this.cookies,'url':temp[index].file.href,'func':'getDoc'})
        })).json();}catch(error){console.log("life is eternal suffering and we are condemend to it");console.log(error);rej(error)}
        console.log(doc)
            if(doc.status){
                console.log(doc)
                console.log("jean val") 
                trouble=true;
                res({trouble:trouble,download:doc.doc});
                break outerloop;
            }
            else{
                if(i==3){ rej(new Error("Failed to Get Documents"))}
            }
        }
       
        }

        else{
        console.log("aw shi, damn, fuck, why bro?")
        rej(new Error(response.message))}}
    })}




    async getDocuments(recheck=false){
        return new Promise(async(res,rej)=>{
            console.log(this.documents.length)
            console.log(this.documents[0])
            if (this.documents.length!==0&&!recheck){res(this.documents);}
            if (recheck){
            console.log("CLEAR");
            this.documents=[]};
            try{
            var response=await (await fetch('/api/server/',{
                'method':'POST',
                'headers':{'Content-Type':'application/json'},
                'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'func':'getDocs','cookies':this.cookies})
            })).json();}catch(error){console.log("Backend Error");console.log(error);rej(error)}
            if (!response.status&&response.message=="Authentication Cookies Expired"){
                var i=0;
                outerLoop: while (i<3) {
                    i++;
                await this.refresh().catch(rej1=>{rej(rej1)})
                console.log(this.cookies)
                try{
                  response=await (await fetch('/api/server/',{
                    'method':'POST',
                    'headers':{'Content-Type':'application/json'},
                    'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'func':'getDocs','cookies':this.cookies})
                })).json();}catch(error){console.log("get docs but the 2nd one");console.log(error);rej(error)}
                console.log(response)
                if (!response.status){
                    if(i==3){rej(new Error("Failed to get Documents--"))}
                    console.log(new Error(response.message))}else{
                    console.log("bffr")
                    this.parseDocuments(response).then(docs=>{res(docs)}).catch(error=>{rej(error)})
                    break outerLoop}}
                }
            this.parseDocuments(response).then(docs=>{res(docs)}).catch(error=>{rej(error)})           
        })

    }


     parseDocuments(response){ // so, in the processTM, i got desperate and made some while true loops, but i think they're no longer needed, we can prob cap the refresh coutn at like
    return new Promise((res,rej)=>{
        let temp = [];
    console.log("genuinely tweaking out :)")
    const response1= response.doc.replace(/PXP.DataGridTemplates.CalculateValue/g,"\"PXP.DataGridTemplates.CalculateValue\"")
    const saftey= response1.substring(response1.indexOf('dxDataGrid(PXP.DevExpress.ExtendGridConfiguration(')+'dxDataGrid(PXP.DevExpress.ExtendGridConfiguration('.length,response1.indexOf("))",response1.indexOf("dxDataGrid(PXP.DevExpress.ExtendGridConfiguration(")));

const response2=JSON.parse(saftey);
        let count=0;
        response2.dataSource.forEach(element =>{
            let $ = jQuery('<div></div>').html(element.DocumentTitle);
            const document={};
            document.file={name:$.find('a').text(), date:element.DocumentUploadDate,href:$.find('a').attr('href')}
            document.category=element.DocumentCategory;
            document.base64; // please rename this asap it's literally not even in base64 anymore this is so dumb, ditch it, ig u could wait till u convert to typeScript and do a full type decleration but liek BRO
            document.index=count;
            count=count+1;
            temp.push(document)

        })
        this.documents=temp;
        res(temp)



    })}

    async fetchAssignment(course){
               const assignments=await this.getAssignments(this.parsedGrades.courses[course].loadstring)
        const assignments2=[]
        const categories={}
        console.log(assignments[0]);
        assignments[0].measureTypes.forEach((category)=>{
            if (category.weight != 0){             categories[category.name]={'name':category.name,'weight':category.weight,
                "grade":{"letter":null,"raw":0,"color":null},"points":{"earned":0,"possible":0}};
                                     }
        });
console.log(assignments[1].responseData.data[0]);
    assignments[1].responseData.data.forEach((assignmentsrange)=>{
        assignmentsrange.items.forEach((item)=>{
                const assignment={};
                assignment.name=item.title;
                assignment.grade={letter:letterGrade(item.calcValue),raw:item.calcValue,color:letterGradeColor(letterGrade(item.calcValue))};
                assignment.points={earned:item.points,possible:item.pointsPossible};
                assignment.date={due:item.due_date};
                assignment.category=item.assignmentType;
                categories[assignment.category].points.earned+=assignment.points.earned;
categories[assignment.category].points.possible+=assignment.points.possible;
                assignments2.push(assignment);
            }
            )});
    const categories2=[];
    for (let category of Object.keys(categories)){     categories[category].grade.raw=categories[category].points.earned/categories[category].points.possible;
    categories2.push(categories[category]);                               //aslo here you'd do the colors and leter grade functions
    };


        this.parsedGrades.courses[course].categories=categories2;
                                                               this.parsedGrades.courses[course].assignments=assignments2;

    }
    async getAssignments(loadstring){
        const url2=this.domain+"/service/PXP2Communication.asmx/LoadControl";
        const url=this.domain+"/server/GB/ClientSideData/Transfer?action=pxp.course.content.items-LoadWithOptions";
            const data={"FriendlyName":"pxp.course.content.items","Method":"LoadWithOptions","Parameters":"{\"loadOptions\":{\"sort\":[{\"selector\":\"due_date\",\"desc\":false}],\"filter\":[[\"isDone\",\"=\",false]],\"group\":[{\"Selector\":\"Week\",\"desc\":true}],\"requireTotalCount\":true,\"userData\":{}},\"clientState\":{}}"}
    const url3="https://md-mcps-psv.edupoint.com/server/GB/ClientSideData/Transfer?action=genericdata.classdata-GetClassData";
            const headers={
                 'Origin': this.domain,
                'Referer': this.domain+'/PXP2_GradeBook.aspx?AGU=0'
            }
            const headers2={
                                                                               "AGU": "0",
                                                                               "Accept": "application/json, text/javascript, */*; q=0.01",
                                                                               "Accept-Encoding": "gzip, deflate, br, zstd",
                                                                               "Accept-Language": "en-US,en;q=0.9",
                                                                               "Connection": "keep-alive",
                                                                               "Content-Type": "application/json; charset=UTF-8",
                                                                               "Cookie":this.cookies,
                                                                               "Host": this.domain.substring(8),
                                                                               "Origin":this.domain,
                                                                               "Referer": "https://md-mcps-psv.edupoint.com/PXP2_Gradebook.aspx?AGU=0",
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0'

                                                                           };
        const data3={"FriendlyName":"genericdata.classdata","Method":"GetClassData","Parameters":"{}"};
            const senddata=convertData1ToData2(JSON.parse(loadstring));
        const response = await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'senddata':senddata,'credentials':this.credentials, 'domain':this.domain,'url2':url2,'url':url,'data':data,'headers2':headers2,'url3':url3,'data3':data3,"headers":headers,'func':'getAssignments'})
        })).json()
        if (response.status){
            return(response.data);
        }
        else{
            return new Error(response.message)
        }

                                                                 };


    async getHomePageGrades(session=this.session) {
        const response = await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'credentials':this.credentials, 'domain':this.domain,'func':'getHomePageGrades','cookies':this.cookies})
        })).json()
        if (response.status){
        return response.grades;}
        else{
            return new Error(response.message)
        }
    }


    async refresh(){
    return new Promise(async(res,rej)=>{
        const bodyData = {
            ...(this.cookies && { 'cookies': this.cookies }),
            'credentials': this.credentials,
            'domain': this.domain,
            'func': 'refresh'
        };
        try{
        var response = await (await fetch('/api/server',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify(bodyData)
        })).json()}
        catch(error){console.log("TEAR OFF MY BALLS WITH A RUSTED SPOON AND FEED THEM TO ME");console.log(error)}
    console.log("HEY")
    if (response.status===false){
        console.log("ima get violent low key")
            console.log(response);
            rej(new Error(response.message));}
    else{
        console.log("ima not get violent low key")
        console.log(this.cookies)
        console.log(response)
        if(this.credentials.username==="151376"){rej(new Error("go to hell, luke"))}
        else{
        this.cookies=response.cookies
        res(this.cookies)}
    }})}

        // Function to parse the raw HTML and create the ParsedGrades structure

async getparseGrades() {
    //the plan is to make a client class where the session object is preserved as long as possible. key functions should run an isAlive check on the session, and if its dead, run refresh code, which will consist of repeating the login and redfining the class-object session variable with the new session. credentials will be saved, potentially parsed grades
    if (this.session == null) {
        console.log("null session")
        this.refresh()
    };

    //also, later, much much later. Grapes social media? profiles,

    // okay so, needed data: class name, grades [letter grade, percentage grade, grade color, room, period, weighted, teacher (name, email)]
    let homePageGradesHtml = await this.getHomePageGrades();
    let $ = jQuery('<div></div>').html(homePageGradesHtml);

    const script = $.find("script").html();
    const periodsData = JSON.parse(script.substring(script.indexOf("PXP.GBFocusData") + 18, script.substring(script.indexOf("PXP.GBFocusData")).indexOf(";") + script.indexOf("PXP.GBFocusData")))
    const periodData = JSON.parse(script.substring(script.indexOf("PXP.GBCurrentFocus") + 21, script.substring(script.indexOf("PXP.GBCurrentFocus")).indexOf(";") + script.indexOf("PXP.GBCurrentFocus")))
    //this.parsedGrades.period = periodData
    console.log(periodsData.GradingPeriods);
    const periods = [];
    for (const period in periodsData.GradingPeriods) {
        console.log(periodsData.GradingPeriods[period])
        const p1 = { name: periodsData.GradingPeriods[period].Name, index: period, gu: periodsData.GradingPeriods[period].GU };
        periods.push(p1);
        if (periodsData.GradingPeriods[period].defaultFocus == true) {
            this.parsedGrades.period = p1;
        };
    };
    this.parsedGrades.periods = periods;
    const classes = $.find('.row.gb-class-header.gb-class-row.flexbox.horizontal');
    const courses = [];
    // Iterate through the elements and print their HTML or text content
    classes.each(async (index, element) => {
        const regex = /\s{2,}|\n+/;
        let listedData = jQuery(element).text().split(regex).filter(Boolean);
        let course = {};
        course.name = listedData[0];
        course.period = listedData[0].slice(0, 1);
        course.weighted = isWeighted(course.name); //isWeighted(course.name)//can properly implement luckily utilizing isWeighted, funcitonality carries over, for once
        course.room = listedData[3].substring(6);
        course.teacher = { name: listedData[1], email: listedData[1].substring(0, listedData[1].indexOf(" ")) + "." + listedData[1].substring(listedData[1].indexOf(" ") + 1) + "@mcpsmd.net" };
        course.loadstring = jQuery(element).find("button").attr("data-focus");
        const mark = $.find('.row.gb-class-row[data-guid=' + JSON.parse(course.loadstring).FocusArgs.classID + "] .score").text();
        console.log("HEY");
        console.log(mark);
        course.grade = {
            letter: letterGrade(mark),//letterGrade(mark),
            raw: mark,
            color: letterGradeColor(mark)//letterGradeColor(letterGrade(mark),
        };
        course.categories = null;
        course.assignments = null;
        console.log(course);
        courses.push(course);

        //console.log(course);''
    });

    this.parsedGrades.courses = courses;
    this.parsedGrades.gpa = 0; //test
    this.parsedGrades.wgpa = 0; //test
    console.log(JSON.stringify(this.parsedGrades));
}
// could low key slice string to only include after <div id="gradebook-content">
//console.log(parseGradeData(grades));
}

function convertData1ToData2(data1) {
    return {
        request: {
            control: data1.LoadParams.ControlName,
            parameters: {
                schoolID: data1.FocusArgs.schoolID,
                classID: data1.FocusArgs.classID,
                gradePeriodGU: data1.FocusArgs.gradePeriodGU,
                subjectID: data1.FocusArgs.subjectID,
                teacherID: data1.FocusArgs.teacherID,
                markPeriodGU: data1.FocusArgs.markPeriodGU,
                assignmentID: data1.FocusArgs.assignmentID,
                standardIdentifier: data1.FocusArgs.standardIdentifier === null ? "null" : data1.FocusArgs.standardIdentifier,
                viewName: data1.FocusArgs.viewName === null ? "null" : data1.FocusArgs.viewName,
                studentGU: data1.FocusArgs.studentGU,
                AGU: data1.FocusArgs.AGU,
                OrgYearGU: data1.FocusArgs.OrgYearGU
            }
        }
    };
}

function arrayBufferToBase64(buffer) {
    const arrayBuffer = new Uint8Array(buffer.data)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    let base64 = '';
    for (let i = 0; i < binary.length; i += 3) {
        let triplet = (binary.charCodeAt(i) << 16) | (binary.charCodeAt(i + 1) << 8) | binary.charCodeAt(i + 2);
        for (let j = 0; j < 4; j++) {
            if (i * 8 + j * 6 > binary.length * 8) {
                base64 += '=';
            } else {
                base64 += chars[(triplet >>> 6 * (3 - j)) & 0x3F];
            }
        }
    }
    return base64;
}

export default Client;
