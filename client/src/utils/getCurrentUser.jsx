const getCurrentUser = () =>{
    // console.log("the current useer is "+JSON.parse(localStorage.getItem("currentUser")))
    return JSON.parse(localStorage.getItem("currentUser"));

};
export default getCurrentUser;