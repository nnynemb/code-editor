import "./Output.scss";

const Output = ({ output }) => {
    const htmlContent = output.replace(/\n/g, "<br>");
    return (
        <div className="output" dangerouslySetInnerHTML={{ __html: htmlContent }}/>
    );
};

export default Output;