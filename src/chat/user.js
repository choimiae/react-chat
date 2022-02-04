import React from "react";
import axios from "axios";
import Login from "./login";

export function user() {
    const token = localStorage.getItem("token");

    // 토큰 없을 경우 리프래시 호출 -> 리프래시 토큰도 없을 경우 login 페이지로 넘김
    /*if(token === null || token === "") {
        console.log(token)
        axios({
            method: "post",
            url: "/login/refresh",
            data: {
                userId: localStorage.getItem("userId"),
            }
        }).then(response => {
            if(response.data === "success") {
                localStorage.setItem("token", response.data.data.accessToken);
                token = response.data.data.accessToken;

            } else {
                return (
                    <Login />
                )
            }
        });
    }*/

    axios.defaults.headers.common["Authorization"] = token;
    return token;
}