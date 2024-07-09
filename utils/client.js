//const axios = require('axios').default;
//const tough = require('tough-cookie');
//const { wrapper } = require('axios-cookiejar-support');
//const FormData = require('form-data');
//for now, while the best thing would be to rewrite
//grade melon to load the homepage and the classes seperately from each other, to save myself that headache, I'll extrapolate catagory data from the assignments themselves, only if it's empty will I call for the real API
// Define the connection and URL
import jQuery from "jquery";



//aahshahaaha nevermind, we're gunna try embedding the rest as a function call chew on THAT, .

class Client{
    constructor(credentials){
        this.credentials = credentials;
        this.domain="https://md-mcps-psv.edupoint.com";
        this.parsedGrades={};
        this.documents=[];
        this.busy=false;
    }


    async getDocument(index){
        console.log(this.documents[index].file.name);
        const response=await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'url':this.documents[index].file.href,'func':'getDoc'})
        })).json();
        console.log(response)
        if (response.status){
        this.documents[index].base64=response.doc;
        console.log("oh hooray!");
        return(response.doc);}
        else{
        if(response.message.includes("403")){
            console.log("RATS")
            await this.refresh();
            let temp = await this.getDocuments(true);
            const doc=await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'url':temp[index].file.href,'func':'getDoc'})
        })).json();
            if(doc.status){return(doc.doc)}}

        else{
        return(response)}}
    }

    async getDocuments(recheck=false){
    return new Promise(async (res,rej)=>{
        let temp = [];
        console.log("you wanna get fucky wucky?");
        console.log(this.documents.length)
        console.log(this.documents[0])
        if (this.documents.length!==0&&!recheck){res(this.documents);}
        if (recheck){
        console.log("CLEAR");
        this.documents=[]};
        console.log("oh not even??");
        const response=await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'func':'getDocs'})
        })).json();
        console.log("does it get to here?");
    if (!response.status){
    console.log("does it get to here actaully the inital failure?");
        await this.refresh()
        const  response1=await (await fetch('/api/server/',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'domain':this.domain,'credentials':this.credentials,'func':'getDocs'})
        })).json();
        if (!response1.status){rej(new Error(response.message))}}
    const response1= response.doc.replace(/PXP.DataGridTemplates.CalculateValue/g,"\"PXP.DataGridTemplates.CalculateValue\"")
    const saftey= response1.substring(response1.indexOf('dxDataGrid(PXP.DevExpress.ExtendGridConfiguration(')+'dxDataGrid(PXP.DevExpress.ExtendGridConfiguration('.length,response1.indexOf("))",response1.indexOf("dxDataGrid(PXP.DevExpress.ExtendGridConfiguration(")));
    try{
const response2=JSON.parse(saftey);
        let count=0;
        response2.dataSource.forEach(element =>{
            let $ = jQuery('<div></div>').html(element.DocumentTitle);
            const document={};
            document.file={name:$.find('a').text(), date:element.DocumentUploadDate,href:$.find('a').attr('href')}
            document.category=element.DocumentCategory;
            document.base64;
            document.index=count;
            count=count+1;
            temp.push(document)

        })
        this.documents=temp;
        res(temp)
        }
        catch(error){
        console.log(error);res(this.documents)}

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
                assignment.grade={letter:item.calcValue,raw:item.calcValue,color:item.calcValue};
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
            'body':JSON.stringify({'credentials':this.credentials, 'domain':this.domain,'url2':url2,'url':url,'data':data,'headers2':headers2,'url3':url3,'data3':data3,"headers":headers,'func':'getAssignments'})
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
            'body':JSON.stringify({'credentials':this.credentials, 'domain':this.domain,'func':'getHomePageGrades'})
        })).json()
        if (response.status){
        return response.grades;}
        else{
            return new Error(response.message)
        }
    }

    async logIn(credentials=this.credentials, session=this.session) {
        const url = this.domain+"/PXP2_Login_Student.aspx?regenerateSessionId=True";
        const data = new FormData();
        data.append('__VIEWSTATE', 'xSUJwarOjTQE7CskHQblb19ssBCBpUW+5tfdNDuD3IcYmgxmrAGdCkRQBXImdT8UDBRZUWGKh1WbTZ5Sjneh/pHvZfC9OS9G/dvguNcLVQQ=');
        data.append('__EVENTVALIDATION', 'MuxKAkL0uqFFwLLJFLrjlv9DhfP/xcGj5sOrlMYih54BCkfxr2cabxYxCi4hecln+T2qPKNaTFbQWvZzISA0REDWrFIt/4YxP7E7ZdNiop+fTihWPxDD81Brd70gdCgpKWeQp7cfRdrkvCZULYF4ZcMI330jEDOCyKbmjCTImRA=');
        data.append('ctl00$MainContent$username', credentials.username);
        data.append('ctl00$MainContent$password', credentials.password);
        data.append('ctl00$MainContent$Submit1', 'Login');

        const headers = {
            'Origin': this.domain,
            'Referer': this.domain+'/PXP2_Login_Student.aspx?Logout=1&regenerateSessionId=True'
        };

        try {
            const login = await session.post(url, data, { headers });
            console.log(login.status);
            console.log(login.statusText);
            if (login.data.includes("Good")){
                console.log("Logged in");
            } else {throw new Error("Incorrect Username or Password")};
        } catch (error) {
            if (error.message !=="Incorrect Username or Password"){console.log("WHAT");console.log(error.message);

            console.error(`Error logging in: ${error.response ? error.response.statusText : error.message}`);

    throw(error);
        }else{error}
        }
    }

    async refresh(){
    return new Promise(async(res,rej)=>{
        const response = await (await fetch('/api/server',{
            'method':'POST',
            'headers':{'Content-Type':'application/json'},
            'body':JSON.stringify({'credentials':this.credentials, 'domain':this.domain,'func':'refresh'})
        })).json()
    console.log("HEY")
    if (!response.status){
        rej(new Error(response.message));}else{res()}
    })}

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
        course.weighted = true; //isWeighted(course.name)//can properly implement luckily utilizing isWeighted, funcitonality carries over, for once
        course.room = listedData[3].substring(6);
        course.teacher = { name: listedData[1], email: listedData[1].substring(0, listedData[1].indexOf(" ")) + "." + listedData[1].substring(listedData[1].indexOf(" ") + 1) + "@mcpsmd.net" };
        course.loadstring = jQuery(element).find("button").attr("data-focus");
        const mark = $.find('.row.gb-class-row[data-guid=' + JSON.parse(course.loadstring).FocusArgs.classID + "] .score").text();
        console.log("HEY");
        console.log(mark);
        course.grade = {
            letter: mark,//letterGrade(mark),
            raw: mark,
            color: mark//letterGradeColor(letterGrade(mark),
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



module.exports=Client;
