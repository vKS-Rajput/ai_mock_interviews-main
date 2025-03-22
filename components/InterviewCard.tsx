import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import DisplayTechIcons from "./DisplayTechIcons";
import { cn, getRandomInterviewCover } from "@/lib/utils";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";

interface InterviewCardProps {
  interviewId: string;
  userId?: string;
  role: string;
  type: string;
  techstack: string[];
  createdAt: string;
}

const InterviewCard = async ({
  interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const feedback =
    userId && interviewId
      ? await getFeedbackByInterviewId({
          interviewId,
          userId,
        })
      : null;

  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;

  const badgeColor =
    {
      Behavioral: "bg-blue-500 text-white",
      Mixed: "bg-purple-500 text-white",
      Technical: "bg-green-500 text-white",
    }[normalizedType] || "bg-gray-600 text-white";

  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now()
  ).format("MMM D, YYYY");

  return (
    <div className="group w-full max-w-[360px] min-h-96 bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden border border-gray-700">
      <div className="relative p-6">
        {/* Type Badge */}
        <div
          className={cn(
            "absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium",
            badgeColor
          )}
        >
          {normalizedType}
        </div>

        {/* Cover Image */}
        <div className="flex justify-center">
          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="rounded-full object-cover size-[90px] border-4 border-gray-700 shadow-md"
          />
        </div>

        {/* Interview Role */}
        <h3 className="mt-5 text-2xl font-bold text-center text-white capitalize">
          {role} Interview
        </h3>

        {/* Date & Score */}
        <div className="flex justify-center gap-6 mt-4 text-gray-300">
          <div className="flex items-center gap-2">
            <Image
              src="/calendar.svg"
              width={20}
              height={20}
              alt="calendar"
              className="opacity-70"
            />
            <p>{formattedDate}</p>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/star.svg"
              width={20}
              height={20}
              alt="star"
              className="opacity-70"
            />
            <p>{feedback?.totalScore || "---"}/100</p>
          </div>
        </div>

        {/* Feedback or Placeholder Text */}
        <p className="mt-5 text-center text-gray-300 line-clamp-2">
          {feedback?.finalAssessment ||
            "You haven't taken this interview yet. Take it now to improve your skills."}
        </p>
      </div>

      {/* Tech Stack and Button */}
      <div className="p-6 border-t border-gray-700">
        <div className="flex justify-between items-center">
          <DisplayTechIcons techStack={techstack} />

          <Button
            asChild
            className="bg-blue-400 hover:bg-blue-500 text-white transition-transform transform hover:scale-105"
          >
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "View Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
