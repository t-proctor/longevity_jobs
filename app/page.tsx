import Jobs from "@/app/jobs/page";

export const runtime = 'edge';  // Add this line

export default async function Index() {
  return (
    <>
      <Jobs />
    </>
  );
}
