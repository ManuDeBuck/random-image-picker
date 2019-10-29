const images = [];
let lastSelectedIndex = -1;
let curStep = 1;
let amountSteps = 2;

function previewImages() {
  $("#yourimagestitle").html("Images selected by you");
  lastSelectedIndex = -1;
  for (let file of document.getElementById("imagesInput").files){
    var oFReader = new FileReader();
    oFReader.readAsDataURL(file);

    oFReader.onload = function (oFREvent) {
      data = $("#images").html()
      data += `<img class="img-thumbnail thumbnail" src='` + oFREvent.target.result + `'>`
      $("#images").html(data);
      images.push(oFREvent.target.result);
    };
  }
}

function pickRandomImage() {
  if(! images.length){
    $("#information-text").html("No images left");
    $("#random-image").html("");
  }
  if(images.length > 0){
    lastSelectedIndex = Math.floor(Math.random()*images.length);
    data = `<img class="img-thumbnail random-image" src="` + images[lastSelectedIndex] + `">`;
    $("#random-image").html(data);

    images.splice(lastSelectedIndex, 1);
  }
}

function nextStep() {
  if (curStep < amountSteps){
    $(`#step-` + curStep).css("display", "none");
    $(`#step-` + (curStep + 1)).css("display", "");

    clearStep(curStep);
    curStep ++;
  }
}

function previousStep() {
  if (curStep > 0){
    $(`#step-` + curStep).css("display", "none");
    $(`#step-` + (curStep - 1)).css("display", "");

    clearStep(curStep);
    curStep --;
  }
}

function clearStep(step) {
  $(`.step-`+ step + `-clear`).each(function() {
    $(this).html("");
  });
}