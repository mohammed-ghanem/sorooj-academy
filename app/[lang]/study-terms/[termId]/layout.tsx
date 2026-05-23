import StudyTermRouteGuard from "@/components/studyTerms/StudyTermRouteGuard";

export default function StudyTermLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StudyTermRouteGuard>{children}</StudyTermRouteGuard>;
}
