/*====================================
MONDAY V2
PART 1
CORE ENGINE
====================================*/

//==============================
// PLAYER
//==============================

const player = {

    energy:100,
    focus:100,
    mood:100,

    time:510,          // 8:30 AM

    inbox:3,

    eventIndex:0,

    timeline:[],

    progress:0

};

//==============================
// DOM
//==============================

const screens=document.querySelectorAll(".screen");

const energyBar=document.getElementById("energyBar");
const focusBar=document.getElementById("focusBar");
const moodBar=document.getElementById("moodBar");

const energyValue=document.getElementById("energyValue");
const focusValue=document.getElementById("focusValue");
const moodValue=document.getElementById("moodValue");

const clock=document.getElementById("clock");

const progressBar=document.getElementById("progressBar");

const mailCount=document.getElementById("mailCount");

const miniTimeline=document.getElementById("miniTimeline");

//==============================
// BUTTONS
//==============================

document.getElementById("beginBtn")
.addEventListener("click",showSetup);

document.getElementById("startGame")
.addEventListener("click",startGame);

document.getElementById("continueBtn")
.addEventListener("click",nextEvent);

document.getElementById("playAgain")
.addEventListener("click",()=>location.reload());

//==============================
// SCREEN SYSTEM
//==============================

function showScreen(id){

    screens.forEach(screen=>{

        screen.classList.remove("active");

    });

    document
    .getElementById(id)
    .classList.add("active");

}

//==============================
// UPDATE HUD
//==============================

function updateHUD(){

    updateBar(
        energyBar,
        energyValue,
        player.energy
    );

    updateBar(
        focusBar,
        focusValue,
        player.focus
    );

    updateBar(
        moodBar,
        moodValue,
        player.mood
    );

    mailCount.innerHTML=
        player.inbox+" unread";

    progressBar.style.width=
        player.progress+"%";

    updateClock();

}

//==============================
// UPDATE BAR
//==============================

function updateBar(bar,label,value){

    value=Math.max(0,Math.min(100,value));

    bar.style.width=value+"%";

    label.innerHTML=Math.round(value);

}

//==============================
// CLOCK
//==============================

function updateClock(){

    const h=Math.floor(player.time/60);

    const m=player.time%60;

    clock.innerHTML=
        String(h).padStart(2,"0")
        +":"
        +
        String(m).padStart(2,"0");

}

//==============================
// ADVANCE TIME
//==============================

function advance(minutes){

    player.time+=minutes;

    if(player.time>1020){

        player.time=1020;

    }

    updateClock();

}

//==============================
// TIMELINE
//==============================

function addTimeline(text){

    player.timeline.push(text);

    const div=document.createElement("div");

    div.className="timelineItem";

    div.innerHTML=text;

    miniTimeline.prepend(div);

}

//==============================
// RESOURCE CHANGES
//==============================

function changeResources(
energy,
focus,
mood
){

    player.energy+=energy;

    player.focus+=focus;

    player.mood+=mood;

    player.energy=Math.max(0,Math.min(100,player.energy));

    player.focus=Math.max(0,Math.min(100,player.focus));

    player.mood=Math.max(0,Math.min(100,player.mood));

    updateHUD();

}

//==============================
// NOTIFICATION
//==============================

function notify(text){

    const box=document.getElementById("notification");

    const label=document.getElementById("notificationText");

    label.innerHTML=text;

    box.classList.add("show");

    setTimeout(()=>{

        box.classList.remove("show");

    },2500);

}

//==============================
// STARTUP
//==============================

updateHUD();
/*====================================
PART 2
MORNING SETUP
====================================*/

const morningSelections={

sleep:null,
breakfast:null,
commute:null

};

const setupData=[

{
title:"How did you sleep?",
key:"sleep",

options:[
{name:"Great (8 hrs)",effects:{energy:10,focus:5,mood:5}},
{name:"Okay (6 hrs)",effects:{energy:0,focus:0,mood:0}},
{name:"Poor (4 hrs)",effects:{energy:-18,focus:-10,mood:-8}}
]

},

{
title:"Breakfast",
key:"breakfast",

options:[
{name:"Healthy",effects:{energy:8,focus:4,mood:2}},
{name:"Coffee Only",effects:{energy:2,focus:3,mood:-2}},
{name:"Skipped",effects:{energy:-8,focus:-4,mood:-3}}
]

},

{
title:"Commute",
key:"commute",

options:[
{name:"Walk",effects:{energy:2,mood:6}},
{name:"Metro",effects:{energy:0,mood:0}},
{name:"Traffic",effects:{energy:-5,mood:-8}}
]

}

];

function showSetup(){

showScreen("setup");

renderSetup();

}

function renderSetup(){

const container=document.getElementById("setupContainer");

container.innerHTML="";

setupData.forEach(section=>{

const card=document.createElement("div");

card.className="setupCard";

card.innerHTML=`<h3>${section.title}</h3>`;

const group=document.createElement("div");

group.className="optionGroup";

section.options.forEach(option=>{

const div=document.createElement("div");

div.className="option";

div.innerHTML=option.name;

div.onclick=()=>{

group.querySelectorAll(".option")
.forEach(o=>o.classList.remove("selected"));

div.classList.add("selected");

morningSelections[section.key]=option.effects;

};

group.appendChild(div);

});

card.appendChild(group);

container.appendChild(card);

});

}

function startGame(){

Object.values(morningSelections).forEach(effect=>{

if(effect){

changeResources(

effect.energy||0,

effect.focus||0,

effect.mood||0

);

}

});

notify("Your workday begins.");

addTimeline("Started work.");

player.progress=5;

updateHUD();

showScreen("eventScreen");

nextEvent();

}
/*====================================
PART 3
EVENT ENGINE
====================================*/

const events=[

{

type:"Slack",

title:"Manager Message",

text:"Your manager sends: 'Can we talk later today?'",

choices:[

{

text:"Assume the worst",

energy:-8,
focus:-5,
mood:-15,

result:"You spend the morning worrying."

},

{

text:"Wait for more information",

energy:0,
focus:0,
mood:0,

result:"You continue working."

},

{

text:"Ask politely what it's about",

energy:2,
focus:2,
mood:5,

result:"Your manager replies it's about project planning."

}

]

},

{

type:"Meeting",

title:"Lunch Decision",

text:"The meeting overruns. Lunch is only 15 minutes.",

choices:[

{

text:"Eat anyway",

energy:8,
focus:10,
mood:4,

result:"You feel recharged."

},

{

text:"Grab coffee",

energy:2,
focus:2,
mood:-2,

result:"You stay awake but hungry."

},

{

text:"Skip lunch",

energy:-10,
focus:-15,
mood:-8,

result:"You push through."

}

]

},

{

type:"Email",

title:"Inbox Full",

text:"Five new emails arrive.",

choices:[

{

text:"Answer immediately",

energy:-5,
focus:-5,
mood:2,

result:"Inbox becomes manageable."

},

{

text:"Finish current task first",

energy:2,
focus:8,
mood:0,

result:"You protect your attention."

},

{

text:"Panic",

energy:-8,
focus:-10,
mood:-12,

result:"You jump between tasks."

}

]

}

];

function nextEvent(){

if(player.eventIndex>=events.length){

finishGame();

return;

}

const event=events[player.eventIndex];

document.getElementById("eventType").innerHTML=event.type;

document.getElementById("eventTitle").innerHTML=event.title;

document.getElementById("eventText").innerHTML=event.text;

const choices=document.getElementById("choices");

choices.innerHTML="";

event.choices.forEach(choice=>{

const card=document.createElement("div");

card.className="choice";

card.innerHTML=`

<h4>${choice.text}</h4>

<p>${choice.result}</p>

`;

card.onclick=()=>{

    applyChoice(choice);

};

choices.appendChild(card);

});

}
/*====================================
PART 4
PSYCHOLOGY ENGINE
====================================*/

const psychology={

anticipation:0,
interruptions:0,
recovery:0,
workload:0

};

function applyChoice(choice){

    changeResources(
        choice.energy,
        choice.focus,
        choice.mood
    );

    advance(45);

    player.progress+=30;

    if(choice.energy<0){

        psychology.workload+=Math.abs(choice.energy);

    }

    if(choice.mood<0){

        psychology.anticipation+=Math.abs(choice.mood);

    }

    if(choice.focus<0){

        psychology.interruptions+=Math.abs(choice.focus);

    }

    if(choice.energy>0 || choice.focus>0){

        psychology.recovery+=10;

    }

    updateHUD();

    notify(choice.result);

    addTimeline(choice.result);

}
/*==================================================
PART 4
ENDING + PSYCHOLOGY
==================================================*/

const psychology={

    anticipation:0,
    interruptions:0,
    workload:0,
    recovery:0

};

//--------------------------------------------------

function applyChoice(choice){

    // Change resources

    changeResources(

        choice.energy||0,
        choice.focus||0,
        choice.mood||0

    );

    // Advance clock

    advance(45);

    // Progress

    player.progress+=30;

    updateHUD();

    // Notifications

    notify(choice.result);

    addTimeline(choice.result);

    // Psychology tracking

    if(choice.energy<0){

        psychology.workload+=Math.abs(choice.energy);

    }

    if(choice.focus<0){

        psychology.interruptions+=Math.abs(choice.focus);

    }

    if(choice.mood<0){

        psychology.anticipation+=Math.abs(choice.mood);

    }

    if(choice.energy>0 || choice.focus>0){

        psychology.recovery+=10;

    }

    // Next Event

    player.eventIndex++;

    if(player.eventIndex>=events.length){

        finishGame();

    }

    else{

        nextEvent();

    }

}

//--------------------------------------------------

function finishGame(){

    showScreen("ending");

    buildSummary();

    buildTimeline();

    buildInsights();

}

//--------------------------------------------------

function buildSummary(){

    const summary=document.getElementById("summary");

    summary.innerHTML=`

    <div class="summaryCard">

        <h4>⚡ Energy</h4>

        <div class="summaryValue">${player.energy}</div>

    </div>

    <div class="summaryCard">

        <h4>🧠 Focus</h4>

        <div class="summaryValue">${player.focus}</div>

    </div>

    <div class="summaryCard">

        <h4>😊 Mood</h4>

        <div class="summaryValue">${player.mood}</div>

    </div>

    `;

}

//--------------------------------------------------

function buildTimeline(){

    const timeline=document.getElementById("timeline");

    timeline.innerHTML="";

    player.timeline.forEach(item=>{

        timeline.innerHTML+=`

        <div class="eventLog">

            <p>${item}</p>

        </div>

        `;

    });

}

//--------------------------------------------------

function buildInsights(){

    const insights=document.getElementById("insights");

    const total=

        psychology.anticipation+

        psychology.interruptions+

        psychology.workload+

        psychology.recovery;

    function percent(x){

        if(total===0) return 0;

        return Math.round(x/total*100);

    }

    insights.innerHTML=`

    <div class="insight">

        <div class="insightHeader">

            <span>Anticipation</span>

            <span>${percent(psychology.anticipation)}%</span>

        </div>

        <div class="insightBar">

            <div class="insightFill"

            style="width:${percent(psychology.anticipation)}%">

            </div>

        </div>

    </div>

    <div class="insight">

        <div class="insightHeader">

            <span>Interruptions</span>

            <span>${percent(psychology.interruptions)}%</span>

        </div>

        <div class="insightBar">

            <div class="insightFill"

            style="width:${percent(psychology.interruptions)}%">

            </div>

        </div>

    </div>

    <div class="insight">

        <div class="insightHeader">

            <span>Workload</span>

            <span>${percent(psychology.workload)}%</span>

        </div>

        <div class="insightBar">

            <div class="insightFill"

            style="width:${percent(psychology.workload)}%">

            </div>

        </div>

    </div>

    <div class="insight">

        <div class="insightHeader">

            <span>Recovery</span>

            <span>${percent(psychology.recovery)}%</span>

        </div>

        <div class="insightBar">

            <div class="insightFill"

            style="width:${percent(psychology.recovery)}%">

            </div>

        </div>

    </div>

    `;

}
