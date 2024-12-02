const base_url = "http://localhost:8000/";

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