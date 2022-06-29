$(document).ready(function () {
    var userIDOnJs = sessionStorage.getItem("userId");// שליפת איידי המשתמש מהסשן
    var userName = sessionStorage.getItem("userName");// שליפת שם המשתמש המשתמש מהסשן
    console.log(userIDOnJs);
    console.log(userName);

    $.ajax({
        method: "GET",
        url: "Handlers/Handler-userHomePage.ashx",
        data: { Action: "getProjects", userIdOnHandler: userIDOnJs }
    })
        .done(function (data) {

            if (data == "noProjects") {
                $("#userProjectsDiv").html("לא קיימים פרויקטים");
            }
            else {
                $("#userProjectsDiv").html("יש פרויקטים");
                var myUserData = JSON.parse(data); //קליטת פרטי המשתמש מהבסיס נתונים                console.log(data)
                console.log(myUserData)

            }

        })

  
        });