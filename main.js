async function sleep(time) {
    return new Promise((res) => setTimeout(res, time));
}

function Hanoi(numberDisks, origin, helper, target) {
    if (numberDisks == 1) {
        return [[origin, target]];
    } else {
        return [
            ...Hanoi(numberDisks - 1, origin, target, helper),
            ...Hanoi(1, origin, helper, target),
            ...Hanoi(numberDisks - 1, helper, origin, target),
        ];
    }
}

let delay = 1000;
let diskNumber = 5;

function init(number) {
    diskNumber = number;
    $(".disk").remove();
    $("#game").css("--diskNumber", number);
    for (let i = 1; i <= number; i++) {
        $("<div></div>")
            .addClass("disk")
            .css("--size", i)
            .appendTo(".A");
    }
}

init(diskNumber);

$("#diskInput").change(function () {
    init(parseInt($(this).val()));
});

$("#delayInput").change(function () {
    delay = parseInt($(this).val());
});

$("#startBtn").click(async function () {
    $(`.disk`).appendTo(".A");
    $("button, select").prop("disabled", true);
    const hanoiSequence = Hanoi(diskNumber, "A", "B", "C");
    for (let i = 0; i < hanoiSequence.length; i++) {
        await sleep(delay);
        const [source, target] = hanoiSequence[i];
        const disk = $(`.${source}`).children()[0];
        $(disk).prependTo(`.${target}`);
    }
    $("button, select").prop("disabled", false);
});
