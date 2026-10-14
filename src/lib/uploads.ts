import { supabase, supabaseUrl, supabaseAnonKey } from "./supabase";

// Tables and bucket are created by supabase/migrations/20261014000000_guest_uploads.sql

export const UPLOAD_BUCKET = "guest-uploads";
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // Supabase free plan per-file limit
export const SITE_URL = "https://rogiealyssawedding.vercel.app";

export interface UploadTable {
  id: number;
  label: string;
  created_at: string;
}

export interface GuestUpload {
  id: number;
  table_id: number | null;
  table_label: string;
  uploader_name: string | null;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

/** The link a table's QR code points to. Uses the live site when the admin is on localhost. */
export function uploadLinkFor(tableId: number): string {
  const { hostname, origin } = window.location;
  const base = hostname === "localhost" || hostname === "127.0.0.1" ? SITE_URL : origin;
  return `${base}/?upload=${tableId}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 MB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

// ─── Tables ────────────────────────────────────────────────────────────────────

export async function fetchUploadTables(): Promise<UploadTable[]> {
  try {
    const { data, error } = await supabase.from("upload_tables").select("*").order("id", { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching upload tables:", error);
    return [];
  }
}

export async function fetchUploadTable(id: number): Promise<UploadTable | null> {
  try {
    const { data, error } = await supabase.from("upload_tables").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching upload table:", error);
    return null;
  }
}

export async function createUploadTable(label: string): Promise<UploadTable | null> {
  try {
    const { data, error } = await supabase.from("upload_tables").insert([{ label }]).select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating upload table:", error);
    return null;
  }
}

export async function deleteUploadTable(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("upload_tables").delete().eq("id", id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting upload table:", error);
    return false;
  }
}

// ─── Uploads ───────────────────────────────────────────────────────────────────

function storagePathFor(table: UploadTable, file: File): string {
  const dot = file.name.lastIndexOf(".");
  const ext = dot > 0 ? file.name.slice(dot + 1).toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 8) : "";
  const stem = (dot > 0 ? file.name.slice(0, dot) : file.name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "file";
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `table-${table.id}/${unique}-${stem}${ext ? `.${ext}` : ""}`;
}

/**
 * Uploads straight to the Storage REST endpoint with XHR so guests see real
 * progress (supabase-js upload has no progress events), then records it.
 */
export function uploadGuestFile(
  file: File,
  table: UploadTable,
  uploaderName: string,
  onProgress: (fraction: number) => void,
): Promise<void> {
  const path = storagePathFor(table, file);
  const contentType = file.type || "application/octet-stream";

  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${supabaseUrl}/storage/v1/object/${UPLOAD_BUCKET}/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${supabaseAnonKey}`);
    xhr.setRequestHeader("apikey", supabaseAnonKey);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) onProgress(e.loaded / e.total); };
    xhr.onerror = () => reject(new Error("Connection lost. Please try again."));
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else if (xhr.status === 413) reject(new Error("This file is too large."));
      else reject(new Error("Upload failed. Please try again."));
    };
    xhr.send(file);
  }).then(async () => {
    const { error } = await supabase.from("guest_uploads").insert([{
      table_id: table.id,
      table_label: table.label,
      uploader_name: uploaderName || null,
      file_path: path,
      file_type: contentType,
      file_size: file.size,
    }]);
    if (error) {
      console.error("Error recording guest upload:", error);
      throw new Error("Upload failed. Please try again.");
    }
  });
}

export async function fetchGuestUploads(): Promise<GuestUpload[]> {
  try {
    const { data, error } = await supabase.from("guest_uploads").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching guest uploads:", error);
    return [];
  }
}

/** Short-lived links for the private bucket, keyed by file path. */
export async function signedUrlsFor(paths: string[]): Promise<Record<string, string>> {
  if (paths.length === 0) return {};
  try {
    const { data, error } = await supabase.storage.from(UPLOAD_BUCKET).createSignedUrls(paths, 60 * 60);
    if (error) throw error;
    const urls: Record<string, string> = {};
    for (const item of data || []) if (item.path && item.signedUrl) urls[item.path] = item.signedUrl;
    return urls;
  } catch (error) {
    console.error("Error creating signed URLs:", error);
    return {};
  }
}

export async function downloadUrlFor(upload: GuestUpload): Promise<string | null> {
  const fileName = upload.file_path.split("/").pop() || "wedding-upload";
  const { data, error } = await supabase.storage.from(UPLOAD_BUCKET).createSignedUrl(upload.file_path, 60, { download: fileName });
  if (error) {
    console.error("Error creating download URL:", error);
    return null;
  }
  return data.signedUrl;
}

export async function deleteGuestUpload(upload: GuestUpload): Promise<boolean> {
  try {
    const { error: storageError } = await supabase.storage.from(UPLOAD_BUCKET).remove([upload.file_path]);
    if (storageError) throw storageError;
    const { error } = await supabase.from("guest_uploads").delete().eq("id", upload.id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting guest upload:", error);
    return false;
  }
}
