import {useRequestJson} from "@/plugins/native/axios";
import {Announcement} from "./AnnouncementTypes";

export interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: {
    announcements: Announcement[];
    count: number;
  };
  code: number;
}

export async function getAnnouncements(offset: number = 0, limit: number = 10): Promise<AnnouncementResponse> {
  if (import.meta.env.DEV) {
    return {success: true, message: '', code: 200, data: {announcements: [], count: 0}}
  }
  return useRequestJson<AnnouncementResponse>(
    `https://es-client.esion.xyz/api/announcement/list?offset=${offset}&limit=${limit}`,
    {
      method: 'GET'
    }
  );
}