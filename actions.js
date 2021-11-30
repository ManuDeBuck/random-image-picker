let IMAGES = []; // Will put all images in this
const ROUNDS = 1; // Amount of rounds the carousel will shift trough
const CAROUSEL_TIME = 5; // Total time in seconds carousel will spin

const AMOUNT_STEPS = 2;
let CURRENT_STEP = 1;

function previewImages() {
    $("#yourimagestitle").html("Selected images");
    $("#random-image-div").css('display', 'none');

    IMAGES = [];
    const images = $("#images");

    for (let file of document.getElementById("imagesInput").files) {
        let oFReader = new FileReader();
        oFReader.readAsDataURL(file);

        oFReader.onload = function (oFREvent) {
            data = images.html()
            data += `<img class="img-thumbnail thumbnail" src='` + oFREvent.target.result + `'>`
            $("#images").html(data);
            IMAGES.push(oFREvent.target.result);
        };
    }
}

function pickRandomImage() {
    $("#reset-button").prop('disabled', false);
    $("#pick-button").prop('disabled', true);

    const deleteImage = $("#delete-image")[0].checked;
    const directly = $("#show-directly")[0].checked;

    if (!IMAGES.length) {
        $("#information-text").html("No images left");
        $("#random-image-div").css('display', 'none');
    } else {
        const selected = Math.floor(Math.random() * IMAGES.length); // Pick random image
        if (directly) {
            setFinalImage(selected);
        } else {
            doCarousel(selected);
        }
        if (deleteImage) {
            deleteSelectedImage(deleteImage);
        }
    }
}

function doCarousel(selected) {
    const totalCarousel = ROUNDS * IMAGES.length + selected; // Total images that will be shown in carousel
    let durations = computeDurations(totalCarousel); // Compute a list of durations for each image display in the carousel
    doCarouselRec(0, durations);
}

function doCarouselRec(index, durations) {
    index = index % IMAGES.length;
    let randomImage = $("#random-image");
    $("#random-image-div").css('display', '');
    if (durations.length > 0) {
        randomImage.prop("src", IMAGES[index]);
        randomImage.css("background-color", "transparent");
        const duration = durations.shift();
        setTimeout(function () {
            doCarouselRec(index + 1, durations);
        }, duration * 1000);
    } else {
        // Freeze and remove image from list
        setFinalImage(index);
    }
}

function computeDurations(steps) {
    const times = [];
    for (let i = steps; i > 0; i -= 1) {
        times.push(f(i, steps));
    }
    return times;
}

/**
 * Some beautiful math to create a increasing-time effect in the carousel spin
 */
function f(x, steps) {
    const carousel_time = Math.min(CAROUSEL_TIME, IMAGES.length);
    sigm = 0;
    for (let i = 1; i <= steps; i += 1) {
        sigm += Math.log(i);
    }
    a = CAROUSEL_TIME / (steps * Math.log(steps) - sigm)
    c = (CAROUSEL_TIME * Math.log(steps)) / (steps * Math.log(steps) - sigm);
    return -a * Math.log(x) + c;
}

function deleteSelectedImage(index) {
    IMAGES = IMAGES.splice(index, 1);
}

function setFinalImage(index) {
    let randomImage = $("#random-image");
    $("#random-image-div").css('display', '');
    randomImage.prop("src", IMAGES[index]);
    randomImage.css("background-color", "#343a40");
    $("#pick-button").prop('disabled', false);
}

function nextStep() {
    if (CURRENT_STEP < AMOUNT_STEPS) {
        $(`#step-` + CURRENT_STEP).each(function () {
            $(this).css("display", "none");
        })
        $(`#step-` + (CURRENT_STEP + 1)).each(function () {
            $(this).css("display", "");
        });
        clearStep(CURRENT_STEP);
        CURRENT_STEP++;
        if (!IMAGES.length) {
            $("#information-text").html("No images left");
            $("#reset-button").prop('disabled', false);
            $("#pick-button").prop('disabled', true);
            $("#random-image-div").css('display', 'none');
        } else {
            $("#pick-button").prop('disabled', false);
            $("#reset-button").prop('disabled', true);
        }
    }
}

function previousStep() {
    if (CURRENT_STEP > 0) {
        IMAGES = [];
        $(`#step-` + CURRENT_STEP).each(function () {
            $(this).css("display", "none");
        })
        $(`#step-` + (CURRENT_STEP - 1)).each(function () {
            $(this).css("display", "");
        });
        clearStep(CURRENT_STEP);
        CURRENT_STEP--;
        $("#reset-button").prop('disabled', true);
    }
}

function clearStep(step) {
    $(`.step-` + step + `-clear`).each(function () {
        $(this).html("");
    });
}