/**
 * API HANDLER FILE - This helps to connect to the backend.
*/

import {
    useQuery,
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

export async function getTasks(getSession, type, categoryFilter) {
    // var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];

    const { IdToken } = await getSession();

    // If statements will filter to get the correct response type filter
    var response;
    try {

        if(type == "finished")
        {
            response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/finished-tasks`, {
                method: "GET",
                headers: {
                    "Authorization": IdToken,
                    "Content-Type": "application/json"
                },
            });
        } 
        else if(type == "today")
        {
            var startTime = new Date().setHours(0, 0, 0, 0);
            var endTime = new Date().setHours(23, 59, 0, 0);

            response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task-date`, {
                method: "POST",
                headers: {
                    "Authorization":IdToken,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    startdate:  startTime,
                    enddate:    endTime,
                })
            });
        }
        else if (type == "upcoming")
        {
            const UPCOMING_AMOUNT = 3;

            var startDate = new Date();
            var startTime = startDate.valueOf();

            var endDate = new Date().setDate(startDate.getDate() +  UPCOMING_AMOUNT);
            var endTime = endDate.valueOf();

            response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task-date`, {
                method: "POST",
                headers: {
                    "Authorization":IdToken,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    startdate:  startTime,
                    enddate:    endTime,
                })
            });
        }
        else if (type == "past")
        {
            var startTime = 0;

            var endDate = new Date(Date.now() - 1).valueOf();
            var endTime = endDate.valueOf();

            response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task-date`, {
                method: "POST",
                headers: {
                    "Authorization":IdToken,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    startdate:  startTime,
                    enddate:    endTime,
                })
            });
        } else {
            if(categoryFilter && categoryFilter != -1) // -1 is the ALL categories filter
            {
                response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task-category`, {
                    method: "POST",
                    headers: {
                        "Authorization":IdToken,
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        categoryId: categoryFilter
                    })
                    });
            }
            else
            {
                response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task`, {
                    method: "GET",
                    headers: {
                        "Authorization":IdToken,
                        // "Content-Type":"application/json"
                    },
                });
            }
        }

        // **MUST** throw error for react-query to catch!!!
        if(!response.ok)
        {
            throw new Error("ERROR: " + response.status)
        }

        let data = await response.json();

        var formatted_data = [];

        for(var i = 0; i < data.length; i++)
        {
            // Process data to format it
            const {task_id, task_name, category_id, startdate, description, finished} = data[i];

            // Format timestamp to date and time
            var date = new Date(startdate);

            var f_data = {
                "id": task_id,
                "name": task_name,
                "category": category_id,
                "time": date.toLocaleTimeString('en-US', {hour: '2-digit', minute: '2-digit',}),
                "date": date.toLocaleDateString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric' }),
                "description": description,
                "finished": finished
            }
            
            if(categoryFilter && categoryFilter != -1) // -1 is the ALL categories filter
            {
                if(f_data["category"] == categoryFilter)
                {
                    formatted_data.push(f_data);
                }
            } 
            else 
            {
                formatted_data.push(f_data);
            }
        }

        return formatted_data;

    } catch (error) {
        throw new Error(error);
    }
}

export async function getCategories(getSession) {
    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await getSession();
    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/category`, {
            method: "GET",
            headers: {
                "Authorization":IdToken,
                // "Content-Type":"application/json"
            },
        });

        // MUST throw error for react-query to catch!!!
        if(!response.ok)
        {
            throw new Error("ERROR: " + response.status)
        }

        let data = await response.json();
        return data;

    }  catch (error) {
        throw new Error(error);
    }
}

export async function addTask(data) {
    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await data.getSession();
    var task = data.task; // Need to initialize task like this, cannot do "data.task.category", for it to work for some reason...

    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task`, {
            method: "POST",
            headers: {
                "Authorization": IdToken,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                //task.category_id, task.task_name, task.desc, task.finished, task.startdate
                category_id: task.category,
                task_name: task.name,
                desc: task.description,
                finished: task.finished,
                startdate: new Date(task.date + ", " + task.time).getTime()
            })
        });

    //    let data= await response.json();
    //    data=JSON.stringify(data)
    //    console.log(data);

    //    return response.ok;

        // MUST throw error for react-query to catch!!!
        if(!response.ok)
        {
            throw new Error(response.status)
        }

    }  catch (error) {
        console.log("ERR - ADD TASK: ", error);
        throw new Error(error);
    }
}

export async function editTask(data) {
    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await data.getSession();
    var task = data.task; // Need to initialize task like this, cannot do "data.task.category", for it to work for some reason...
    var task_id = data.taskID;
    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task/${task_id}`, {
            method: "PATCH",
            headers: {
                "Authorization": IdToken,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                //task.category_id, task.task_name, task.desc, task.finished, task.startdate
                category_id: task.category,
                task_name: task.name,
                description: task.description,
                finished: task.finished,
                startdate: new Date(task.date + ", " + task.time).getTime()
            })
        });

    //    let data= await response.json();
    //    data=JSON.stringify(data)
    //    console.log(data);

    //    return response.ok;

    }  catch (error) {
        console.log("ERR - ADD TASK: ", error);
        throw new Error(error);
    }
}

export async function addCategory(data) {

    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await data.getSession();

    var category = data.category;

    console.log(category);
    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/category`, {
            method: "POST",
            headers: {
                "Authorization": IdToken,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                category_name : category["category_name"],
                color_code : category["category_color"]
            })
        });

        if(!response.ok)
        {
            throw new Error("[ERROR] ADD CATEGORY: " + response.status)
        }

        let data= await response.json();
        data=JSON.stringify(data)
        console.log(data);

        return response.ok;

    }  catch (error) {
        throw new Error(error);
    }
}

export async function deleteTask(data) {
    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await data.getSession();

    var task_id = data.taskID;
    
    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task/${task_id}`, {
          method: "DELETE",
          headers: {
              "Authorization": IdToken,
          },
        });

        if(!response.ok)
        {
            throw new Error("[ERROR] DELETE TASK: " + response.status)
        }

    //    let data = await response.json();
    //    return response.ok;

    }  catch (error) {
        console.log("ERROR - DELETE TASK: ", error);
        throw new Error(error);
    }
}

export async function deleteCategory(data) {
    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await data.getSession();

    var cat_id = data.category;

    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/category/${cat_id}`, {
            method: "DELETE",
            headers: {
                "Authorization":IdToken,
                "Content-Type":"application/json"
            },
        });

        if(!response.ok)
        {
            throw new Error("[ERROR] DELETE CATEGORY: " + response.status)
        }

    //    let data = await response.json();
    //    return response.ok;

    }  catch (error) {
        throw new Error(error);
    }
}

export async function finishTask(data) {
    //var IdToken = JSON.parse(localStorage.getItem("authTokens"))["idToken"]["jwtToken"];
    const { IdToken } = await data.getSession();
    var task_id = data.taskID;
    var current_status = data.current_status;
    try {
        let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task/${task_id}`, {
            method: "PATCH",
            headers: {
                "Authorization":IdToken,
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                //task.category_id, task.task_name, task.desc, task.finished, task.startdate
                //task_name: "UpdatedTask"
                finished: !current_status
            })
        });

        if(!response.ok)
        {
            throw new Error("[ERROR] FINISH CATEGORY: " + response.status)
        }

    //    let data = await response.json();
    //    return response.ok;

    }  catch (error) {
        throw new Error(error);
    }
}
