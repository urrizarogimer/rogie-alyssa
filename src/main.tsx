
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import { GuestUploadPage } from "./app/GuestUploads.tsx";
  import "./styles/index.css";

  // The guest QR code links to /?upload, which opens the upload page instead of the site.
  // Older table codes (/?upload=<id>) land on the same page.
  const isUploadPage = new URLSearchParams(window.location.search).has("upload");

  createRoot(document.getElementById("root")!).render(
    isUploadPage ? <GuestUploadPage /> : <App />
  );
  