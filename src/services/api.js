import axios from "axios";
const base_url = "http://localhost:3000/";

const compilerService = {
    runCode: async ({ code, language }) => {
        return axios.post(`${base_url}run-code`, { code, language });
    }
}

export default compilerService