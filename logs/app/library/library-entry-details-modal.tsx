/**
 * LibraryEntryDetailsModal.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   The **LibraryEntryDetailsModal** component provides a detailed view of a specific library entry,
 *   allowing users (admins) to view detailed information, edit the entry, and perform checkout/return actions for the book.
 *   The modal is designed to handle both viewing and editing modes, as well as book checkout and return functionalities.
 *
 * Key Features:
 *   - Displays detailed information about a library entry, including title, author, publication year, creation date, status, borrower information, and remarks.
 *   - Provides buttons for admins to edit the entry, check out the book, or return it.
 *   - Opens additional dialogs for editing the entry and checking out/returning the book.
 *   - Admin functionality includes access to edit or change book status (checked out or available).
 *   - Includes navigation to related dialogs such as **EditLibraryEntryDialog** and **CheckoutBookDialog** for updating and managing books.
 *
 * Key Components:
 *   - `Dialog`: Displays the modal containing detailed information and options for actions.
 *   - `Button`: Provides actionable buttons for editing the entry, checking out the book, or returning it.
 *   - `Badge`: Displays the status of the book, such as "Borrowed" or "Available."
 *   - `EditLibraryEntryDialog`: A dialog to edit the details of the library entry.
 *   - `CheckoutBookDialog`: A dialog to check out or return the book.
 *   - `Pencil`, `BookUp`, `BookDown`, `FileText` (icons): Icons used for indicating actions like editing, checking out, returning, and viewing attachments.

 * Example Usage:
 *   ```tsx
 *   <LibraryEntryDetailsModal
 *     entry={selectedEntry}
 *     isOpen={isModalOpen}
 *     onClose={() => setIsModalOpen(false)}
 *     onUpdate={fetchUpdatedEntries}
 *     isAdmin={true}
 *   />
 *   ```
 *
 * Notes:
 *   - This modal is designed for admins and displays different actions based on whether the book is currently checked out.
 *   - **Edit** and **Checkout/Return** actions open respective dialogs that allow further management of the book's status.
 *   - The modal automatically reflects the updated state once the entry is edited, checked out, or returned, and it refreshes the relevant data.
 */

"use client"

import { useState } from "react"
import type { LibraryEntry } from "@/prisma/generated/main"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { BookUp, BookDown, Pencil, FileText } from "lucide-react"
import { EditLibraryEntryDialog } from "./edit-library-entry-dialog"
import { CheckoutBookDialog } from "./checkout-book-dialog"

interface LibraryEntryDetailsModalProps {
  entry: LibraryEntry | null
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
  isAdmin: boolean
}

export function LibraryEntryDetailsModal({ entry, isOpen, onClose, onUpdate, isAdmin }: LibraryEntryDetailsModalProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isCheckoutDialogOpen, setIsCheckoutDialogOpen] = useState(false)

  if (!entry) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl">Library Entry Details</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">{entry.title}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-800">
                  {entry.category}
                </Badge>
                <span className="text-sm text-muted-foreground">Ref: {entry.refNo}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Author</h3>
                  <p>{entry.author || "—"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Publication Year</h3>
                  <p>{entry.pubYear || "—"}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Creation Date</h3>
                  <p>{entry.creationDate && format(new Date(entry.creationDate), "PPP")}</p>
                </div>

                {entry.attachmentUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Attachment</h3>
                    <a
                      href={entry.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1"
                    >
                      <FileText className="h-4 w-4" />
                      View Document
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  {entry.borrower ? (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 mt-1">
                      Borrowed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-green-100 text-green-800 mt-1">
                      Available
                    </Badge>
                  )}
                </div>

                {entry.borrower && (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Borrower</h3>
                      <p>{entry.borrower}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Loan Date</h3>
                      <p>{entry.loanDate && format(new Date(entry.loanDate), "PPP")}</p>
                    </div>
                  </>
                )}

                {entry.remarks && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Remarks</h3>
                    <p className="whitespace-pre-line">{entry.remarks}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {isAdmin && (
              <>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                {entry.borrower ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsCheckoutDialogOpen(true)}
                    className="bg-green-50 text-green-800 hover:bg-green-100 border-green-200"
                  >
                    <BookDown className="h-4 w-4 mr-2" />
                    Return Book
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsCheckoutDialogOpen(true)}
                    className="bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200"
                  >
                    <BookUp className="h-4 w-4 mr-2" />
                    Check Out
                  </Button>
                )}
              </>
            )}

            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isAdmin && (
        <>
          <EditLibraryEntryDialog
            entry={entry}
            isOpen={isEditDialogOpen}
            onClose={() => setIsEditDialogOpen(false)}
            onSuccess={() => {
              onUpdate()
              setIsEditDialogOpen(false)
            }}
          />

          <CheckoutBookDialog
            book={entry}
            isOpen={isCheckoutDialogOpen}
            onClose={() => setIsCheckoutDialogOpen(false)}
            onSuccess={() => {
              onUpdate()
              setIsCheckoutDialogOpen(false)
            }}
          />
        </>
      )}
    </>
  )
}

