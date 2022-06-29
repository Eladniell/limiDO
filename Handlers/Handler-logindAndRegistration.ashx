<%@ WebHandler Language="C#" Class="Handler" %>

using System;
using System.Web;
using Newtonsoft.Json;
using System.Data;
using System.Data.OleDb;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Net.Mail;
using System.Linq;
using System.Text;

public class Handler : IHttpHandler
{
    SQLClass mySql = new SQLClass();

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string Action = context.Request["Action"];

        switch (Action)
        {
            case "registerNewUser": //רישום משתמש חדש
                                    //קבלת כל הפרטים שנשלחו מהקריאה     
                string NewUsername = context.Request["UserName"];
                string NewUserEmail = context.Request["email"];
                string NewUserPassword = context.Request["password"];
                string validEmailPattern = @"^(?!\.)(""([^""\r\\]|\\[""\r\\])*""|"
                            + @"([-a-z0-9!#$%&'*+/=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)"
                            + @"@[a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]$";
                //אם קיים תוכן בכל אחד מהפרטים     
                if (NewUsername != "" && NewUserEmail != "" && NewUserPassword != "")
                {
                    if (Regex.IsMatch(NewUserEmail, validEmailPattern))
                    {
                        string emailexsist = "SELECT COUNT(*) FROM users WHERE UserMail = '"+ NewUserEmail +"'";
                        DataSet emailexsisttable = mySql.SQLSelect(emailexsist);
                        int it = Convert.ToInt16(emailexsisttable.Tables[0].Rows[0][0]);
                        if ( it == 0)
                        {
                            //שאילתה להוספת היוזר החדש לטבלת היוזרים          
                            string myQueryAddUser = "INSERT INTO users (UserName, UserMail, UserPassword) VALUES ('" + NewUsername + "', '" + NewUserEmail + "', '" + NewUserPassword + "')";
                            //הוספה לטבלה באמצעות המחלקה       
                            mySql.SQLChange(myQueryAddUser);
                            context.Response.Write("actionSucceed");
                        } else
                        {
                            context.Response.Write("Emailexsist");
                        }
                    }
                    else
                    {
                        context.Response.Write("invalidEmail");
                    }
                }
                else
                {
                    context.Response.Write("noData");
                }
                break;

            case "login":
                string TheUserEmail = context.Request["myUserEmail"];
                string TheUserPassword = context.Request["myUserPassword"];
                if (TheUserEmail != "" && TheUserPassword != "")
                {
                    //שאילתה לחיפוש יוזר קיים לפי מייל וסיסמה          
                    string myQueryLogIn = "SELECT ID, UserName FROM users WHERE UserMail= '" + TheUserEmail + "' AND UserPassword= '" + TheUserPassword + "'";
                    //הרצת החיפוש - אם נמצא תופיע הודעת הצלחה       
                    DataSet OpenUser = mySql.SQLSelect(myQueryLogIn);
                    if (OpenUser.Tables[0].Rows.Count != 0)
                    {
                        string jsonUserName = JsonConvert.SerializeObject(OpenUser);
                         //מחזיר את כל הטבלה כמחרוזת ג'ייסון
                        context.Response.Write(jsonUserName);
                    }
                    else
                    {
                        context.Response.Write("noUsresFound");
                    }
                    //else
                    //{
                    //    //אם לא נמצא תופיע הודעת תקלה
                    //    context.Response.Write("loginfailed");
                    //}
                }
                break;

            case "forgotpassword":
                string UserEmail = context.Request["UserEmail"];
                string myQueryForgotpass = "SELECT UserPassword FROM users WHERE UserMail= '" + UserEmail + "'";
                DataSet ShowPass = mySql.SQLSelect(myQueryForgotpass);
                if (ShowPass.Tables[0].Rows.Count != 0)
                {
                    string jsonUserPassword = JsonConvert.SerializeObject(ShowPass.Tables[0].Rows[0][0]);
                    System.Diagnostics.Debug.WriteLine("ערך "+jsonUserPassword);

                    // Command line argument must the the SMTP host.
                    SmtpClient client = new SmtpClient();
                    client.Port = 587;
                    client.Host = "smtp.gmail.com";
                    client.EnableSsl = true;
                    client.Timeout = 10000;
                    client.DeliveryMethod = SmtpDeliveryMethod.Network;
                    client.UseDefaultCredentials = false;
                    client.Credentials = new System.Net.NetworkCredential("info@limi.co.il", "hhmymofnavxhlssx");
                    string mailToSend = UserEmail;

                    MailMessage mm = new MailMessage("doNotreply@domain.com", mailToSend);
                    mm.Subject = "הסיסמא שלך ל-limiDO";
                    mm.Body = jsonUserPassword+"'";
                    mm.IsBodyHtml = true;
                    mm.BodyEncoding = UTF8Encoding.UTF8;
                    mm.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;

                    client.Send(mm);

                    context.Response.Write("passwordsent");
                }
                else
                {
                    context.Response.Write("passwordNotsent");
                }
                break;

            case "processExample":
                string processExampleQuery = "SELECT ProjectName, LastUpdate FROM projects WHERE Id = 4";
                DataSet processExampletext = mySql.SQLSelect(processExampleQuery);
                string jsonprocessExample = JsonConvert.SerializeObject(processExampletext.Tables[0].Rows[0]);
                context.Response.Write(jsonprocessExample);
                break;

        }
    }

    public bool IsReusable
    {
        get

        {
            return true;
        }
    }
}
















