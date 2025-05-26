/*
 * app/home/page.tsx - 2025-05-26 by sven.tan
 *
 * Description:
 *   A landing page for the project documentation section, showcasing key documentation areas with links to detailed guides.
 *   The page presents sections like "Chat Documentation", "Authentication Guide", and "Alerts System" in a grid layout, 
 *   providing users with easy access to different parts of the documentation. Each section is represented by a card with a title, 
 *   description, and an icon.
 *
 * Features:
 *   - **Grid Layout**: Displays documentation sections in a responsive grid with a hover effect for each section card.
 *   - **Card Components**: Each documentation section is displayed inside a `Card` component with a title, description, and an icon.
 *   - **Navigation Links**: Each card is a clickable link that navigates to the corresponding documentation page.
 *   - **Responsive Design**: The layout adapts to different screen sizes using TailwindCSS, with a single-column view on small screens and a three-column grid on larger screens.
 *   - **Header Section**: Includes a heading and description explaining the purpose of the documentation, centered at the top of the page.
 *
 * Returns:
 *   - Renders a list of documentation sections, each in a clickable card, directing the user to the relevant part of the application documentation.
 *
 * Dependencies:
 *   - Next.js `Link` component for navigation between pages
 *   - UI components from the `@/components/ui` library such as `Card`, `CardContent`, `CardHeader`, and `CardTitle`
 *   - TailwindCSS for styling and responsive layout
 *
 * Improvements:
 *   - Could add images or icons for each section for better visual appeal.
 *   - Implement dynamic fetching of documentation sections to allow easy updates without modifying the code.
 */

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  const sections = [
    {
      title: "Chat Documentation",
      description: "Learn how to implement and configure the chat system",
      href: "/docs/chat",
      icon: "💬",
    },
    {
      title: "Authentication Guide",
      description: "Set up user authentication and authorization",
      href: "/docs/auth",
      icon: "🔐",
    },
    {
      title: "Alerts System",
      description: "Configure and manage application alerts",
      href: "/docs/alerts",
      icon: "🚨",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Documentation</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comprehensive guides and documentation for your application features
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {sections.map((section) => (
            <Link key={section.href} href={section.href}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="text-3xl mb-2">{section.icon}</div>
                  <CardTitle className="text-xl">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{section.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-lg">
            <span className="text-blue-600 font-medium">📚 Browse all documentation sections above</span>
          </div>
        </div>
      </div>
    </div>
  )
}
