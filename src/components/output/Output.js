import "./Output.scss";

const Output = ({ output }) => {
    const htmlContent = output.replace(/\n/g, "<br>");
    return (
        <div className="output ml-2" dangerouslySetInnerHTML={{ __html: htmlContent }}/>
    );
};

export default Output;