const quizData = [{
        id: 1,
        question: "What's your age ?",
        type: "text",
        tag: "age_name",
        answer: "",
    },
    {
        id: 2,
        question: `Select your gender: `,
        a: "Male",
        b: "Female",
        type: "radio",
        tag: "sex_name",
        answer: "",
    },
    {
        id: 3,
        question: "Select the type of chest pain you have: ",
        a: "ASY (Asystole)",
        b: "NAP (Neutrophil Activation Probe)",
        c: "ATA (Anterior Tibial Artery)",
        d: "TA (Takayasu Arteritis)",
        type: "radio",
        tag: "chestpaintype_name",
        answer: "",
    },
    {
        id: 4,
        question: "Enter your resting blood pressure (resting BP):",
        type: "text",
        tag: "restingbp_name",
        answer: "",
    },
    {
        id: 5,
        question: "Enter your LDL cholestrol (Low-Density Lipoprotein): ",
        type: "text",
        tag: "cholestrol_name",
        answer: "",
    },
    {
        id: 6,
        question: "Do you have Fasting Blood Sugar (FBS) more than 125 mg/dL ?:",
        a: "True",
        b: "False",
        type: "radio",
        tag: "fastingbs_name",
        answer: "",
    },
    {
        id: 7,
        question: "Select type of your resting Electrocardiogram (Resting ECG) :  ",
        a: "Normal",
        b: "LVH (Left Ventricular Hypertrophy)",
        c: "ST (ST-Segment)",
        type: "radio",
        tag: "restingecg_name",
        answer: "",
    },
    {
        id: 8,
        question: "Enter your maximum heart rate (Max HR) : ",
        type: "text",
        tag: "maxhr_name",
        answer: "",
    },
    {
        id: 9,
        question: "Do you have exercise angina ?",
        a: "Yes",
        b: "No",
        type: "radio",
        tag: "exerciseangina_name",
        answer: "",
    },
    {
        id: 10,
        question: "Enter your old peak value: ",
        type: "text",
        tag: "oldpeak_name",
        answer: "",
    },
    {
        id: 11,
        question: "Select type of your ST-Segment Slope: ",
        a: "UP",
        b: "FLAT",
        c: "DOWN",
        type: "radio",
        tag: "st_slope_name",
        answer: "",
    },
];

const answer = {
    age: 0,
    gender: "",
    chestPainType: "",
    restingBP: "",
    cholestrol: "",
    fastingBP: "",
}

const quiz = document.getElementById("quiz");
const answerEls = document.querySelectorAll(".answer");
const questionEl = document.getElementById("question");
const a_text = document.getElementById("a_text");
const b_text = document.getElementById("b_text");
const c_text = document.getElementById("c_text");
const d_text = document.getElementById("d_text");
const submitBtn = document.getElementById("submit");
const previousBtn = document.getElementById("previous");
const ul_radio = document.getElementById("ul_radio");
const answerTextBox = document.getElementById("answer_field");
const radio_a = document.getElementById("radio_a");
const radio_b = document.getElementById("radio_b");
const radio_c = document.getElementById("radio_c");
const radio_d = document.getElementById("radio_d");
const type = document.getElementById("type");
const authEl = document.getElementById("auth");

let currentQuiz = 0;
let score = 0;
const optionMpping = { a: 0, b: 1, c: 2, d: 3 };

setSessionStorage()

loadQuiz("next");

function loadQuiz(direction) {
    if (direction === "next") {
        deselectAnswers();
    } else {
        prevAnswer();
    }

    const currentQuizData = quizData[currentQuiz];
    questionEl.innerText = currentQuizData.question;

    if (currentQuizData.type == "radio") {
        ul_radio.style.display = "block";
        answerTextBox.style.display = "none";



        if (currentQuizData.a) {
            radio_a.style.display = "block";
            a_text.innerText = currentQuizData.a;
        } else {
            radio_a.style.display = "none";
        }

        if (currentQuizData.b) {
            radio_b.style.display = "block";
            b_text.innerText = currentQuizData.b;
        } else {
            radio_b.style.display = "none";
        }

        if (currentQuizData.c) {
            radio_c.style.display = "block";
            c_text.innerText = currentQuizData.c;
        } else {
            radio_c.style.display = "none";
        }

        if (currentQuizData.d) {
            radio_d.style.display = "block";
            d_text.innerText = currentQuizData.d;
        } else {
            radio_d.style.display = "none";
        }
    } else if (currentQuizData.type == "text") {
        ul_radio.style.display = "none";
        answerTextBox.style.display = "block";
    }

    if (currentQuizData.id === 11) {
        submitBtn.innerText = "Submit"
    } else {
        submitBtn.innerText = "Next"
    }
}

function deselectAnswers() {
    const currentQuizData = quizData[currentQuiz];
    if (currentQuizData.type == "radio") {
        answerEls.forEach((answerEl) => (answerEl.checked = false));
    }
    if (currentQuizData.type == "text") {
        answerTextBox.value = quizData[currentQuiz].answer;
    }
}

function prevAnswer() {
    const currentQuizData = quizData[currentQuiz]
    if (currentQuizData.type == "radio") {
        answerEls.forEach((answerEl) => {
            if (answerEl.id == currentQuizData.answer) {
                answerEl.checked = true;
            } else {
                answerEl.checked = false;
            }
        })
    } else {
        answerTextBox.value = quizData[currentQuiz].answer;
    }


}

function getSelected() {
    let answer = "";
    const currentQuizData = quizData[currentQuiz];
    if (currentQuizData.type == "radio") {
        answerEls.forEach((answerEl) => {
            if (answerEl.checked) {
                answer = answerEl.id;
                currentQuizData.answer = answer;
            }
        });
    } else {
        answer = answerTextBox.value;
        currentQuizData.answer = answer;

    }
    quizData[currentQuiz].answer = answer;
    answerTextBox.value = "";
    return answer;
}

function getRetrive() {
    let answer = "";
    const currentQuizData = quizData[currentQuiz];
    if (currentQuizData.type == "radio") {
        answerEls.forEach((answerEl) => {
            if (answerEl.checked) {
                answer = answerEl.id;

            }
        });
    } else {
        answer = !answerTextBox.value;
    }
    return answer;

}

function setSessionStorage() {
    let user = authEl.innerText;
    authEl.style.display = "none";
    currentUser = user;
    return;
}

const questionAnswers = [];
const jsonInputData = {};



previousBtn.addEventListener("click", () => {
    const key = quizData[currentQuiz].tag;
    const value = quizData[currentQuiz].type == 'text' ? answer : optionMpping[answer];

    currentQuiz--;

    jsonInputData[key] = value;

    console.log(jsonInputData);

    if (currentQuiz < quizData.length) {
        loadQuiz();
    }
})



submitBtn.addEventListener("click", () => {

    const answer = getSelected();

    if (answer) {

        const key = quizData[currentQuiz].tag;

        const value = quizData[currentQuiz].type == 'text' ? answer : optionMpping[answer];

        currentQuiz++;

        jsonInputData[key] = value;

        console.log(jsonInputData);

        if (currentQuiz < quizData.length) {
            loadQuiz();
        } else {
            fetch('/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jsonInputData)
            }).then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    alert("something is wrong")
                }
            }).then(jsonResponse => {
                console.log({ name: jsonResponse })
                if (jsonResponse[0]) {
                    quiz.innerHTML = `
                <h2>Result</h2>
                <h3> Congratulations ${currentUser} your heart is safe.</h3>
                <button onclick="location.reload()">Reload</button>
            `;
                } else {
                    quiz.innerHTML = `
                <h2>Result</h2>
                <h3>${currentUser} your heart at risk please consult doctor immediately.</h3>
                '<a href="templates/medicen.html">Link</a>';
                <button onclick="location.reload()">Reload</button>
            `;
                }
            }).catch((err) => console.error(err));

            for (let singleValue of quizData) {
                singleValue.answer = ''
            }
        }
    }
});