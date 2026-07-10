/*=====================================================
MONDAY V2
SCRIPT.JS
PART A - CORE ENGINE
=====================================================*/

const game = {

    player:{

        energy:100,
        focus:100,
        mood:100,

        time:510,          // 08:30

        inbox:3

    },

    progress:0,

    currentEvent:0,

    timeline:[]

};

//======================================
// DOM
//======================================

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

const notification=document.getElementById("notification");

const notificationText=document.getElementById("notificationText");

//======================================
// BUTTONS
//======================================

document
.getElementById("beginBtn")
.addEventListener("click",showSetup);

document
.getElementById("startGame")
.addEventListener("click",startGame);

document
.getElementById("playAgain")
.addEventListener("click",()=>{

location.reload();

});

//======================================
// SCREEN SYSTEM
//======================================

function showScreen(id){

    screens.forEach(screen=>{

        screen.classList.remove("active");

    });

    document
    .getElementById(id)
    .classList.add("active");

}

//======================================
// CLOCK
//======================================

function updateClock(){

    const hour=Math.floor(game.player.time/60);

    const minute=game.player.time%60;

    clock.innerHTML=

        String(hour).padStart(2,"0")

        +

        ":"

        +

        String(minute).padStart(2,"0");

}

function advanceTime(minutes){

    game.player.time+=minutes;

    if(game.player.time>1020){

        game.player.time=1020;

    }

    updateClock();

}

//======================================
// HUD
//======================================

function updateHUD(){

    updateBar(

        energyBar,

        energyValue,

        game.player.energy

    );

    updateBar(

        focusBar,

        focusValue,

        game.player.focus

    );

    updateBar(

        moodBar,

        moodValue,

        game.player.mood

    );

    progressBar.style.width=

        game.progress+"%";

    mailCount.innerHTML=

        game.player.inbox+

        " unread";

}

function updateBar(bar,label,value){

    value=Math.max(

        0,

        Math.min(100,value)

    );

    bar.style.width=value+"%";

    label.innerHTML=Math.round(value);

}

//======================================
// RESOURCES
//======================================

function changeResources(

energy=0,

focus=0,

mood=0

){

    game.player.energy+=energy;

    game.player.focus+=focus;

    game.player.mood+=mood;

    game.player.energy=Math.max(
        0,
        Math.min(100,game.player.energy)
    );

    game.player.focus=Math.max(
        0,
        Math.min(100,game.player.focus)
    );

    game.player.mood=Math.max(
        0,
        Math.min(100,game.player.mood)
    );

    updateHUD();

}

//======================================
// TIMELINE
//======================================

function addTimeline(text){

    game.timeline.push(text);

    const item=document.createElement("div");

    item.className="timelineItem";

    item.innerHTML=text;

    miniTimeline.prepend(item);

}

//======================================
// TOAST
//======================================

function toast(text){

    notificationText.innerHTML=text;

    notification.classList.add("show");

    setTimeout(()=>{

        notification.classList.remove("show");

    },2500);

}

//======================================
// STARTUP
//======================================

updateClock();

updateHUD();
/*=====================================================
PART B
MORNING SETUP
=====================================================*/

const morningQuestions=[

{

title:"How did you sleep?",

options:[

{

text:"😴 Less than 5 hours",

energy:-20,

focus:-15,

mood:-10

},

{

text:"🙂 Around 7 hours",

energy:0,

focus:0,

mood:0

},

{

text:"😄 8+ hours",

energy:15,

focus:10,

mood:5

}

]

},

{

title:"Breakfast",

options:[

{

text:"☕ Coffee only",

energy:-5,

focus:5,

mood:-5

},

{

text:"🥣 Light breakfast",

energy:5,

focus:5,

mood:5

},

{

text:"🍳 Proper meal",

energy:10,

focus:10,

mood:10

}

]

},

{

title:"Commute",

options:[

{

text:"🚗 Heavy traffic",

energy:-10,

focus:-10,

mood:-10

},

{

text:"🚆 Normal commute",

energy:0,

focus:0,

mood:0

},

{

text:"🚶 Walked / Relaxed",

energy:10,

focus:5,

mood:10

}

]

}

];

let setupAnswers=[];

//====================================

function showSetup(){

showScreen("setup");

buildSetup();

}

//====================================

function buildSetup(){

const container=document.getElementById("setupContainer");

container.innerHTML="";

setupAnswers=[];

morningQuestions.forEach((question,index)=>{

const card=document.createElement("div");

card.className="setupCard";

card.innerHTML=`<h3>${question.title}</h3>`;

const group=document.createElement("div");

group.className="optionGroup";

question.options.forEach((option,optIndex)=>{

const button=document.createElement("div");

button.className="option";

button.innerHTML=option.text;

button.onclick=()=>{

group.querySelectorAll(".option")

.forEach(o=>o.classList.remove("selected"));

button.classList.add("selected");

setupAnswers[index]=option;

};

group.appendChild(button);

});

card.appendChild(group);

container.appendChild(card);

});

}

//====================================

function startGame(){

if(setupAnswers.length<3){

toast("Complete all three morning questions.");

return;

}

setupAnswers.forEach(answer=>{

changeResources(

answer.energy,

answer.focus,

answer.mood

);

});

game.progress=10;

updateHUD();

toast("Your workday has begun.");

showScreen("eventScreen");

loadEvent();

}
/*=====================================================
PART C1
EVENT ENGINE + FIRST EVENTS
=====================================================*/

const events=[

{

type:"Slack",

title:"Manager Message",

text:"Your manager sends: 'Can we catch up later today?'",

choices:[

{

text:"Assume something is wrong",

result:"You spend the next hour worrying.",

energy:-10,

focus:-15,

mood:-15

},

{

text:"Reply: Sure! What time works?",

result:"The uncertainty disappears.",

energy:-2,

focus:0,

mood:5

},

{

text:"Ignore it for now",

result:"It stays in the back of your mind.",

energy:-5,

focus:-5,

mood:-5

}

]

},

{

type:"Email",

title:"Inbox Explosion",

text:"You arrive to find 42 unread emails.",

choices:[

{

text:"Read every email first",

result:"You lose your entire morning.",

energy:-8,

focus:-15,

mood:-5

},

{

text:"Prioritize urgent emails",

result:"You feel back in control.",

energy:-2,

focus:5,

mood:5

},

{

text:"Ignore them",

result:"They keep distracting you.",

energy:-5,

focus:-10,

mood:-5

}

]

},

{

type:"Meeting",

title:"Stand-up Meeting",

text:"The meeting starts running over time.",

choices:[

{

text:"Stay quietly",

result:"You miss time for important work.",

energy:-5,

focus:-10,

mood:-5

},

{

text:"Suggest wrapping up",

result:"The meeting ends on time.",

energy:0,

focus:5,

mood:5

},

{

text:"Multitask during meeting",

result:"You miss half the discussion.",

energy:-2,

focus:-8,

mood:0

}

]

},

{

type:"Coworker",

title:"Quick Question",

text:"A teammate interrupts you for help.",

choices:[

{

text:"Help immediately",

result:"You lose focus but strengthen the relationship.",

energy:-5,

focus:-12,

mood:8

},

{

text:"Schedule time later",

result:"You protect your work and still help.",

energy:-2,

focus:5,

mood:5

},

{

text:"Decline",

result:"You finish work but feel guilty.",

energy:0,

focus:5,

mood:-8

}

]

}

];

//======================================

function loadEvent(){

if(game.currentEvent>=events.length){

finishGame();

return;

}

const event=events[game.currentEvent];

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
/*=====================================================
PART C2
MORE EVENTS + GAMEPLAY ENGINE
=====================================================*/

events.push(

{

type:"Client",

title:"Urgent Escalation",

text:"A client reports that a payment failed and wants an immediate resolution.",

choices:[

{

text:"Drop everything and investigate",

result:"The client appreciates the speed, but your own work stalls.",

energy:-12,
focus:-12,
mood:-5

},

{

text:"Acknowledge the issue and prioritise tasks",

result:"Expectations are managed and you stay organised.",

energy:-5,
focus:5,
mood:5

},

{

text:"Ask someone else to handle it",

result:"The issue is resolved, but you feel disconnected.",

energy:0,
focus:5,
mood:-5

}

]

},

{

type:"Teams",

title:"Constant Notifications",

text:"Messages keep arriving while you're trying to concentrate.",

choices:[

{

text:"Reply immediately to everything",

result:"You never get into deep work.",

energy:-8,
focus:-18,
mood:-5

},

{

text:"Mute notifications for 30 minutes",

result:"You complete an important task uninterrupted.",

energy:2,
focus:12,
mood:5

},

{

text:"Keep glancing at Teams",

result:"Your attention stays fragmented.",

energy:-5,
focus:-10,
mood:-3

}

]

},

{

type:"Operations",

title:"Production Issue",

text:"A service suddenly stops working. Everyone starts messaging you.",

choices:[

{

text:"Stay calm and prioritise",

result:"The situation stabilises quickly.",

energy:-8,
focus:8,
mood:3

},

{

text:"Panic and multitask",

result:"You become overwhelmed.",

energy:-15,
focus:-15,
mood:-15

},

{

text:"Wait for someone else",

result:"Nothing improves while you wait.",

energy:-5,
focus:-8,
mood:-10

}

]

},

{

type:"Lunch",

title:"It's 1:30 PM",

text:"You've been working continuously all morning.",

choices:[

{

text:"Skip lunch",

result:"You keep working but your energy drops sharply.",

energy:-20,
focus:-10,
mood:-10

},

{

text:"Take a proper break",

result:"You return feeling refreshed.",

energy:15,
focus:10,
mood:10

},

{

text:"Eat while checking email",

result:"You never really disconnect.",

energy:-5,
focus:-3,
mood:0

}

]

}

);

//==================================================
// GAMEPLAY ENGINE
//==================================================

function applyChoice(choice){

    changeResources(

        choice.energy,

        choice.focus,

        choice.mood

    );

    game.progress+=12;

    if(game.progress>100){

        game.progress=100;

    }

    advanceTime(45);

    game.player.inbox+=Math.floor(Math.random()*3);

    addTimeline(choice.result);

    toast(choice.result);

    updateHUD();

    game.currentEvent++;

    setTimeout(()=>{

        loadEvent();

    },700);

}
/*=====================================================
PART C3
ENDING + SUMMARY
=====================================================*/

function finishGame(){

    showScreen("ending");

    buildSummary();

    buildTimeline();

    buildInsights();

}

//======================================
// SUMMARY CARDS
//======================================

function buildSummary(){

    const summary=document.getElementById("summary");

    summary.innerHTML=`

        <div class="summaryCard">

            <h4>⚡ Energy</h4>

            <div class="summaryValue">

                ${game.player.energy}

            </div>

        </div>

        <div class="summaryCard">

            <h4>🧠 Focus</h4>

            <div class="summaryValue">

                ${game.player.focus}

            </div>

        </div>

        <div class="summaryCard">

            <h4>😊 Mood</h4>

            <div class="summaryValue">

                ${game.player.mood}

            </div>

        </div>

    `;

}

//======================================
// TIMELINE
//======================================

function buildTimeline(){

    const container=document.getElementById("timeline");

    container.innerHTML="";

    game.timeline.forEach(item=>{

        const card=document.createElement("div");

        card.className="eventLog";

        card.innerHTML=`<p>${item}</p>`;

        container.appendChild(card);

    });

}

//======================================
// STRESS INSIGHTS
//======================================

function buildInsights(){

    const insights=document.getElementById("insights");

    const energyLost=100-game.player.energy;

    const focusLost=100-game.player.focus;

    const moodLost=100-game.player.mood;

    const total=

        energyLost+

        focusLost+

        moodLost;

    function percent(value){

        if(total===0){

            return 0;

        }

        return Math.round(

            value/total*100

        );

    }

    insights.innerHTML=`

        <div class="insight">

            <div class="insightHeader">

                <span>⚡ Energy Drain</span>

                <span>${percent(energyLost)}%</span>

            </div>

            <div class="insightBar">

                <div

                    class="insightFill"

                    style="width:${percent(energyLost)}%">

                </div>

            </div>

        </div>

        <div class="insight">

            <div class="insightHeader">

                <span>🧠 Focus Loss</span>

                <span>${percent(focusLost)}%</span>

            </div>

            <div class="insightBar">

                <div

                    class="insightFill"

                    style="width:${percent(focusLost)}%">

                </div>

            </div>

        </div>

        <div class="insight">

            <div class="insightHeader">

                <span>😊 Mood Impact</span>

                <span>${percent(moodLost)}%</span>

            </div>

            <div class="insightBar">

                <div

                    class="insightFill"

                    style="width:${percent(moodLost)}%">

                </div>

            </div>

        </div>

    `;

    // Reflection

    let reflection="";

    const average=

        (game.player.energy+

        game.player.focus+

        game.player.mood)/3;

    if(average>=80){

        reflection=

        "Excellent resource management. You balanced work demands while protecting your mental resources. Stress wasn't absent—you budgeted it wisely.";

    }

    else if(average>=60){

        reflection=

        "A solid day overall. Some moments drained your resources, but your recovery decisions helped you stay productive.";

    }

    else if(average>=40){

        reflection=

        "Today became reactive rather than intentional. Interruptions and workload gradually depleted your Stress Budget.";

    }

    else{

        reflection=

        "Your Stress Budget was exhausted early. Once resources became low, every new challenge felt harder. This illustrates how unmanaged stress compounds over the day.";

    }

    const box=document.createElement("div");

    box.className="eventLog";

    box.style.marginTop="35px";

    box.innerHTML=`

        <h3>Your Reflection</h3>

        <p style="margin-top:12px">

            ${reflection}

        </p>

    `;

    insights.appendChild(box);

}
