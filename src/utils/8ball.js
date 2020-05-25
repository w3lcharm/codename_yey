const answers = {
    "true": [
        "It is certain",
        "Without a doubt",
        "Yes",
        "Yes — definitely",
        "It is decidedly so",
        "You may rely on it",
        "As I see it, yes",
        "Most likely",
        "Outlook good",
        "Signs point to yes"
    ],
    "false": [
        "Don’t count on it",
        "No",
        "Outlook not so good",
        "Very doubtful",
        "My sources say no"
    ]
};

const answersRU = {
    "true": [
            "Бесспорно",
        "Без сомнений",
        "Да",
        "Определенно да",
        "Можешь быть уверен(а) в этом",
        "Предрешено",
        "Мне кажется - да",
        "Вероятнее всего",
        "Хорошие перспективы",
        "Знаки говорят - да",
    ],
    "false": [
        "Даже не думай",
        "Нет",
        "Перспективы не очень хорошие",
        "Весьма сомнительно",
        "По моим данным, нет",
    ],
};

const failAnswers = [
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again"
];

const failAnswersRU = [
    "Пока не ясно, попробуй снова",
    "Спроси позже",
    "Лучше не рассказывать",
    "Сейчас нельзя предсказать",
    "Сконцентрируйся и спроси опять",
];

const life = 42;
const vals = [4, 9, 6, 2, 5, 8, 1];

const ansMapping = [
    true, true, true, true, true, true, true, true,
    true, true, false, false, false, false, false
];

function getRandom(arr) {
    return arr[Math.round(Math.random() * (arr.length - 1))];
}

function getNth(arr, n) {
    return arr[Math.abs(n) % arr.length];
}

function hashCode(s) {
    var h = 0, l = s.length, i = 0;
    if (l > 0)
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
};

function predict(question, failChance, seed = 1, lang = "en") {
    const clQuestion = question.toLowerCase()
        .replace(/[.,:;!?\s@#$%^&*()_+\-=]/g, "");
    if (Math.random() <= failChance)
        return getRandom(lang == "en" ? failAnswers : failAnswersRU);

    const isPos = getNth(ansMapping, hashCode(clQuestion) + (seed *
        Math.round(life / getNth(vals, seed))));
    return getRandom(lang == "en" ? answers[isPos] : answersRU[isPos]);
}

module.exports = {
    predict
};
