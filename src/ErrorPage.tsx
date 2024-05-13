import ErrorPage_SVG from "./Assets/ErrorSVG.svg";

export const ErrorPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ width: "50%" }}>
        <img src={ErrorPage_SVG} style={{ width: "100%" }} alt="Error" />
      </div>
      <h1>Seite nicht gefunden.</h1>
    </div>
  );
};
