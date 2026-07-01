import { supabase } from "./supabase";

export type RsvpStatus = "confirmed" | "pending" | "declined";

export interface RsvpEntry {
  id: number;
  name: string;
  email: string;
  attending: string;
  guests: string;
  meal: string;
  message: string;
  status: RsvpStatus;
  submitted_at: string;
  invited?: boolean;
  created_at?: string;
}

// ─── RSVP Operations ───────────────────────────────────────────────────────────

export async function fetchRsvps(): Promise<RsvpEntry[]> {
  try {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("submitted_at", { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }
}

export async function createRsvp(rsvp: Omit<RsvpEntry, "id" | "created_at">): Promise<RsvpEntry | null> {
  try {
    const { data, error } = await supabase
      .from("rsvps")
      .insert([
        {
          name: rsvp.name,
          email: rsvp.email,
          attending: rsvp.attending,
          guests: rsvp.guests,
          meal: rsvp.meal,
          message: rsvp.message,
          status: rsvp.status,
          submitted_at: rsvp.submitted_at,
          invited: rsvp.invited || false,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating RSVP:", error);
    return null;
  }
}

export async function updateRsvpStatus(id: number, status: RsvpStatus): Promise<boolean> {
  try {
    const { error } = await supabase.from("rsvps").update({ status }).eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating RSVP status:", error);
    return false;
  }
}

export async function deleteRsvp(id: number): Promise<boolean> {
  try {
    const { error } = await supabase.from("rsvps").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return false;
  }
}

export async function updateRsvpInvited(id: number, invited: boolean): Promise<boolean> {
  try {
    const { error } = await supabase.from("rsvps").update({ invited }).eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating RSVP invited status:", error);
    return false;
  }
}

// ─── Email Invitations ───────────────────────────────────────────────────────────

export interface InvitationResult {
  success: boolean;
  error?: string;
}

export async function sendInvitationEmail(email: string, name: string): Promise<InvitationResult> {
  try {
    console.log(`📧 Attempting to send invitation to ${email}...`);

    const { data, error } = await supabase.functions.invoke("send-wedding-invitation", {
      body: {
        email,
        name,
        weddingDate: "November 28, 2026",
        groomName: "Rogimer",
        brideName: "Alyssa Camille",
      },
    });

    if (error) {
      const message = error.message || "Edge function request failed";
      console.error("❌ Edge Function Error:", error);
      return { success: false, error: message };
    }

    if (data?.success === false) {
      const message = data.error || "Email service error";
      console.error("❌ Email Send Failed:", message);
      return { success: false, error: message };
    }

    console.log("✅ Email sent successfully:", data);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Error sending invitation email:", error);
    console.error("Details:", message);
    return { success: false, error: message };
  }
}

export async function markAsInvited(id: number, email: string, name: string): Promise<InvitationResult> {
  try {
    const result = await sendInvitationEmail(email, name);

    if (result.success) {
      await updateRsvpInvited(id, true);
    }

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error in markAsInvited:", error);
    return { success: false, error: message };
  }
}
