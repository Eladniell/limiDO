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
            case "getProjects": //קבלה של יוזר איידי

                string userId = context.Request["userIdOnHandler"];

                string getUserProjects = "SELECT * FROM projects WHERE UserId = " + userId + " ";
                DataSet userProjects = mySql.SQLSelect(getUserProjects);

                //אם הערך שחזר מבדיקת הטבלה אינו ריק
                if (userProjects.Tables[0].Rows.Count != 0)
                {
                    //אם חוזר ערך = יש למשתמש פרויקטים
                      string jsonUserprojects = JsonConvert.SerializeObject(userProjects);
                         //מחזיר את כל הטבלה כמחרוזת ג'ייסון
                        context.Response.Write(jsonUserprojects);
                }
                else
                {
                        context.Response.Write("noProjects");

                }

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
















