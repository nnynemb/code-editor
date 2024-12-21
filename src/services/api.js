const base_url =  process.env.REACT_APP_COMPILER_API;

const compilerService = {
    runCode: ({ code, language, sessionId }) => {
        return fetch(`${base_url}run-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language, sessionId }),
        })
    }
}

export default compilerService