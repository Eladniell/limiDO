$(document).ready(function () {

    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

    $("#flexSwitchCheckDefault").change(function () {
        if (flexSwitchCheckDefault.checked) {
            $(".span1").css("background","#FFF29C");
            $(".span2").css("background", "#E1A3CE");
            $(".span3").css("background", "#C5E7E4");
            $(".span4").css("background", "#CACACA");
        } else {
            $(".span1").css("background", "none");
            $(".span2").css("background", "none");
            $(".span3").css("background", "none");
            $(".span4").css("background", "none");
        }
    })
    $("#impactBTN").click(function () {
        var myUserImpactOnJS = $("#impactTxtHtml").val();
        if ($("#flexCheckDefault1").is(":checked")) {
            userSelectionsProblemOnJS = true;
            }
        else {
            userSelectionsProblemOnJS = false;
        }

        if ($("#flexCheckDefault2").is(":checked")) {
            userSelectionsSolutionOnJS = true;
        }
        else {
            userSelectionsSolutionOnJS = false;
        }

        if ($("#flexCheckDefault3").is(":checked")) {
            userSelectionsPerformanceOnJS = true;
        }
        else {
            userSelectionsPerformanceOnJS = false;
        }

        if ($("#flexCheckDefault4").is(":checked")) {
            userSelectionsRoiroxOnJS = true;
        }
        else {
            userSelectionsRoiroxOnJS = false;
        }

        $.ajax({
            method: "POST",
            url: "Handlers/Handler-impact.ashx",
            data: { Action: "sendImpact", userImpactOnHandler: myUserImpactOnJS, userSelectionsProblemOnHandler: userSelectionsProblemOnJS, userSelectionsSolutionOnHandler: userSelectionsSolutionOnJS, userSelectionsPerformanceOnHandler: userSelectionsPerformanceOnJS, userSelectionsRoiroxOnHandler: userSelectionsRoiroxOnJS }
            //לפי פה : לפי הנדלר
        })
            .done(function (data) { //ברגע שהפעולה הסתיימה   
                if (data == "actionSucceed") {
                    $("#impactDiv").html("האימפקט פסקה וצ'קבוקס נוספו בהצלחה");
                } else if (data == "ImpactExists") {
                    $.ajax({
                        method: "GET",
                        url: "Handlers/Handler-impact.ashx",
                        data: { Action: "getoldImpact" } //שליחת שם הפעולה שתתבצע בהנדלר
                    })
                        .done(function (data) { //ברגע שהפעולה הסתיימה   
                            $('#exampleModalCenter').modal('show');
                            $("#old-impact").text(data);
                            $("#new-impact").text(myUserImpactOnJS);
                        })
                    $("#change-impact").click(function () {
                        $.ajax({
                            method: "POST",
                            url: "Handlers/Handler-impact.ashx",
                            data: { Action: "updateImpact", userImpactOnHandler_update: myUserImpactOnJS, userSelectionsProblemOnHandler_update: userSelectionsProblemOnJS, userSelectionsSolutionOnHandler_update: userSelectionsSolutionOnJS, userSelectionsPerformanceOnHandler_update: userSelectionsPerformanceOnJS, userSelectionsRoiroxOnHandler_update: userSelectionsRoiroxOnJS }
                            //לפי פה : לפי הנדלר
                        })
                    })

                } else if (data == "noData") {
                    $("#impactDiv").html("האימפקט לא נוסף");
                }
            })
            .fail(function (error) { //במצב של שגיאה  
                console.log("error");
                console.log(error.statusText);
            })

    });
        });