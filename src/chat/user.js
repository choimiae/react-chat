import React, {useEffect} from "react";
import axios from "axios";

export function refreshToken(userId) {
    axios({
        method: "post",
        url: "/login/refresh",
        data: {
            userId: userId,
        }
    }).then(response => {
        console.log(response);
    });
}

export function user() {
    const data = JSON.parse(localStorage.getItem("user"));

    axios.defaults.headers.common["Authorization"] = data.token;
    return data;
}