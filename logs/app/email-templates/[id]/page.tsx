import EmailTemplateDetailPage from "./emailclient"

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  return <EmailTemplateDetailPage params={params} />
}