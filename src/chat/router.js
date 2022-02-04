import React from "react";
import {Route, Routes} from "react-router-dom";
import Login from "./login";
import Join from "./join";
import ChatList from "./list";
import ChatView from "./view";

function Router() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/join" element={<Join/>} />
                <Route path="/list" element={<ChatList/>} />
                <Route path="/view/:roomId" element={<ChatView />} />
            </Routes>
        </>
    )
}

export default Router