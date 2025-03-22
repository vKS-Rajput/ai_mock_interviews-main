import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId, getLatestInterviews } from "@/lib/actions/general.action";

async function Home() {
  const user = await getCurrentUser();
  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <>
      <section className="relative flex flex-col items-center text-center py-16 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg">
        <h2 className="text-4xl font-bold">Get Interview-Ready with AI-Powered Practice & Feedback</h2>
        <p className="text-lg mt-3 max-w-xl">
          Practice real interview questions & get instant feedback to boost your confidence.
        </p>
        <Button asChild className="btn-primary mt-6 px-6 py-3 text-lg bg-white text-blue-600 hover:bg-gray-100 rounded-lg shadow-md">
          <Link href="/interview">Start an Interview</Link>
        </Button>
        <Image src="/robot.png" alt="AI Interview" width={400} height={400} className="absolute top-4 right-8 hidden md:block" />
      </section>

      <section className="mt-12 px-6">
        <h2 className="text-3xl font-semibold text-gray-800">Your Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {hasPastInterviews ? (
            userInterviews?.map((interview) => (
              <InterviewCard interviewId={""} key={interview.id} {...interview} userId={user?.id} />
            ))
          ) : (
            <p className="text-gray-600">You haven't taken any interviews yet.</p>
          )}
        </div>
      </section>

      <section className="mt-12 px-6">
        <h2 className="text-3xl font-semibold text-gray-800">Available Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {hasUpcomingInterviews ? (
            allInterview?.map((interview) => (
              <InterviewCard interviewId={""} key={interview.id} {...interview} userId={user?.id} />
            ))
          ) : (
            <p className="text-gray-600">There are no available interviews at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;