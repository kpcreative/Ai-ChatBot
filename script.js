
let chatcont=document.querySelector(".chat-container");
let btnimg=document.querySelector("#img");
let btn=document.querySelector("#img img");
let inpt=btnimg.querySelector("input");
let submit=document.querySelector("#sub");

//ham chate hai ki jise ye submit pe click krega to again genraterwsponse aa jaye
submit.addEventListener("click",(e)=>{
    handlechatresponse(prompt.value);
    //ham chate hai ki jise ye ho jaye na to jo v input pe value hai vo emoty ho jaye
    prompt.value="";
})
const apiurl="https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDB18NZt6RxYN7KLOIVACHzW_Z8YxFJdB8";
//let object bna lo 
//as user mssg ya image hi bhejega na
//isliye asani ho isliye direct yha object hi bna liya

let user={
    mssg:null,
    
    file:{
         mime_type:null,
          data: null
    }

}


async function genratechatresponse(aichatbox)
{
    let text=aichatbox.querySelector(".ai-chat-area");//document. mt likhna..aichatbox. likhna tum
    let requestoption={
        method:"POST",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            "contents": [{
              "parts":[{"text": user.mssg},
                (user.file.data?[{"inline_data":user.file}]:[])

              ]
              }]
             })
        }
    
    //chlo isko try catch k andar likhte hain
    //ki jo v response deti hai agr error nhi hai to try k andar likh dnge warna error throw kr dnge
    try{
        let response=await fetch(apiurl,requestoption);
//response aa gya  na
//jo fetch hokr aiga usko json m convert kr dngw
let data=await response.json();
//let data ko print krke dekhte hain
//console.log(data);
//isse pta chla ki hmara response firstly ham candites[0] pe gye and uske bad content.parts pe gye and part[0].text hai usme data aya hai
let apiresponse=data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim();
// replace(/\*\*(.*?)\*\*/g,"$1").trim(); The code removes double asterisks (**) surrounding text while keeping the content between them intact, and trims any leading or trailing spaces.
// console.log(apiresponse);

//ab islo hamko ai chatbox k andr print krna hai
text.innerHTML=apiresponse;

//par response aa rha hai ab and par respinse jise bada hote ja rha hai na to ye thoda overflow ho ja rha hai



    }
    catch(error){
        console.log(error);
    }

    finally{
        btn.src= "img.svg"


btn.classList.remove("choose");
        //chahe response aye ya nhi aye ye chlega hi
        chatcont.scrollTo({top:chatcont.scrollHeight,behavior:"smooth"}) //to ye top se jitna chatcontainer k height hai utna tak scroll ho jiga with smoothly
//and also user.file={} kr dena wrna dusra bar v chat bhejga to ye img chla jiga sath me
user.file={};
    }



}
// phle prompt area ye sb ko acess kr lete hai  and input dikhe phle
let prompt=document.querySelector('#prompt');
// ham is prompt par ek event add krnge ki enter v krnge to ye jo input pe hai n vo chatbox area k ai chat wale me aa jaye
//isliye prompt me ek event listener lga dete hai
// keydown mtlb ki koi v key press krega to 
// par hame chaiye ki enter hi press krega tabhi ye ho
//to niche jo hai usko jab console.log(e) krega to usme key section me dikhayega ki apne kon sa key press kiya hai
// and jab v enter click krta hai jo sara jo v value hai input ki vo print krainge ham
prompt.addEventListener("keydown",(e)=>{
   // console.log(e.key);
    if(e.key==="Enter")
    {
      //  console.log(prompt.value);
    //   agr aisa hai to us time pe ham ek function call kr denge to ai chat pe dispaly kr rha haga
    // and isme prompt.value ko pass kr denge
    handlechatresponse(prompt.value);
      //ham chate hai ki jise ye ho jaye na to jo v input pe value hai vo emoty ho jaye
      prompt.value="";
        
    }
    
   // console.log(e);
    
})



function handlechatresponse(mssg)
{
    user.mssg=mssg;
    //sorry yar ham jo v likhnge vo to user me dikehga na
    //par ye to single hai na
    // let mssg_area=document.querySelector(".ai-chat-area");
    // mssg_area.innerHTML=mssg;

    //ham chate hai ki jab v kuch message ayega to user wala v and ai chat wala v dusra dusra ate rhega
    //ye html hamre us user ka hai jiske andar hame mssg ko likhna hai 
    //to user chat box k andar likhnge na
    //and hame use bar bar k=likhwana hai
    let html=` <img src="/image/user.png" alt="" id="user-image" width="10%">
     <div class="user-chat-area">
     ${user.mssg}
     ${user.file.data?`<img src="data:${user.file.mime_type};base64,${user.file.data}" class="chooseimg" />`:""}
     </div>`
  
  
    //  ham chate hai ki dynamically ye bar bar ate rhe 
    // ye funcion na aichat box me v kam aa jiga isliye function bna diy
    //and isme html pass kr dnge and class i.e user ka jo inner html hao vp to user-chatbox ke andar hi hai na
let userchatbox=createchatbox(html,"user-chatbox");

//ab ise chat-container me append kr dnge

chatcont.appendChild(userchatbox);

//yha userchatbox k liye scroll krnge
chatcont.scrollTo({top:chatcont.scrollHeight,behavior:"smooth"}) //to ye top se jitna chatcontainer k height hai utna tak scroll ho jiga with smoothly
//ab ai k liye v bnanna hga na ki vo v response k bad scroll ho jaye to genraterespinse m bnaya hai hmne




//jise userchatbox aya ham chate hai ki turnt 600ms bad aichatbox prepare hone lge and answer dene lge
//sliye we will use settimeout
setTimeout(()=>{
    //same waise hi ai chat box bnainge jise user ka bnai the
    let html=` <img src="/image/ai.png" alt="" id="ai-image" width="10%">
      <div class="ai-chat-area">
               <img src="loading.webp" alt="" width="50px" class="load">

      </div>`

      //yha jo v response ayega vo api se ayega

      let aichatbox=createchatbox(html,"ai-chatbox");
      chatcont.appendChild(aichatbox);
      //ham chate hai ki jab tak response nhi ata tab tak loading wali iamge dalna chate hai ham

      //ab ham chate hai ki genrateresponse aa jaye gemini ka api key use kra hai hmne
      genratechatresponse(aichatbox);//aichatbox pass kr diya taki jo v response aye to is aichatbox k andr likh paye ham


},600);//i.e 600ms ke bad ai ka bnnna chalu hga ai chatbox


}

function createchatbox(html,classes)
{
let div=document.createElement("div");
div.innerHTML=html;
div.classList.add(classes);
return div;

}

//ab ham, chate hai jise user ne enter kiya waise turnt hi ai chatbox aa jaye and answer dene lge


//jab v file uthainge to chnage event lagainge

inpt.addEventListener("change",()=>{
    //is file k andr vo sotre krnge jo is file me image ayegi hmare pas

const file=inpt.files[0];//i.e inpt me jo files hai uska 0 index wali file hmari file k andr aa jigi
//agr kisi ne koi v image nhi li
if(!file) return;
//ab ham yha pe object bnainenge apne file reade ka
//iske andar kuch funtions hote hain jo hamri files ko read krte hai..jo krana chahtge hai us image sath
let reader=new FileReader();
//iske andr onload ek function lgate hai ki jab vo read krna start kre to us time ek event chlega 
reader.onload=(e)=>{
 console.log(e);
let bb=e.target.result.split(",")[1];//1 index wale pe jo data hai usko split kra dnge coma se
user.file={
    mime_type:file.type,
    data:bb
}
//onload ke andar dalte hain
//and jab response aa jaye to waps ye set ho jaye img.svg jo v tha usse

btn.src= `data:${user.file.mime_type};base64,${user.file.data}
`

btn.classList.add("choose");
}

//ye yha pe kam ny kr paya  isliye isko andar hi krke dekhte hai 
// btn.src= `data:${user.file.mime_type};base64,${user.file.data}
//


//ab reader uske andar i.e uske url ko pdhega kise isliye readasdataurl pass kiye
reader.readAsDataURL(file);



})

btnimg.addEventListener("click",(e)=>{
    inpt.click();//click kra dnge inout wale p ham
})