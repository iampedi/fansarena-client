// src/pages/about/Index.jsx
import img from "@/assets/images/about-us.webp";
import { LinkedinIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { SocialIcon } from "react-social-icons";

const AboutPage = () => {
  return (
    <div className="container mx-auto mb-10 px-4">
      <div className="rever grid gap-5 md:grid-cols-5 md:gap-10">
        <div className="order-2 md:order-1 md:col-span-2">
          <img src={img} alt="" className="rounded-2xl" />
          <div className="mt-6 flex items-center gap-2">
            <span className="mr-2 text-xl font-bold">Let’s Connect!</span>
            <SocialIcon
              url="https://www.linkedin.com/in/pediland/"
              target="_blank"
              network="linkedin"
              className="!size-8"
            />
            <SocialIcon
              url="https://github.com/iampedi"
              target="_blank"
              network="github"
              className="!size-8"
            />
          </div>
        </div>
        <div className="order-1 md:col-span-3">
          <h1 className="mb-3 text-3xl font-extrabold">
            Followers are not Fans!
          </h1>
          <div className="mb-6 space-y-3 text-lg">
            <p>
              On social media, follower counts don’t reflect true passion. Not
              every follower is a real football fan—and official fan club
              statistics are often unclear.
            </p>
            <p>
              Plus, most people worldwide can’t even join their favorite club’s
              official fan organization due to barriers like geography,
              language, or complex processes.
            </p>
            <p>
              <strong>Fans Arena</strong> changes this. Here, any true fan,
              anywhere in the world, can officially register their
              support—openly and easily. For the first time, team popularity and
              rankings are revealed by real fans, for real fans.
            </p>
          </div>
          <h2 className="mb-2 text-2xl font-extrabold">
            Beta Version – Portfolio Project
          </h2>
          <div className="space-y-3 text-lg">
            <p>
              This beta version of Fans Arena is available as a demonstration
              project. It was designed and developed as the final project of the{" "}
              <Link
                to="https://www.ironhack.com/de-en/web-development/remote"
                target="_blank"
                className="font-medium text-blue-700 underline"
              >
                Ironhack
              </Link>{" "}
              Web Development Bootcamp by Pedram Ghane (Full Stack Developer),
              using modern technologies including:
            </p>
            <ul className="list-disc pl-10 font-semibold">
              <li>MongoDB</li>
              <li>Express.js</li>
              <li>React</li>
              <li>Node.js</li>
              <li>Tailwind CSS</li>
              <li>shadcn/ui</li>
            </ul>
            <p>
              The live version and source code are presented here as part of the
              developer’s portfolio and showcase. A commercial version of this
              project will be released soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
