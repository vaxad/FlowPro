import { TabsDemo } from "@/components/custom/tabs";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MouseIcon } from "lucide-react";
import Link from "next/link";
import { Marquee } from "@devnomic/marquee";
import "@devnomic/marquee/dist/index.css"; // if you copy ala shadcn, no need import css.

export default function Landing() {
  return (
    <>
      <main className=" flex flex-col justify-center flex-grow  mx-10  min-h-[90vh]">
        <div className="  rounded-3xl p-6 min-h-[90vh] mt-2 relative overflow-clip">
          <div className="flex flex-col mt-4">
            <div className="grid grid-cols-[1fr_auto_1fr] w-full mb-20">
              <div className="">
                <Marquee
                  reverse={true}
                  fade={true}
                  className="gap-[3rem] [--duration:7s]"
                >
                  <img src="/marquee schema.png" alt="" />
                </Marquee>
              </div>
              <div className="dividerWrapper z-10">
                <div></div>
                <div></div>
                <div></div>
              </div>
              <div className="">
                <Marquee
                  reverse={true}
                  fade={true}
                  className="gap-[3rem] [--duration:7s]"
                >
                  <img src="/Frame 25.png" alt="" />
                  <img src="/Frame 25.png" alt="" />
                </Marquee>
              </div>
            </div>

            <div className="z-10">
              <div className="chipsWrapper2 w-fit mx-auto mb-4">
                <span className="chip2 backdrop-blur-md">Prompts</span>
                <div className="linkWrapper2">
                  <div className="link2"></div>
                  <div className="switch2"></div>
                </div>
                <span className="chip2 active2">ER Diagram</span>
                <div className="linkWrapper2 rotate-180">
                  <div className="link2"></div>
                  <div className="switch2"></div>
                </div>
                <span className="chip2 backdrop-blur-md" >BRD</span>
              </div>

              <h1 className=" text-6xl font-medium pb-4 mx-auto text-center bg-clip-text bg-gradient-to-b from-white to-slate-500 text-transparent ">
                Built for Laymen.
              </h1>
              <p className=" text-sm font-light text-center mx-auto text-gray-400 w-[35rem]">
                No code? No problem - FlowPI is designed to be user-friendly and
                intuitive, so you can create your own APIs without writing a
                single line of code.
              </p>
            </div>
            <Link
              href="/create"
              className="text-center bg-white hover:bg-transparent hover:border hover:text-white text-black px-4 mt-4 py-2 rounded-full w-fit mx-auto"
            >
              Try it out!
            </Link>
          </div>
          <div className="h-full w-full justify-center items-center flex pt-24">
            <a
              href="#tabs-demo"
              className={cn(
                buttonVariants({ variant: "default" }),
                "opacity-30 rounded-full animate-pulse cursor-pointer"
              )}
            >
              Scroll for features
              <span>
                <MouseIcon size={20} />
              </span>
            </a>
          </div>

          <div className="bgGrad h-72 w-[2000px] absolute -bottom-10 -ml-20 -z-10"></div>
        </div>
        <div className=" rounded-3xl p-6 min-h-[90vh] mt-16 relative overflow-clip">
          <div className="flex flex-col mt-10">
            <div className="z-10">
              <h1 className=" text-6xl font-medium pb-4 mx-auto text-center bg-clip-text bg-gradient-to-b from-white to-slate-300 text-transparent ">
                Built for Developers.
              </h1>
              <p className=" text-sm font-light text-center mx-auto text-gray-200 w-[35rem]">
                Automate the creation of fully functional REST APIs for your
                database models, including CRUD operations, authentication, and
                Prisma ORM integration.{" "}
              </p>
            </div>
          </div>
          <div className="chipsWrapper w-fit mx-auto mt-8">
            <span className="chip backdrop-blur-md">ER Diagram</span>
            <div className="linkWrapper">
              <div className="link"></div>
              <div className="switch"></div>
            </div>
            <span className="chip active">Code</span>
            <div className="linkWrapper">
              <div className="link"></div>
              <div className="switch"></div>
            </div>
            <span className="chip backdrop-blur-md">Dependency Graph</span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] w-full mt-24">
            <div className="">
              <Marquee
                reverse={true}
                fade={true}
                className="gap-[3rem] [--duration:7s]"
              >
                <img src="/marquee schema.png" alt="" />
              </Marquee>
            </div>
            <div className="dividerWrapper2 z-10">
              <div></div>
              <div></div>
              <div></div>
            </div>
            <div className="">
              <Marquee
                reverse={true}
                fade={true}
                className="gap-[3rem] [--duration:7s]"
              >
                <img src="/Frame 25.png" alt="" />
                <img src="/Frame 25.png" alt="" />
              </Marquee>
            </div>
          </div>

          <div className="bgGrad2 h-72 w-[2000px] absolute -top-10 -ml-20 -z-10"></div>
        </div>
      </main>
      <TabsDemo />
    </>
  );
}
