let IMAGES = []; // Will put all images in this
const ROUNDS = 1; // Amount of rounds the carousel will shift trough
const CAROUSEL_TIME = 5; // Total time in seconds carousel will spin

function loadImages() {
    $("#start-button").prop("disabled", false);

    $("#yourimagestitle").html("Selected images");
    $("#random-image-div").css("display", "none");
    const images = $("#images");

    for (let file of document.getElementById("imagesInput").files) {
        let oFReader = new FileReader();
        oFReader.readAsDataURL(file);

        oFReader.onload = function (oFREvent) {
            data = images.html()
            data += `<img alt="imagepicker.org carousel image" class="img-thumbnail thumbnail" src="${oFREvent.target.result}">`
            $("#images").html(data);
            IMAGES.push(oFREvent.target.result);
        };
    }

    pa.track({name: 'Load images', value: IMAGES.length});
}

function pickRandomImage() {
    $("#reset-button").prop("disabled", false);
    $("#pick-button").prop("disabled", true);

    const deleteImage = $("#delete-image")[0].checked;
    const directly = $("#show-directly")[0].checked;

    if (!IMAGES.length) {
        $("#information-text").html("No images left");
        $("#random-image-div").css("display", "none");
    } else {
        const selected = Math.floor(Math.random() * IMAGES.length); // Pick random image
        if (directly) {
            setFinalImage(selected, deleteImage);
        } else {
            doCarousel(selected, deleteImage);
        }
    }
}

function doCarousel(selected, deleteImage) {
    pa.track({name: 'Do Carousel', value: IMAGES.length});
    const totalCarousel = ROUNDS * IMAGES.length + selected; // Total images that will be shown in carousel
    const durations = computeDurations(totalCarousel); // Compute a list of durations for each image display in the carousel
    doCarouselRec(0, durations, deleteImage);
}

function doCarouselRec(index, durations, deleteImage) {
    index = index % IMAGES.length;
    const randomImage = $("#random-image");
    $("#random-image-div").css("display", "");
    if (durations.length > 0) {
        randomImage.prop("src", IMAGES[index]);
        randomImage.removeClass("random-selected");
        const duration = durations.shift();
        setTimeout(function () {
            doCarouselRec(index + 1, durations, deleteImage);
        }, duration * 1000);
    } else {
        // Freeze and remove image from list
        setFinalImage(index, deleteImage);
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
    IMAGES.splice(index, 1);
}

function setFinalImage(index, deleteImage) {
    let randomImage = $("#random-image");
    $("#random-image-div").css("display", "");
    randomImage.prop("src", IMAGES[index]);
    randomImage.addClass("random-selected");
    $("#pick-button").prop("disabled", false);
    if (deleteImage) {
        deleteSelectedImage(index);
    }
}

function start() {
    $(`#step-1`).each(function () {
        $(this).css("display", "none");
    })
    $(`#step-2`).each(function () {
        $(this).css("display", "");
    });
    $(`.step-1-clear`).each(function () {
        $(this).html("");
    });

    if (!IMAGES.length) {
        $("#information-text").html("No images left");
        $("#reset-button").prop("disabled", false);
        $("#pick-button").prop("disabled", true);
        $("#random-image-div").css("display", "none");
    } else {
        $("#pick-button").prop("disabled", false);
        $("#reset-button").prop("disabled", true);
    }
}

function reset() {
    IMAGES = [];
    $(`#step-1`).each(function () {
        $(this).css("display", "");
    });
    $(`#step-2`).each(function () {
        $(this).css("display", "none");
    })
    $(`.step-2-clear`).each(function () {
        $(this).html("");
    });
    $("#reset-button").prop("disabled", true);
    $("#start-button").prop("disabled", true);
}