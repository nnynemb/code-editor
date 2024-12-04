const base_url =  process.env.REACT_APP_API;

const compilerService = {
    runCode: ({ code, language }) => {
        return fetch(`${base_url}run-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, language })
        })
    }
}

export default compilerService