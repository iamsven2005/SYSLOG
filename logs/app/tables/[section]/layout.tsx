export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="m-5 p-5">
          {children}
    </div>
  )
}

