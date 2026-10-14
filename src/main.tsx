
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { GuestUploadPage } from "./app/GuestUploads.tsx";
  import "./styles/index.css";

  // Table QR codes link to /?upload=<tableId>, which opens the guest upload page instead of the site.
  const uploadTable = new URLSearchParams(window.location.search).get("upload");

  createRoot(document.getElementById("root")!).render(
    uploadTable ? <GuestUploadPage tableId={Number(uploadTable)} /> : <App />
  );
  