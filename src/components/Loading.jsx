import Spinner from "react-bootstrap/Spinner";
import "../assets/css/loading.css";

function Loading() {
  return (
    <div className="loading-overlay">
      <div className="loading-background"></div>
      <Spinner className="loading-circle" animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}

export default Loading;
