import React, { useState, useEffect } from "react";

import useLocalStorage from "./useLocalStorage";

export default _ => {
    const [isDarkMode, setDarkMode] = useLocalStorage("isDarkMode", true);
    
    useEffect(_ => {
        let list = document.body.classList;
        
        if(isDarkMode) list.add("dark-mode");
        else list.remove("dark-mode");
    }, [isDarkMode])

    return [isDarkMode, setDarkMode];
}