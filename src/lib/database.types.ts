export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          user_id: string;
          entry_type: "photo" | "journal";
          journal_space: "photo_notes" | "journals" | null;
          journal_category: "life" | "study" | "fragment" | null;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_photo_url: string | null;
          location: string | null;
          shot_at: string | null;
          camera: string | null;
          aperture: string | null;
          shutter_speed: string | null;
          iso: string | null;
          status: "draft" | "published";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_type?: "photo" | "journal";
          journal_space?: "photo_notes" | "journals" | null;
          journal_category?: "life" | "study" | "fragment" | null;
          slug: string;
          title: string;
          excerpt?: string | null;
          content: string;
          cover_photo_url?: string | null;
          location?: string | null;
          shot_at?: string | null;
          camera?: string | null;
          aperture?: string | null;
          shutter_speed?: string | null;
          iso?: string | null;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_type?: "photo" | "journal";
          journal_space?: "photo_notes" | "journals" | null;
          journal_category?: "life" | "study" | "fragment" | null;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          cover_photo_url?: string | null;
          location?: string | null;
          shot_at?: string | null;
          camera?: string | null;
          aperture?: string | null;
          shutter_speed?: string | null;
          iso?: string | null;
          status?: "draft" | "published";
          created_at?: string;
          updated_at?: string;
        };
      };
      photos: {
        Row: {
          id: string;
          note_id: string;
          user_id: string;
          storage_path: string;
          caption: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          note_id: string;
          user_id: string;
          storage_path: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          note_id?: string;
          user_id?: string;
          storage_path?: string;
          caption?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
    };
  };
};
