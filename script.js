function AlertPopup(str) {
    alert(str);
  }

function ValidateInputs(orderDate, productType, quantity){
    var currentDate = new Date(Date.now()).getDate() + 1;
    if(isNaN(orderDate)){
        AlertPopup("Please enter a date value!");
    }
    else if(orderDate < currentDate){
        AlertPopup("please enter a non-old date value!");
    }
    else if(productType !== "cotton" || productType !== "linen"){ // It doesnt work as expected
        AlertPopup("Please select a valid product type! (Cotton or Linen)");
    }
    else if(quantity < 1 || quantity > 100){
        AlertPopup("Please enter a valid quantity! (1-100)");
    }
    else{
        return true;
    }

    return true;
}

function VerifyHoliday(date){
    var holiday = false;

    if(date.GetDay() == 0 || date.GetDate() == 6){
        holiday = true;
    }

    var url = "https://api.calendario.com.br/?json=true&ano=2018&estado=SP&cidade=MOGI_GUACU&token=ZGdvLmRpZWdvY2FydmFsaG9AZ21haWwuY29tJmhhc2g9MTYzMjcxMDY3";
    var day = (date.getDate() < 10) ? "0"+date.getDate() : date.getDate();
    var dateString = day + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();

    //====================================================
    var holidays = [];
    $.getJSON(url).then(function (data) {
      for(var i = 0; i < data.length; i++){
        var obj = {day: data[i].date, name: data[i].name};
        holidays[i] = obj;
      }
    });

    for(var i = 0; i < holidays.length; i++){
      if(holidays[i].day == dateString){
          holiday = true;
          break;
      }
    }

    return holiday;
}

function CalculateDate(orderDate, addDays){
    var shippingDate = new Date(orderDate);
    while(addDays > 0){
        shippingDate = shippingDate.GetDate() + 1;
        if(VerifyHoliday(shippingDate)){
            addDays = addDays - 1;
        }
    }
    return shippingDate;
}


function OnClick() {
    var orderDateElement = document.getElementById("datepicker");
    var orderDate = new Date(orderDateElement.value);

    const productTypeElement = document.getElementById("productstyle");
    var productType = productTypeElement.value.toLowerCase();

    const quantityElement = document.getElementById("productnumber");
    var quantity = parseInt(quantityElement.value);

    const resultTxt = document.getElementById("resultText");

    if(ValidateInputs(orderDate, productType, quantity))
    {
        var addDays;

        if(productType == "cotton" && quantity < 50){
            addDays = 2;
        }
        else if(productType == "cotton"){ // it must be greater or equal than 50 anyways
            addDays = 3;
        }
        else if(productType == "linen" && quantity < 50){
            addDays = 4;
        }
        else if(productType == "linen"){ // it must be greater or equal than 50 anyways
            addDays = 5;
        }

        var shippingDate = CalculateDate(orderDate, addDays);

        resultTxt.innerText = shippingDate.toString();
    }
}

var calculateBtn = document.getElementById("calculateBtn");
calculateBtn.addEventListener('click', function(){ OnClick(); });

