$(document).ready(function () {
    //רישום יוזר חדש

    $("#loginBTN").attr("disabled", true);
    $("#registerBTN").attr("disabled", true);

    //בדיקה להפיכת הכפתור לזמין בכל לחיצת מקש בשדות הרלוונטים  
    $("#UserEmailTxt").keyup(function () {
        canClick1();
    });
    $("#UserPasswordTxt").keyup(function () {
        canClick1();
    });

    $("#userfullnameTxt").keyup(function () {
        canClick2();
    });
    $("#NewUserEmail").keyup(function () {
        canClick2();
    });
    $("#Password2").keyup(function () {
        canClick2();
    });

    //קוד של חשיפת והסתרת סיסמה
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#UserPasswordTxt');

    togglePassword.addEventListener('click', function (e) {
        // toggle the type attribute
        const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
        password.setAttribute('type', type);
        // toggle the eye slash icon
        this.classList.toggle('fa-eye-slash');
    });


    function canClick1() {
        //הכנסת תוכן השדות למשתנים
        var inputMail = $("#UserEmailTxt").val();
        var inputPassword = $("#UserPasswordTxt").val();

        if (inputMail != "" && inputPassword != "") {//בדיקה האם הוקלד משהו בשדות
            //הפיכת כפתור כניסה לפעיל
            $("#loginBTN").prop('disabled', false);

        }
        else {
            //הפיכת כפתור כניסה ללא פעיל
            $("#loginBTN").prop('disabled', true);
        }
    }

    document.querySelectorAll('.signInInput').forEach(input => {
        input.addEventListener(('input'), () => {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid')
                input.classList.add('is-valid');
                $("#loginBTN").attr("disabled", false);
            } else {
                input.classList.remove('is-valid')
                input.classList.add('is-invalid');
            }
            var is_valid = $('.signInInput').length === $('.signInInput.is-valid').length;
            $("#loginBTN").attr("disabled", !is_valid);
        });
    });

    function canClick2() {
        //הכנסת תוכן השדות למשתנים
        var inputName = $("#userfullnameTxt").val();
        var inputMail = $("#NewUserEmail").val();
        var inputPassword = $("#Password2").val();

        if (inputName != "" && inputMail != "" && inputPassword != "") {//בדיקה האם הוקלד משהו בשדות
            //הפיכת כפתור כניסה לפעיל
            $("#registerBTN").prop('disabled', false);

        }
        else {
            //הפיכת כפתור כניסה ללא פעיל
            $("#registerBTN").prop('disabled', true);
        }
    }


    document.querySelectorAll('.registrationInput').forEach(input => {
        input.addEventListener(('input'), () => {
            if (input.checkValidity()) {
                input.classList.remove('is-invalid')
                input.classList.add('is-valid');
                $("#registerBTN").attr("disabled", false);
            } else {
                input.classList.remove('is-valid')
                input.classList.add('is-invalid');
            }
            var is_valid = $('.registrationInput').length === $('.registrationInput.is-valid').length;
            $("#registerBTN").attr("disabled", !is_valid);
        });
    });

    $("#registerBTN").click(function () {
        //שמירת כל הפרטים ליצירת יוזר חדש  
        var myUsername = $("#userfullnameTxt").val();
        var myEmail = $("#NewUserEmail").val();
        var myPass = $("#Password2").val();

        $.ajax({
            method: "POST",
            url: "Handlers/Handler-logindAndRegistration.ashx",
            data: { Action: "registerNewUser", UserName: myUsername, email: myEmail, password: myPass }
        })

            .done(function (data) {
                if (data == "invalidEmail") {
                    $("#userRegisterDiv").html("אימייל שגוי");
                }
                else if (data == "actionSucceed") {
                    $("#userRegisterDiv").html("המשתמש נוסף בהצלחה");
                }
                else if (data == "Emailexsist") {
                    $("#userRegisterDiv").html("כתובת המייל קיימת במערכת");
                }
                else {
                    $("#userRegisterDiv").html("המשתמש לא נוצר");
                }
            })
            .fail(function (error) { //במצב של שגיאה  
                console.log("error");
                console.log(error.statusText);
            })
    });



    $("#loginBTN").click(function () {

        var UserEmail = $("#UserEmailTxt").val();
        var UserPassword = $("#UserPasswordTxt").val();
        alert(UserEmail + UserPassword);

        $.ajax({
            method: "GET",
            url: "Handlers/Handler-logindAndRegistration.ashx",
            data: { Action: "login", myUserEmail: UserEmail, myUserPassword: UserPassword }
        })
            .done(function (data) {

                if (data == "noUsresFound") {
                    $("#loginDiv").html("ההתחברות לא הצליחה");
                }
                else {
                    $("#loginDiv").html("ההתחברות הצליחה");
                    var myUserData = JSON.parse(data); //קליטת פרטי המשתמש מהבסיס נתונים                    sessionStorage.setItem("userId", myUserData.Table[0].ID);//שמירה של איידי בסשן
                    sessionStorage.setItem("userName", myUserData.Table[0].UserName);//שמירה של שם משתמש בסשן
                    console.log(data)
                    console.log(myUserData)
                    window.location.href = "userHomePage.html"; //מעבר לדף הראשי של המשתמש

                }

            })




            .fail(function (error) { //במצב של שגיאה  
                console.log("error");
                console.log(error.statusText);
            })
    });
    $("#forgotPassInputs").hide();
    $("#forget-pass").click(function () {
        $("#forgotPassInputs").show();
        $("#forgotPassInputs").css("background", "#F2F4F3");
        $("#closeForgotPass").click(function () {
            $("#forgotPassInputs").hide();
        });
    });

    $("#forgotPassBTN").click(function () {
        var inputMail2 = $("#UserEmail2Txt").val();
        alert(inputMail2);
        $.ajax({
            method: "POST",
            url: "Handlers/Handler-logindAndRegistration.ashx",
            data: { Action: "forgotpassword", UserEmail: inputMail2 }
        })
            .done(function (data) {
                if (data == "passwordNotsent") {
                    $("#passwordfeedback").html("הסיסמא לא נשלחה");
                }
                if (data == "passwordsent") {
                    $("#passwordfeedback").html("הסיסמא נשלחה");
                }
            })

            .fail(function (error) { //במצב של שגיאה  
                console.log("error");
                console.log(error.statusText);
            })
    });
});
document.addEventListener('DOMContentLoaded', function (event) {
    // array with texts to type in typewriter
    var dataText = ["כתיבת פסקת אימפקט.", "בניית תוכנית אבחון.", "בחירת עקרונות למידה.", "בחירת פתרונות למידה."];

    // type one text in the typwriter
    // keeps calling itself until the text is finished
    function typeWriter(text, i, fnCallback) {
        // chekc if text isn't finished yet
        if (i < (text.length)) {
            // add next character to h1
            document.getElementById("typing").innerHTML = text.substring(0, i + 1) + '<span aria-hidden="true"></span>';

            // wait for a while and call this function again for next character
            setTimeout(function () {
                typeWriter(text, i + 1, fnCallback)
            }, 100);
        }
        // text finished, call callback if there is a callback function
        else if (typeof fnCallback == 'function') {
            // call callback after timeout
            setTimeout(fnCallback, 3000);
        }
    }
    // start a typewriter animation for a text in the dataText array
    function StartTextAnimation(i) {
        if (typeof dataText[i] == 'undefined') {
            setTimeout(function () {
                StartTextAnimation(0);
            }, 3000);
        }
        // check if dataText[i] exists
        if (i < 4) {
            // text exists! start typewriter animation
            typeWriter(dataText[i], 0, function () {
                // after callback (and whole text has been animated), start next text
                StartTextAnimation(i + 1);
            });
        }
    }
    // start the text animation
    StartTextAnimation(0);

    $.ajax({
        method: "GET",
        url: "Handlers/Handler-logindAndRegistration.ashx",
        data: { Action: "processExample"} //שליחת שם הפעולה שתתבצע בהנדלר
    })
        .done(function (data) { //ברגע שהפעולה הסתיימה   
            console.log(data);
            obj = JSON.parse(data);
            console.log(obj);
            for (i = 0; i < obj.Table.length; i++) {
                console.log(obj.Table[i])
                $("#ProjectName-div").text(obj.Table[0].ProjectName)
                console.log(obj.Table[0].ProjectName)
                var today = obj.Table[0].LastUpdate;
            }
            var todayyy = new Date(today);
            $("#LastUpdate-div").text(todayyy.toLocaleDateString("he-IL"))
        })
});