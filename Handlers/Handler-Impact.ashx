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
    int projectId = 3;

    public void ProcessRequest(HttpContext context)
    {
        context.Response.ContentType = "text/plain";
        string Action = context.Request["Action"];

        switch (Action)
        {
            case "sendImpact": //הזנת האימפקט

                //בדיקה האם קיים פרויקט כזה כבר בטבלה 
                //משתנה שמקבל את הת.ז של הפרויקט
                //משתנה שמקבל שאילתה שבודקת האם קיים פרויקט כזה
                string isThisProjectExist = "SELECT ProjectId FROM impacts WHERE ProjectId = " + projectId + " ";
                DataSet ProjectExist = mySql.SQLSelect(isThisProjectExist);
                //משתנים לקבלת הנתונים מהצ'קבוקס
                string userSelectionsProblem = context.Request["userSelectionsProblemOnHandler"];
                string userSelectionsSolution = context.Request["userSelectionsSolutionOnHandler"];
                string userSelectionsPerformance = context.Request["userSelectionsPerformanceOnHandler"];
                string userSelectionsRoirox = context.Request["userSelectionsRoiroxOnHandler"];
                //משתנה לקבלת פסקת האימפקט שהוקלדה
                string newUserImpact = context.Request["userImpactOnHandler"];
                //שאילתה לעדכון
                //string myQueryUpdateImpactChekBoxAndText = "UPDATE impacts SET ImpactText = '" + newUserImpact + "', problem = " + userSelectionsProblem + ", solution = " + userSelectionsSolution + ", performance = " + userSelectionsPerformance + ", roirox = " + userSelectionsRoirox + " WHERE ProjectId = 3";
                //שאילתה להזנה חדשה
                string myQueryAddImpactChekBoxAndText = "INSERT INTO impacts (ProjectId, ImpactText, problem, solution, performance, roirox) VALUES (" + projectId + ", '" + newUserImpact + "', " + userSelectionsProblem + ", " + userSelectionsSolution + ", " + userSelectionsPerformance + ", " + userSelectionsRoirox + ")";
                //שאילתה להוספת האימפקט לטבלת האימפקטים          
                string myQueryAddImpact = "INSERT INTO impacts (ImpactText) VALUES (" + projectId + ", '" + newUserImpact + "')";


                //אם הערך שחזר מבדיקת הטבלה אינו ריק
                if (ProjectExist.Tables[0].Rows.Count != 0)
                {
                    //אם כבר קיים השם פרויקט הזה אז כבר יש פסקת אימפקט
                    context.Response.Write("ImpactExists");
                }
                else
                {
                    if (newUserImpact != "")
                    {
                        mySql.SQLChange(myQueryAddImpactChekBoxAndText);
                        context.Response.Write("actionSucceed");
                    }
                    else
                    {
                        context.Response.Write("noData");

                    }

                }

                break;

            case "getoldImpact":
                string oldimpacttextQuery = "SELECT ImpactText FROM impacts WHERE ProjectId = " + projectId + "";
                DataSet oldimpacttext = mySql.SQLSelect(oldimpacttextQuery);
                string jsonUsersimpact = JsonConvert.SerializeObject(oldimpacttext.Tables[0].Rows[0][0]);
                System.Diagnostics.Debug.WriteLine(jsonUsersimpact);
                context.Response.Write(jsonUsersimpact);
                break;

            case "updateImpact":
                string new_userSelectionsProblem = context.Request["userSelectionsProblemOnHandler_update"];
                string new_userSelectionsSolution = context.Request["userSelectionsSolutionOnHandler_update"];
                string new_userSelectionsPerformance = context.Request["userSelectionsPerformanceOnHandler_update"];
                string new_userSelectionsRoirox = context.Request["userSelectionsRoiroxOnHandler_update"];
                string update_UserImpact = context.Request["userImpactOnHandler_update"];
                string myQueryUpdateImpactChekBoxAndText = "UPDATE impacts SET ImpactText = '" + update_UserImpact + "', problem = " + new_userSelectionsProblem + ", solution = " + new_userSelectionsSolution + ", performance = " + new_userSelectionsPerformance + ", roirox = " + new_userSelectionsRoirox + " WHERE ProjectId = 3";
                //הוספת השאילתה של עדכון הצ'קבוקסים לתוך הטבלה
                mySql.SQLChange(myQueryUpdateImpactChekBoxAndText);
                context.Response.Write("actionSucceed");
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
















