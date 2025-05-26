/**
 * emergency-contact-actions.ts - 2025-05-26 by sven.tan
 *
 * Description:
 *   This function updates the emergency contact information for a specific user in the database.
 *   It accepts a `userId` and an `EmergencyContactData` object, then updates the relevant fields 
 *   in the `user` table, including primary and secondary contact details, relationships, and remarks.
 * 
 * Parameters:
 *   - `userId`: The ID of the user whose emergency contact information is to be updated.
 *   - `data`: An object containing the emergency contact data to be updated. It includes fields such as:
 *     - `PrimaryContact`: Primary emergency contact person's name.
 *     - `MobileContact`: Primary emergency contact's mobile number.
 *     - `Relationship`: The relationship to the primary contact (e.g., "Spouse").
 *     - `SecondContact`: Secondary emergency contact person's name.
 *     - `SecondMobile`: Secondary emergency contact's mobile number.
 *     - `SecondRelationship`: The relationship to the secondary contact (e.g., "Friend").
 *     - `Remarks`: Any additional remarks.
 * 
 * Behavior:
 *   - The function updates the user's emergency contact information in the `user` table using Prisma.
 *   - It conditionally handles undefined or null values for each field, ensuring that only valid values are saved.
 *   - The function returns a success indicator (`{ success: true }` if the update is successful, `{ success: false }` if there is an error).
 * 
 * Error Handling:
 *   - If an error occurs during the update operation, the function logs the error and returns a failure response (`{ success: false }`).
 */


"use server"

import { db } from "@/lib/db"
import { EmergencyContactData } from "./page"

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
