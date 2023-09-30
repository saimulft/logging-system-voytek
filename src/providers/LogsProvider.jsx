import React, { createContext, useEffect, useState } from 'react';

export const LogsContext = createContext(null)

const LogsProvider = ({children}) => {
    const [projectLogs, setProjectLogs] = useState([])

    const logsInfo = {
        projectLogs, setProjectLogs
    }

    return (
        <LogsContext.Provider value={logsInfo}>
            {children}
        </LogsContext.Provider>
    );
};

export default LogsProvider;