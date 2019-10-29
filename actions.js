const IMAGES = [];
const AMOUNT_STEPS = 2;
const SPEED = 500;
const PERCENT_SPEED = 0.99;
const ROUNDS = 3;

let lastSelectedIndex = -1;
let curStep = 1;

function previewImages() {
  $("#yourimagestitle").html("Images selected by you");
  $("#usage").html("");
  lastSelectedIndex = -1;
  for (let file of document.getElementById("imagesInput").files){
    var oFReader = new FileReader();
    oFReader.readAsDataURL(file);

    oFReader.onload = function (oFREvent) {
      data = $("#images").html()
      data += `<img class="img-thumbnail thumbnail" src='` + oFREvent.target.result + `'>`
      $("#images").html(data);
      IMAGES.push(oFREvent.target.result);
    };
  }
}

function pickRandomImage() {
  if(! IMAGES.length){
    $("#information-text").html("No images left");
    $("#random-image").html("");
  }
  if(IMAGES.length > 0){
    lastSelectedIndex = Math.floor(Math.random()*IMAGES.length);
    doCarousel(0, ROUNDS, lastSelectedIndex)
  }
}

function doCarousel(index, rounds_remaining, final) {
  if(index < IMAGES.length){
    data = `<img class="img-thumbnail random-image" src="` + IMAGES[index] + `">`;
    $("#random-image").html(data);
    setTimeout(function() {
      doCarousel(index + 1, rounds_remaining, final);
    }, (SPEED - (((rounds_remaining * IMAGES.length ) + index) / (IMAGES.length * ROUNDS)) * (SPEED * PERCENT_SPEED)));
  } else {
    if (rounds_remaining > 0){
      doCarousel(0, rounds_remaining - 1, final)
    } else {
      data = `<img class="img-thumbnail random-image" src="` + IMAGES[final] + `">`;
      $("#random-image").html(data);
      IMAGES.splice(final, 1);
    }
  }
}

function nextStep() {
  if (curStep < AMOUNT_STEPS){
    $(`#step-` + curStep).each(function() {
      $(this).css("display", "none");
    })
    $(`#step-` + (curStep + 1)).each(function() {
      $(this).css("display", "");
    });
    clearStep(curStep);
    curStep ++;
  }
}

function previousStep() {
  if (curStep > 0){
    $(`#step-` + curStep).each(function() {
      $(this).css("display", "none");
    })
    $(`#step-` + (curStep - 1)).each(function() {
      $(this).css("display", "");
    });
    clearStep(curStep);
    curStep --;
  }
}

function clearStep(step) {
  $(`.step-`+ step + `-clear`).each(function() {
    $(this).html("");
  });
}