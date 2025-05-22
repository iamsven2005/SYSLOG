"use server"

import { db } from "@/lib/db"
import { EmergencyContactData } from "./type"

export async function updateEmergencyContactInfo(userId: number, data: EmergencyContactData) {
    try {
        await db.user.update({
            where: { id: userId },
            data: {
                PrimaryContact: data.PrimaryContact ?? undefined,
                MobileContact: typeof data.MobileContact === "string"
                    ? parseInt(data.MobileContact)
                    : data.MobileContact ?? null,
                Relationship: data.Relationship ?? undefined,
                SecondContact: data.SecondContact ?? undefined,
                SecondMobile: typeof data.SecondMobile === "string"
                    ? parseInt(data.SecondMobile)
                    : data.SecondMobile ?? null,
                SecondRelationship: data.SecondRelationship ?? undefined,
                Remarks: data.Remarks ?? undefined,
            },
        })


        return { success: true }
    } catch (error) {
        console.error("Failed to update emergency contact:", error)
        return { success: false }
    }
}
